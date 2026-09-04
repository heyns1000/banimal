import { Hono } from 'hono'
import { z } from 'zod'

const wpBridge = new Hono<{ Bindings: Env }>()

const eventSchema = z.object({
  event_id: z.string().min(1),
  event_type: z.string().min(1),
  schema_version: z.string().default('1.0'),
  occurred_at: z.string(),
  source: z.literal('wordpress-plugin'),
  payload: z.record(z.any()),
})

// Shape sent by Banimal_WooCommerce_Bridge::on_order_status_changed() in the
// WordPress plugin (wordpress-plugin/banimal-ecosystem-connector/includes/
// class-woocommerce-bridge.php).
const wooCommerceOrderPayloadSchema = z.object({
  wc_order_id: z.union([z.string(), z.number()]),
  status_from: z.string().optional(),
  status_to: z.string(),
  total: z.union([z.string(), z.number()]),
  currency: z.string().default('ZAR'),
  customer_email: z.union([z.string().email(), z.literal('')]).optional(),
})

// A WooCommerce order that has reached one of these is done changing via
// this sync path — an out-of-order or retried event must never move it
// backward.
const TERMINAL_STATUSES = new Set(['cancelled', 'refunded'])

function mapWooCommerceStatus(wcStatus: string): { payment_status: string; status: string } {
  switch (wcStatus) {
    case 'processing':
      return { payment_status: 'paid', status: 'paid' }
    case 'completed':
      return { payment_status: 'paid', status: 'fulfilled' }
    case 'cancelled':
    case 'failed':
      return { payment_status: 'failed', status: 'cancelled' }
    case 'refunded':
      return { payment_status: 'refunded', status: 'refunded' }
    case 'on-hold':
    case 'pending':
    default:
      return { payment_status: 'pending', status: 'pending' }
  }
}

// Constant-time hex comparison — avoids leaking signature match progress
// through response timing.
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

async function verifySignature(secret: string, raw: string, signature: string): Promise<boolean> {
  if (!secret || !signature) return false
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(raw))
  const expected = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('')
  return timingSafeEqualHex(expected, signature)
}

/**
 * Applies a validated woocommerce.order_status_changed event to the orders
 * table. Runs after signature verification and envelope validation — this
 * function trusts its input. Non-fatal on payload-shape mismatch: logs and
 * returns rather than failing the whole request, since the raw event is
 * already durably stored regardless.
 */
async function applyWooCommerceOrderEvent(db: D1Database, rawPayload: unknown) {
  const parsedPayload = wooCommerceOrderPayloadSchema.safeParse(rawPayload)
  if (!parsedPayload.success) {
    console.warn('wp-bridge: woocommerce.order_status_changed payload failed validation', parsedPayload.error.flatten())
    return
  }

  const wc = parsedPayload.data
  const orderId = `WC-${wc.wc_order_id}`
  const { payment_status, status } = mapWooCommerceStatus(wc.status_to)
  const totalZar = Math.round(parseFloat(String(wc.total)) * 100)
  const totalCents = Number.isFinite(totalZar) ? totalZar : 0

  const existing = await db
    .prepare('SELECT status FROM orders WHERE order_id = ?')
    .bind(orderId)
    .first<{ status: string }>()

  if (existing && TERMINAL_STATUSES.has(existing.status) && existing.status !== status) {
    console.warn(
      `wp-bridge: refusing to move order ${orderId} out of terminal status '${existing.status}' toward '${status}' (wc_status_raw='${wc.status_to}')`
    )
    return
  }

  await db
    .prepare(
      `INSERT INTO orders (order_id, source, external_id, customer_email, total_zar, currency, payment_status, status, wc_status_raw, updated_at)
       VALUES (?, 'woocommerce', ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(order_id) DO UPDATE SET
         customer_email = excluded.customer_email,
         total_zar = excluded.total_zar,
         currency = excluded.currency,
         payment_status = excluded.payment_status,
         status = excluded.status,
         wc_status_raw = excluded.wc_status_raw,
         updated_at = CURRENT_TIMESTAMP`
    )
    .bind(
      orderId,
      String(wc.wc_order_id),
      wc.customer_email || null,
      totalCents,
      wc.currency,
      payment_status,
      status,
      wc.status_to
    )
    .run()
}

// POST /api/wp/events
// Receives signed events from the Banimal WordPress plugin. The plugin is a
// thin client only — it never talks to Paystack/BobGo/GitHub directly, it
// relays here. This endpoint verifies the HMAC-SHA256 signature, validates
// the event envelope, stores it durably and idempotently (by event_id) for
// audit, and — for recognized event types — applies the corresponding
// order state transition.
wpBridge.post('/events', async (c) => {
  const env = c.env as any
  const secret: string = env.WP_BRIDGE_SECRET || ''
  const raw = await c.req.text()
  const signature = c.req.header('x-banimal-signature') || ''

  if (!secret) {
    return c.json({ ok: false, error: 'Bridge not configured' }, 503)
  }

  // Reject empty bodies before HMAC verification — a zero-byte POST would
  // cause verifySignature to compute HMAC('') which an attacker could pre-
  // compute and supply as a valid-looking signature.
  if (!raw) {
    return c.json({ ok: false, error: 'Empty body' }, 400)
  }

  const valid = await verifySignature(secret, raw, signature)
  if (!valid) {
    return c.json({ ok: false, error: 'Invalid signature' }, 401)
  }

  let parsed
  try {
    parsed = eventSchema.parse(JSON.parse(raw))
  } catch (e) {
    return c.json({ ok: false, error: 'Invalid event envelope' }, 422)
  }

  const db = c.env.DB
  try {
    await db
      .prepare(
        `INSERT OR IGNORE INTO wp_bridge_events (event_id, event_type, schema_version, occurred_at, payload_json)
         VALUES (?, ?, ?, ?, ?)`
      )
      .bind(
        parsed.event_id,
        parsed.event_type,
        parsed.schema_version,
        parsed.occurred_at,
        JSON.stringify(parsed.payload)
      )
      .run()
  } catch (e) {
    console.error('wp-bridge insert failed:', e)
    return c.json({ ok: false, error: 'Storage error' }, 500)
  }

  if (parsed.event_type === 'woocommerce.order_status_changed') {
    try {
      await applyWooCommerceOrderEvent(db, parsed.payload)
    } catch (e) {
      // The raw event is already durably logged above; a failure here means
      // the order-state projection is stale, not that the event was lost.
      console.error('wp-bridge: failed to apply order state transition:', e)
    }
  }

  return c.json({ ok: true, event_id: parsed.event_id }, 200)
})

export default wpBridge
