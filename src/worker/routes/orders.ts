import { Hono } from 'hono'
import { nanoid } from 'nanoid'
import { calculateGiving } from './giving'

const orders = new Hono<{ Bindings: Env }>()

// POST /api/orders
// Called by the storefront checkout with customer details + cart.
// Creates a Paystack transaction and returns the authorization_url.
orders.post('/', async (c) => {
  try {
    const body = await c.req.json() as {
      customerName: string
      email: string
      currency: string
      totalUsd: number
      totalZar: number
      itemsJson: string
      status: string
    }

    const env = c.env as any
    const paystackKey: string = env.PAYSTACK_SECRET_KEY || env.PAYSTACK_LIVE_SECRET_KEY || ''

    // Generate a unique order reference
    const reference = `BAN-${nanoid(12).toUpperCase()}`

    // Amount for Paystack is in kobo (ZAR cents)
    const amountKobo = Math.round(body.totalZar * 100)

    // Initialize Paystack transaction
    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        amount: amountKobo,
        currency: 'ZAR',
        reference,
        metadata: {
          customer_name: body.customerName,
          items: body.itemsJson,
          custom_fields: [
            { display_name: 'Customer', variable_name: 'customer_name', value: body.customerName },
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

    // Optionally persist order to D1 if DB is available
    try {
      const db = (c.env as any).DB
      if (db) {
        // Paystack's amount is the VAT-inclusive total; calculateGiving()
        // strips VAT before applying the 15.01% rate, same as /api/giving/calculate.
        const { givingAmount, tier } = calculateGiving(body.totalZar)
        await db.prepare(`
          INSERT OR IGNORE INTO giving_allocations (order_id, order_total, giving_amount, tier_sku, email)
          VALUES (?, ?, ?, ?, ?)
        `).bind(
          reference,
          body.totalZar,
          givingAmount,
          tier.sku,
          body.email
        ).run()
      }
    } catch (_dbErr) {
      // Non-fatal — order still proceeds
      console.warn('DB persist skipped:', _dbErr)
    }

    return c.json({
      reference,
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
