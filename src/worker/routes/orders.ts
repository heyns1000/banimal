import { Hono } from 'hono'
import { nanoid } from 'nanoid'
import { calculateGiving } from './giving'

const orders = new Hono<{ Bindings: Env }>()

// POST /api/orders
// Called by a storefront checkout with the customer and the cart: { customerName, email, items: [{ table, id, qty }] }.
// Prices are NEVER taken from the browser. Each item is looked up in the published shop catalogue
// (Supabase, public read of is_published rows only), the total is computed here, and that total is
// what Paystack charges. Returns the Paystack authorization_url to redirect the customer to.
const CATALOGUE_TABLES = ['samfox_prints', 'grand_paintings', 'bashedi_kidswear'] as const
type CatalogueTable = (typeof CATALOGUE_TABLES)[number]
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

interface CartItem { table: CatalogueTable; id: string; qty: number }
interface PricedLine { table: CatalogueTable; id: string; name: string; qty: number; unitZarCents: number }

interface ShopEnv { SUPABASE_URL?: string; SUPABASE_PUBLISHABLE_KEY?: string }

async function priceCart(env: ShopEnv, items: CartItem[]): Promise<PricedLine[] | string> {
  const url: string = env.SUPABASE_URL || 'https://poyxundlvczciihdrkkk.supabase.co'
  const key: string = env.SUPABASE_PUBLISHABLE_KEY || ''
  if (!key) return 'Shop catalogue is not configured'
  const lines: PricedLine[] = []
  for (const table of CATALOGUE_TABLES) {
    const wanted = items.filter((i) => i.table === table)
    if (!wanted.length) continue
    const ids = wanted.map((i) => i.id).join(',')
    const res = await fetch(`${url}/rest/v1/${table}?select=id,name,price_zar_cents,stock,is_published&is_published=eq.true&id=in.(${ids})`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
    if (!res.ok) return 'Shop catalogue unavailable'
    const rows = (await res.json()) as Array<{ id: string; name: string; price_zar_cents: number | null; stock: number | null }>
    for (const item of wanted) {
      const row = rows.find((r) => r.id === item.id)
      if (!row || !row.price_zar_cents || row.price_zar_cents <= 0) return `Item not available: ${item.id}`
      if (row.stock !== null && row.stock < item.qty) return `Not enough stock for ${row.name}`
      lines.push({ table, id: row.id, name: row.name, qty: item.qty, unitZarCents: row.price_zar_cents })
    }
  }
  return lines
}

orders.post('/', async (c) => {
  try {
    const body = (await c.req.json()) as { customerName?: string; email?: string; items?: CartItem[]; totalZar?: number }
    const env = c.env as any

    if (body.totalZar !== undefined && !body.items) {
      return c.json({ error: 'Prices are set by the server. Send items: [{ table, id, qty }], not a total.' }, 400)
    }
    const email = String(body.email || '').trim()
    const customerName = String(body.customerName || '').trim().slice(0, 120)
    const items = Array.isArray(body.items) ? body.items : []
    if (!EMAIL.test(email) || email.length > 254) return c.json({ error: 'A valid email address is required' }, 400)
    if (!items.length || items.length > 50) return c.json({ error: 'The cart is empty or too large' }, 400)
    for (const i of items) {
      if (!CATALOGUE_TABLES.includes(i?.table) || !UUID.test(String(i?.id)) || !Number.isInteger(i?.qty) || i.qty < 1 || i.qty > 20) {
        return c.json({ error: 'Invalid cart item' }, 400)
      }
    }

    const priced = await priceCart(env, items)
    if (typeof priced === 'string') return c.json({ error: priced }, 400)
    const totalZarCents = priced.reduce((sum, l) => sum + l.unitZarCents * l.qty, 0)
    const totalZar = totalZarCents / 100

    const paystackKey: string = env.PAYSTACK_SECRET_KEY || env.PAYSTACK_LIVE_SECRET_KEY || ''
    if (!paystackKey) return c.json({ error: 'Payments are not configured yet' }, 503)

    // Generate a unique order reference
    const reference = `BAN-${nanoid(12).toUpperCase()}`
    const itemsJson = JSON.stringify(priced.map((l) => ({ table: l.table, id: l.id, name: l.name, qty: l.qty, unit_zar_cents: l.unitZarCents })))

    // Initialize Paystack transaction; Paystack's ZAR amount is in cents
    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: totalZarCents,
        currency: 'ZAR',
        reference,
        metadata: {
          customer_name: customerName,
          items: itemsJson,
          custom_fields: [
            { display_name: 'Customer', variable_name: 'customer_name', value: customerName },
          ],
        },
        callback_url: `${env.SITE_URL || 'https://www.banimal.co.za'}/#/order/confirmation?ref=${reference}`,
      }),
    })

    if (!paystackRes.ok) {
      const err = await paystackRes.text()
      console.error('Paystack init error:', err)
      return c.json({ error: 'Payment gateway error. Please try again.' }, 502)
    }

    const paystackData = await paystackRes.json() as any

    if (!paystackData.status) {
      return c.json({ error: paystackData.message || 'Payment initialization failed' }, 400)
    }

    // Record the pending order in the shop database (insert-only for the public key; no one can read it back)
    try {
      const url: string = env.SUPABASE_URL || 'https://poyxundlvczciihdrkkk.supabase.co'
      const key: string = env.SUPABASE_PUBLISHABLE_KEY || ''
      if (key) {
        await fetch(`${url}/rest/v1/orders`, {
          method: 'POST',
          headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
          body: JSON.stringify({ reference, email, amount: totalZar, currency: 'ZAR', status: 'pending', paystack_reference: reference }),
        })
      }
    } catch (_e) {
      console.warn('Order record skipped:', _e)
    }

    // Optionally persist the giving allocation to D1 if DB is available
    try {
      const db = (c.env as any).DB
      if (db) {
        // Paystack's amount is the VAT-inclusive total; calculateGiving()
        // strips VAT before applying the 15.01% rate, same as /api/giving/calculate.
        const { givingAmount, tier } = calculateGiving(totalZar)
        await db.prepare(`
          INSERT OR IGNORE INTO giving_allocations (order_id, order_total, giving_amount, tier_sku, email)
          VALUES (?, ?, ?, ?, ?)
        `).bind(
          reference,
          totalZar,
          givingAmount,
          tier.sku,
          email
        ).run()
      }
    } catch (_dbErr) {
      // Non-fatal — order still proceeds
      console.warn('DB persist skipped:', _dbErr)
    }

    return c.json({
      reference,
      amount_zar: totalZar,
      authorization_url: paystackData.data?.authorization_url,
      access_code: paystackData.data?.access_code,
    })
  } catch (err) {
    console.error('Orders route error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// GET /api/orders/verify/:reference
// Called on confirmation page to verify a Paystack payment
orders.get('/verify/:reference', async (c) => {
  try {
    const env = c.env as any
    const paystackKey: string = env.PAYSTACK_SECRET_KEY || env.PAYSTACK_LIVE_SECRET_KEY || ''
    const reference = c.req.param('reference')
    if (!/^BAN-[A-Z0-9_-]{6,40}$/.test(reference)) return c.json({ error: 'Invalid reference' }, 400)

    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${paystackKey}` },
    })

    if (!res.ok) return c.json({ error: 'Verification failed' }, 502)

    const data = await res.json() as any
    return c.json({
      verified: data.data?.status === 'success',
      status: data.data?.status,
      reference,
      amount: data.data?.amount,
      currency: data.data?.currency,
      paid_at: data.data?.paid_at,
    })
  } catch (err) {
    return c.json({ error: 'Verification error' }, 500)
  }
})

export default orders
