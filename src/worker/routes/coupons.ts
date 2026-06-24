import { Hono } from 'hono'

const coupons = new Hono<{ Bindings: Env }>()

const CODES: Record<string, { discount: number; type: 'percent' | 'fixed'; minOrder: number; uses: number; maxUses: number }> = {
  STAY10: { discount: 10, type: 'percent', minOrder: 200, uses: 0, maxUses: 9999 },
  WELCOME15: { discount: 15, type: 'percent', minOrder: 300, uses: 0, maxUses: 500 },
  FIRSTBAB: { discount: 50, type: 'fixed', minOrder: 289, uses: 0, maxUses: 1000 },
}

// Generate a hover-triggered coupon offer (records the hover event)
coupons.post('/hover', async (c) => {
  const body = await c.req.json() as {
    sessionId: string
    page: string
    dwellMs: number
  }

  const db = c.env.DB

  // Record the hover event
  await db
    .prepare(`INSERT INTO coupon_events (session_id, page, dwell_ms, code_offered) VALUES (?,?,?,?)`)
    .bind(body.sessionId, body.page, body.dwellMs, 'STAY10')
    .run()

  // Return the offer
  return c.json({
    code: 'STAY10',
    discount: 10,
    type: 'percent',
    message: '10% off your first order',
    expiresIn: 1800, // 30 minutes
  })
})

// Validate a coupon at checkout
coupons.post('/validate', async (c) => {
  const body = await c.req.json() as { code: string; orderTotal: number; email: string }
  const code = body.code.toUpperCase().trim()
  const def = CODES[code]

  if (!def) return c.json({ valid: false, error: 'Invalid coupon code' }, 400)
  if (def.uses >= def.maxUses) return c.json({ valid: false, error: 'Coupon has expired' }, 400)
  if (body.orderTotal < def.minOrder) {
    return c.json({ valid: false, error: `Minimum order R${def.minOrder} required` }, 400)
  }

  const saving = def.type === 'percent'
    ? Math.round(body.orderTotal * (def.discount / 100))
    : def.discount

  def.uses += 1

  return c.json({
    valid: true,
    code,
    discount: def.discount,
    type: def.type,
    saving,
    newTotal: body.orderTotal - saving,
  })
})

export default coupons
