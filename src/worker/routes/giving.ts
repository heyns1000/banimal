import { Hono } from 'hono'

const giving = new Hono<{ Bindings: Env }>()

// The single source of truth for the giving rate — every route that touches
// giving math (this file, orders.ts) imports calculateGiving() rather than
// re-deriving the rate, so the two can't drift out of agreement again.
export const GIVING_RATE = 0.1501
export const VAT_RATE = 0.15

export const TIERS = [
  { minGiving: 0, item: 'bandana bib', description: 'A soft cotton bib for a baby in need', sku: 'GIVE-BIB' },
  { minGiving: 30, item: 'babygrow (0–3m)', description: 'A 100% cotton babygrow donated to a child', sku: 'GIVE-BG-03' },
  { minGiving: 60, item: 'babygrow set', description: 'A full set of babygrows (0–3, 3–6, 6–9 months)', sku: 'GIVE-BG-SET' },
  { minGiving: 120, item: 'complete layette', description: 'Babygrows, bibs and clothing essentials', sku: 'GIVE-LAYETTE' },
]

export function calculateGiving(orderTotalZAR: number, includesVAT = true) {
  const preTax = includesVAT ? orderTotalZAR / (1 + VAT_RATE) : orderTotalZAR
  const givingAmount = Math.round(preTax * GIVING_RATE * 100) / 100
  const tier = [...TIERS].reverse().find((t) => givingAmount >= t.minGiving) || TIERS[0]

  return {
    orderTotal: orderTotalZAR,
    preTaxAmount: Math.round(preTax * 100) / 100,
    givingRate: GIVING_RATE,
    givingAmount,
    tier,
  }
}

// Calculate what a given order funds
giving.post('/calculate', (c) => {
  return c.req.json().then((body: { orderTotalZAR: number; includesVAT?: boolean }) => {
    const result = calculateGiving(body.orderTotalZAR, body.includesVAT !== false)

    return c.json({
      orderTotal: result.orderTotal,
      preTaxAmount: result.preTaxAmount,
      givingRate: result.givingRate,
      givingAmount: result.givingAmount,
      tier: {
        item: result.tier.item,
        description: result.tier.description,
        sku: result.tier.sku,
      },
    })
  })
})

// Record a donation allocation for an order
giving.post('/record', async (c) => {
  const body = await c.req.json() as {
    orderId: string
    orderTotalZAR: number
    email: string
    tierSku: string
    givingAmount: number
  }

  const db = c.env.DB
  await db
    .prepare(
      `INSERT INTO giving_allocations (order_id, order_total, giving_amount, tier_sku, email)
       VALUES (?,?,?,?,?)`
    )
    .bind(body.orderId, body.orderTotalZAR, body.givingAmount, body.tierSku, body.email)
    .run()

  return c.json({ ok: true })
})

// Get total giving impact
giving.get('/impact', async (c) => {
  const db = c.env.DB
  const row = await db
    .prepare(`SELECT SUM(giving_amount) as total, COUNT(*) as orders FROM giving_allocations`)
    .first() as any
  return c.json({
    totalGivingZAR: row?.total || 0,
    totalOrders: row?.orders || 0,
    estimatedLivesImpacted: Math.floor((row?.total || 0) / 30),
  })
})

export default giving
