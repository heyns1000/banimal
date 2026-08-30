import { Hono } from 'hono'
import { cors } from 'hono/cors'
import licenses from './routes/licenses'
import configuration from './routes/configuration'
import auth from './routes/auth'
import delivery from './routes/delivery'
import notifications from './routes/notifications'
import analytics from './routes/analytics'
import coupons from './routes/coupons'
import email from './routes/email'
import giving from './routes/giving'
import orders from './routes/orders'
import wpBridge from './routes/wp-bridge'
import brandGuide from './routes/brand-guide'

const app = new Hono<{ Bindings: Env }>()

app.use(
  '/*',
  cors({
    origin: [
      'https://banimal.co.za',
      'https://banimal.faa.zone',
      'https://www.banimal.co.za',
    ],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
)

// Core routes
app.route('/api/licenses', licenses)
app.route('/api/configuration', configuration)

// Enhanced storefront routes
app.route('/api/auth', auth)
app.route('/api/delivery', delivery)
// The deployed frontend bundle calls /api/shipping/rates (not /api/delivery/rates),
// so BobGo rates were 404ing at checkout. Mount the same handler at both paths
// rather than touching the built bundle.
app.route('/api/shipping', delivery)
app.route('/api/notifications', notifications)
app.route('/api/analytics', analytics)
app.route('/api/coupons', coupons)
app.route('/api/email', email)
app.route('/api/giving', giving)
app.route('/api/orders', orders)

// WordPress plugin bridge — signed events from the thin-client connector.
// The plugin never calls Paystack/BobGo/GitHub directly; this is the only
// path it has into the Worker. See wordpress-plugin/banimal-ecosystem-connector/.
app.route('/api/wp', wpBridge)

// Sam Fox™ CI Guide, machine-readable — the single source every brand-facing
// consumer (the WordPress connector's brand module, the banimal-connector
// Claude Code skill, any future adapter) pulls from instead of holding its
// own copy. Public, unauthenticated, read-only. See docs/brand/ci-guide.html
// for the human-readable master this mirrors.
app.route('/api/brand-guide', brandGuide)

// Health check
app.get('/api/health', (c) =>
  c.json({ status: 'ok', version: '5.1.0', timestamp: new Date().toISOString() })
)

// Existing brand/ecosystem routes
app.get('/api/systems', async (c) => {
  const db = c.env.DB
  const systems = await db
    .prepare('SELECT * FROM brand_systems WHERE is_active = 1 ORDER BY system_name')
    .all()
  return c.json({ systems: systems.results })
})

app.get('/api/tiers', async (c) => {
  const db = c.env.DB
  const tiers = await db
    .prepare('SELECT * FROM brand_tiers WHERE is_active = 1 ORDER BY priority')
    .all()
  return c.json({ tiers: tiers.results })
})

app.get('/api/brands', async (c) => {
  const db = c.env.DB
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '20')
  const system = c.req.query('system') || ''
  const tier = c.req.query('tier') || ''
  const search = c.req.query('search') || ''
  const offset = (page - 1) * limit

  const conditions: string[] = ['is_active = 1']
  const params: unknown[] = []

  if (system && system !== 'all') { conditions.push('system = ?'); params.push(system) }
  if (tier && tier !== 'all') { conditions.push('tier = ?'); params.push(tier) }
  if (search) {
    conditions.push('(name LIKE ? OR category LIKE ? OR description LIKE ?)')
    const p = `%${search}%`
    params.push(p, p, p)
  }

  const where = conditions.join(' AND ')
  const countResult = await db.prepare(`SELECT COUNT(*) as total FROM brands WHERE ${where}`).bind(...params).first() as any
  const total = countResult?.total || 0

  const brands = await db
    .prepare(`SELECT * FROM brands WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
    .bind(...params, limit, offset)
    .all()

  return c.json({ brands: brands.results, pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: offset + limit < total } })
})

app.get('/api/brands/:id', async (c) => {
  const brand = await c.env.DB.prepare('SELECT * FROM brands WHERE id = ? AND is_active = 1').bind(c.req.param('id')).first()
  if (!brand) return c.json({ error: 'Brand not found' }, 404)
  return c.json({ brand })
})

app.post('/api/webhook/brands', async (c) => {
  const db = c.env.DB
  try {
    const body = await c.req.json()
    const brands = Array.isArray(body) ? body : [body]
    const inserted: unknown[] = [], errors: unknown[] = []

    for (const b of brands) {
      try {
        if (!b.name || !b.system || !b.tier) { errors.push({ brand: b.name, error: 'Missing required fields' }); continue }
        const existing = await db.prepare('SELECT id FROM brands WHERE name = ? AND system = ?').bind(b.name, b.system).first() as any
        if (existing) {
          await db.prepare('UPDATE brands SET tier=?,category=?,description=?,emoji=?,fee=?,royalty=?,division=?,vault_mesh_id=?,parent_id=?,use_phrase=?,subnodes=?,metadata=?,updated_at=CURRENT_TIMESTAMP WHERE id=?')
            .bind(b.tier, b.category||'', b.description||'', b.emoji||'', b.fee||null, b.royalty||null, b.division||null, b.vault_mesh_id||null, b.parent_id||null, b.use_phrase||null, b.subnodes?JSON.stringify(b.subnodes):null, b.metadata?JSON.stringify(b.metadata):null, existing.id).run()
          inserted.push({ id: existing.id, name: b.name, action: 'updated' })
        } else {
          const r = await db.prepare('INSERT INTO brands (name,system,tier,category,description,emoji,fee,royalty,division,vault_mesh_id,parent_id,use_phrase,subnodes,metadata) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
            .bind(b.name, b.system, b.tier, b.category||'', b.description||'', b.emoji||'', b.fee||null, b.royalty||null, b.division||null, b.vault_mesh_id||null, b.parent_id||null, b.use_phrase||null, b.subnodes?JSON.stringify(b.subnodes):null, b.metadata?JSON.stringify(b.metadata):null).run()
          inserted.push({ id: r.meta.last_row_id, name: b.name, action: 'created' })
        }
      } catch (e) { errors.push({ brand: b.name, error: String(e) }) }
    }
    return c.json({ success: true, inserted: inserted.length, errors: errors.length, details: { inserted, errors } })
  } catch (e) {
    return c.json({ success: false, error: String(e) }, 400)
  }
})

app.get('/api/stats', async (c) => {
  const db = c.env.DB
  const [total, systems, tiers] = await Promise.all([
    db.prepare('SELECT COUNT(*) as count FROM brands WHERE is_active=1').first(),
    db.prepare('SELECT system, COUNT(*) as count FROM brands WHERE is_active=1 GROUP BY system').all(),
    db.prepare('SELECT tier, COUNT(*) as count FROM brands WHERE is_active=1 GROUP BY tier').all(),
  ])
  return c.json({ total: (total as any)?.count || 0, by_system: systems.results, by_tier: tiers.results })
})

export default app
