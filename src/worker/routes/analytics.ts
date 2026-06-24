import { Hono } from 'hono'

const analytics = new Hono<{ Bindings: Env }>()

// Track product view / page view / scroll depth
analytics.post('/track', async (c) => {
  const body = await c.req.json() as {
    type: 'page_view' | 'product_view' | 'scroll' | 'hover' | 'add_to_cart' | 'checkout_start'
    productId?: string
    page?: string
    scrollDepth?: number
    hoverMs?: number
    sessionId?: string
  }

  const db = c.env.DB
  const ip = c.req.header('CF-Connecting-IP') || ''
  const ua = c.req.header('User-Agent') || ''
  const country = (c.req as any).cf?.country || ''

  await db
    .prepare(
      `INSERT INTO analytics_events (event_type, product_id, page, scroll_depth, hover_ms, session_id, ip_hash, user_agent_hash, country)
       VALUES (?,?,?,?,?,?,?,?,?)`
    )
    .bind(
      body.type,
      body.productId || null,
      body.page || null,
      body.scrollDepth || null,
      body.hoverMs || null,
      body.sessionId || null,
      await hashShort(ip),
      await hashShort(ua),
      country
    )
    .run()

  return c.json({ ok: true })
})

// Get top-viewed products for personalisation
analytics.get('/hot', async (c) => {
  const db = c.env.DB
  const sessionId = c.req.query('sessionId')

  let rows
  if (sessionId) {
    rows = await db
      .prepare(`SELECT product_id, COUNT(*) as views FROM analytics_events WHERE event_type='product_view' AND session_id=? AND product_id IS NOT NULL GROUP BY product_id ORDER BY views DESC LIMIT 10`)
      .bind(sessionId)
      .all()
  } else {
    rows = await db
      .prepare(`SELECT product_id, COUNT(*) as views FROM analytics_events WHERE event_type='product_view' AND product_id IS NOT NULL AND created_at > datetime('now','-7 days') GROUP BY product_id ORDER BY views DESC LIMIT 10`)
      .all()
  }

  return c.json({ hot: rows.results })
})

// Return products the session has NEVER seen (for discovery)
analytics.post('/unseen', async (c) => {
  const body = await c.req.json() as { sessionId: string; allProductIds: string[] }
  const db = c.env.DB

  const seen = await db
    .prepare(`SELECT DISTINCT product_id FROM analytics_events WHERE session_id=? AND product_id IS NOT NULL`)
    .bind(body.sessionId)
    .all()
  const seenSet = new Set(seen.results.map((r: any) => r.product_id))
  const unseen = body.allProductIds.filter((id) => !seenSet.has(id))

  return c.json({ unseen: unseen.slice(0, 6) })
})

async function hashShort(val: string): Promise<string> {
  const enc = new TextEncoder().encode(val)
  const buf = await crypto.subtle.digest('SHA-256', enc)
  return Array.from(new Uint8Array(buf)).slice(0, 4).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export default analytics
