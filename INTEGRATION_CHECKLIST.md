# Banimal Commerce Pipeline — Integration Checklist

> One backend drives the whole order lifecycle: **Cloudflare Worker (`heyns1000/banimal`)**.
> Banimal = storefront + source of truth · Paystack = payments · Bob Go = rates/booking/tracking · Zoho = transactional mail.
>
> Last reconciled: 2026-06-28

---

## 0. Backend reconciliation — decision

You currently have **two** backends. They have diverged, and running both as order owners is the root cause of the "payments, delivery and comms are disconnected" failure mode.

| | **Cloudflare Worker** `heyns1000/banimal` | **Express app** (Vercel `banimal-six`) |
|---|---|---|
| Routes | 11 modules: delivery, payments, email, auth, coupons, analytics, giving, licenses, notifications, configuration, brands | 4: orders, order-by-ref, paystack/webhook, contact |
| Persistent storage | ✅ D1 + SQL migrations | ⚠️ SQLite on `/tmp` — **does not persist** on serverless |
| CI/CD | ✅ GitHub Action auto-deploys on push | Manual `vercel deploy` |
| Bob Go v2 (Bearer) | ✅ fixed & committed | ❌ none |
| Paystack webhook verify | ❌ stub (`payments.ts` is generic PayPal/Stripe scaffolding) | ✅ real HMAC-SHA512 verification |
| Email | SendGrid stub (not Zoho) | TODO stub |
| Runs where Zoho DNS lives | ✅ Cloudflare | ❌ |

### Verdict: **Cloudflare Worker is the single source of truth.**

It has persistent storage, CI/CD, the full route surface, the live Bob Go fix, and lives on Cloudflare alongside the Zoho DNS. The Express app's only advantage is its working Paystack webhook verification.

**Action:** port the Express webhook-verification logic into the Worker's `payments.ts`, then **retire the Express/Vercel backend as the order owner** (keep it only as a static-frontend preview if useful, with no `/api/*` authority).

- [ ] Port HMAC-SHA512 webhook verification into Worker `payments.ts` (code in §1.3)
- [ ] Repoint the live storefront's API base to the Worker domain
- [ ] Stop relying on `banimal-six.vercel.app/api/*` for orders/payments
- [ ] Confirm one order record (D1) ties cart → payment ref → shipment id → email status

---

## Order object (single lifecycle record, stored in D1)

```jsonc
{
  "orderId": "BNML-...",          // internal reference (also Paystack reference)
  "customer": { "name": "", "email": "", "phone": "" },
  "items": [ { "sku": "", "name": "", "qty": 1, "priceZAR": 0 } ],
  "subtotal": 0,
  "deliveryOption": "",           // chosen Bob Go service
  "deliveryFee": 0,
  "total": 0,
  "paystackReference": "",
  "paymentStatus": "pending",     // pending → paid → failed
  "bobgoShipmentId": "",
  "waybill": "",
  "trackingStatus": "",           // booked → in_transit → delivered
  "emailStatus": "",
  "welcomeSent": false,
  "confirmationSent": false,
  "status": "pending"             // pending → paid → booked → fulfilled
}
```

---

## 1. Phase 1 — Paystack (checkout live)  · priority 1

Money flow is the foundation. Do this first.

### Env vars (Worker secrets — `wrangler secret put`)
| Var | Purpose |
|---|---|
| `PAYSTACK_SECRET_KEY` | `sk_live_...` (or `sk_test_...` while testing). **Regenerate — the old live key was exposed in a screenshot.** |
| `PAYSTACK_PUBLIC_KEY` | `pk_live_...` / `pk_test_...` (frontend init) |

### Endpoints (Worker, mounted at `/api/payments`)
| Method | Path | Job |
|---|---|---|
| POST | `/api/payments/initialize` | Init Paystack transaction with order ref + metadata, return `authorization_url` |
| POST | `/api/payments/verify` | Server-side verify by reference before fulfilment |
| POST | `/api/paystack/webhook` | HMAC-verified status push → marks order `paid` |

### 1.1 Initialize (server-side, never trust client totals)
```
POST https://api.paystack.co/transaction/initialize
Authorization: Bearer $PAYSTACK_SECRET_KEY
Content-Type: application/json

{ "email": "...", "amount": <total_in_kobo_ZAR_cents>, "currency": "ZAR",
  "reference": "<orderId>",
  "metadata": { "order_reference": "<orderId>" },
  "callback_url": "https://www.banimal.co.za/order/confirmation" }
```

### 1.2 Verify (before marking fulfilled)
```
GET https://api.paystack.co/transaction/verify/<reference>
Authorization: Bearer $PAYSTACK_SECRET_KEY
```
Treat as paid only when `data.status === "success"` AND `data.amount` matches the stored total.

### 1.3 Webhook verification — port this into Worker `payments.ts`
```ts
// POST /api/paystack/webhook  (Hono + Web Crypto, Worker-compatible)
payments.post('/paystack/webhook', async (c) => {
  const secret = (c.env as any).PAYSTACK_SECRET_KEY as string
  const raw = await c.req.text()                    // raw body — required for HMAC
  const sig = c.req.header('x-paystack-signature') || ''

  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-512' }, false, ['sign'])
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(raw))
  const expected = [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, '0')).join('')

  if (sig !== expected) return c.json({ ok: false }, 401)

  const event = JSON.parse(raw)
  if (event?.event === 'charge.success') {
    const ref = event?.data?.metadata?.order_reference || event?.data?.reference
    if (ref) { /* await markOrderPaid(c.env, ref) */ }
  }
  return c.json({ ok: true }, 200)
})
```

### Status tests
```bash
# Webhook reachable over HTTPS (expect 401 on a forged signature — proves verification is ON)
curl -i -X POST https://www.banimal.co.za/api/paystack/webhook \
  -H 'x-paystack-signature: forged' -H 'Content-Type: application/json' \
  -d '{"event":"charge.success","data":{"reference":"TEST"}}'

# Secret key valid (expect HTTP 200 + "Authorization successful" or a real tx)
curl -s https://api.paystack.co/transaction/verify/nonexistent \
  -H "Authorization: Bearer $PAYSTACK_SECRET_KEY" | head
```

### Dashboard checklist
- [ ] Regenerate exposed live secret key
- [ ] Test vs live keys clearly separated
- [ ] Callback URL set → `https://www.banimal.co.za/order/confirmation`
- [ ] Webhook URL set → `https://www.banimal.co.za/api/paystack/webhook` (fix the old `banimal.faa.zone/...` mismatch)
- [ ] Backend verifies transaction before fulfilment
- [ ] Webhook returns 401 on bad signature, 200 on valid

---

## 2. Phase 2 — Bob Go (shipping automation)  · priority 2

Auth + base URL fix is **already committed** (`src/worker/routes/delivery.ts`): Bearer token, sandbox/production v2 base selected by `BOBGO_ENV`.

### Env vars
| Var | Purpose |
|---|---|
| `BOBGO_API_KEY` | API key used as Bearer token |
| `BOBGO_ENV` | `production` → `api.bobgo.co.za/v2`; unset/other → `api.sandbox.bobgo.co.za/v2` |

### Endpoints (Worker, mounted at `/api/delivery`)
| Method | Path | Job | When |
|---|---|---|---|
| POST | `/api/delivery/rates` | real-time rates | **before** payment (buyer sees options) |
| POST | `/api/delivery/book` | create shipment, store waybill | **only after** verified payment |
| GET | `/api/delivery/track/:waybill` | tracking status | post-fulfilment |

### Status tests
```bash
# Rates (sandbox). Falls back to default rates if BOBGO_API_KEY unset.
curl -s -X POST https://www.banimal.co.za/api/delivery/rates \
  -H 'Content-Type: application/json' \
  -d '{"toPostalCode":"0181","orderValueZAR":350,"parcelWeightKg":0.5}'

# Confirms Bearer auth reaches Bob Go v2 (expect 200 with rates[], not 401/404)
```

### Checklist
- [x] Base URL points to sandbox/production v2 correctly
- [x] `Authorization: Bearer <token>` (legacy `X-API-KEY` removed)
- [ ] `BOBGO_API_KEY` set as Worker secret
- [ ] Rates call returns live options before payment
- [ ] Booking call gated behind verified payment → stores `waybill` + `bobgoShipmentId`
- [ ] Flip `BOBGO_ENV=production` after sandbox passes

---

## 3. Phase 3 — Zoho (transactional mail)  · priority 3

Customers + staff need confirmations. **Note:** the Worker's `email.ts` currently uses **SendGrid**, not Zoho — pick one provider and standardise.

### DNS (Cloudflare — must be verified for deliverability)
| Record | Value |
|---|---|
| MX | `mx.zoho.com` (pri 10), `mx2.zoho.com` (20), `mx3.zoho.com` (50) |
| SPF (TXT) | `v=spf1 include:zoho.com ~all` |
| DKIM (TXT) | Zoho-provided selector key |
| DMARC (TXT, optional) | `v=DMARC1; p=quarantine; rua=mailto:postmaster@banimal.co.za` |

### Env vars (choose ONE path)
| Path | Vars |
|---|---|
| Zoho SMTP | `ZOHO_SMTP_USER`, `ZOHO_SMTP_PASS` (app-specific password), host `smtp.zoho.com:465` |
| Zoho ZeptoMail API | `ZEPTOMAIL_TOKEN` (best for Workers — HTTP, no raw SMTP) |

> Cloudflare Workers cannot open raw SMTP sockets. For the Worker, prefer **ZeptoMail HTTP API** (or keep SendGrid). Reserve Zoho SMTP for any non-Worker process.

### Triggers (already scaffolded in `email.ts`)
- [ ] `welcome` on first order → `welcomeSent`
- [ ] `order-confirmation` on `paid` → `confirmationSent`
- [ ] `order-update` on `booked`/`fulfilled`
- [ ] enquiry + auto-reply on contact form

### Status tests
```bash
# Verify DNS (run locally)
dig +short MX banimal.co.za
dig +short TXT banimal.co.za        # SPF
dig +short zoho._domainkey.banimal.co.za TXT   # DKIM

# Real outbound order email
curl -s -X POST https://www.banimal.co.za/api/email/mud/order-confirmation \
  -H 'Content-Type: application/json' \
  -d '{"to":"you@example.com","orderRef":"TEST-001"}'
```

### Checklist
- [ ] Domain verified in Zoho Admin
- [ ] MX + SPF + DKIM live in Cloudflare and verified
- [ ] Provider standardised (ZeptoMail/Zoho or SendGrid — not mixed)
- [ ] One real order email delivered to inbox (not spam)

---

## 4. Phase 4 — Product / inventory sync (optional)  · priority 4

Banimal (`products_v24`) stays the **master** for images, descriptions, price, stock. Optionally mirror into Paystack Products for reporting / hosted pages — never let Paystack become the storefront master.

- [ ] One-way push Banimal → Paystack Products (`POST https://api.paystack.co/product`)
- [ ] Sync is idempotent (match on SKU)
- [ ] Paystack treated as read-only mirror

---

## 5. End-to-end acceptance test

- [ ] Add to cart → Bob Go rates show before payment
- [ ] Pay (Paystack test card `4084 0840 8408 4081`) → webhook returns 200, order → `paid`
- [ ] Order auto-books in Bob Go → `waybill` stored, order → `booked`
- [ ] Confirmation email received
- [ ] Tracking endpoint returns status for the waybill
- [ ] Admin can see status + any per-step failure on one order record

---

## Sources
- Paystack webhooks & verification — [dev.to/ifedayo](https://dev.to/ifedayo/handling-paystack-transactions-using-webhooks-4k61), [Paystack settings (FluentCart)](https://docs.fluentcart.com/guide/payments-checkout/connecting-payment-gateways/paystack-settings)
- Bob Go v2 (rates/booking/tracking, Bearer auth) — [api-docs.bob.co.za/bobgo](https://api-docs.bob.co.za/bobgo); Bearer-token confirmation — [Odoo Bobgo connector](https://apps.odoo.com/apps/modules/19.0/delivery_bobgo)
- Zoho on Cloudflare (MX/SPF/DKIM) — [zoho.com/mail/help](https://www.zoho.com/mail/help/adminconsole/cloudflare.html), [email delivery](https://www.zoho.com/mail/help/adminconsole/configure-email-delivery.html)
- Paystack Products API — [apis.io/providers/paystack](https://apis.io/providers/paystack/)
