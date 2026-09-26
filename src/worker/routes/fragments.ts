import { Hono } from 'hono'

const fragments = new Hono<{ Bindings: Env }>()

interface FragmentRow {
  name: string
  version: number
  status: 'draft' | 'staged' | 'live'
  html: string
  created_at: string
}

// Constant-time compare — same approach as wp-bridge.ts's signature check,
// so a wrong admin secret can't be brute-forced via response timing.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

// Fails closed: if no secret is configured, every write is rejected rather
// than silently accepted. Never used for the public GET below.
function isAuthorizedAdmin(c: { req: { header: (name: string) => string | undefined }; env: unknown }): boolean {
  const env = c.env as { FRAGMENTS_ADMIN_SECRET?: string }
  const configured = env.FRAGMENTS_ADMIN_SECRET || ''
  const provided = c.req.header('x-admin-secret') || ''
  if (!configured || !provided) return false
  return timingSafeEqual(configured, provided)
}

// GET /api/fragments/:name — public, unauthenticated, read-only. Returns the
// current `live` version by default, or an exact version via ?v=. This is
// the endpoint every consumer (the WordPress module, the universal script
// for non-WordPress repos) calls — see docs/manual/user-manual.html#fragments.
fragments.get('/:name', async (c) => {
  const name = c.req.param('name')
  const pinned = c.req.query('v')

  const row = pinned
    ? await c.env.DB.prepare('SELECT * FROM fragments WHERE name = ? AND version = ?')
        .bind(name, Number(pinned))
        .first<FragmentRow>()
    : await c.env.DB.prepare("SELECT * FROM fragments WHERE name = ? AND status = 'live'")
        .bind(name)
        .first<FragmentRow>()

  if (!row) {
    return c.json({ error: `No ${pinned ? `version ${pinned}` : 'live version'} found for fragment "${name}"` }, 404)
  }

  return c.json(
    { name: row.name, version: row.version, status: row.status, html: row.html },
    200,
    { 'Cache-Control': 'public, max-age=300' }
  )
})

// POST /api/fragments/:name/versions — admin-only. Creates a new draft
// version with the given HTML; never touches what's currently live.
fragments.post('/:name/versions', async (c) => {
  if (!isAuthorizedAdmin(c)) {
    return c.json({ error: 'Forbidden' }, 403)
  }

  const name = c.req.param('name')
  const body = await c.req.json<{ html?: string }>().catch(() => null)
  if (!body || typeof body.html !== 'string' || body.html.trim() === '') {
    return c.json({ error: '"html" is required' }, 400)
  }

  const latest = await c.env.DB.prepare('SELECT MAX(version) AS max_version FROM fragments WHERE name = ?')
    .bind(name)
    .first<{ max_version: number | null }>()
  const nextVersion = (latest?.max_version || 0) + 1

  await c.env.DB.prepare("INSERT INTO fragments (name, version, status, html) VALUES (?, ?, 'draft', ?)")
    .bind(name, nextVersion, body.html)
    .run()

  return c.json({ name, version: nextVersion, status: 'draft' }, 201)
})

// POST /api/fragments/:name/promote — admin-only. Moves one version to
// 'staged' or 'live'. Promoting to 'live' demotes whatever was live before
// it in the same batch, since the DB's partial unique index only allows one
// live row per name — this is what makes rollback just "promote an older
// version" rather than a special operation.
fragments.post('/:name/promote', async (c) => {
  if (!isAuthorizedAdmin(c)) {
    return c.json({ error: 'Forbidden' }, 403)
  }

  const name = c.req.param('name')
  const body = await c.req.json<{ version?: number; status?: string }>().catch(() => null)
  const version = body?.version
  const status = body?.status

  if (typeof version !== 'number' || (status !== 'staged' && status !== 'live')) {
    return c.json({ error: '"version" (number) and "status" ("staged" or "live") are required' }, 400)
  }

  const target = await c.env.DB.prepare('SELECT version FROM fragments WHERE name = ? AND version = ?')
    .bind(name, version)
    .first<{ version: number }>()
  if (!target) {
    return c.json({ error: `Fragment "${name}" has no version ${version}` }, 404)
  }

  const statements = []
  if (status === 'live') {
    statements.push(
      c.env.DB.prepare("UPDATE fragments SET status = 'staged' WHERE name = ? AND status = 'live'").bind(name)
    )
  }
  statements.push(
    c.env.DB.prepare('UPDATE fragments SET status = ? WHERE name = ? AND version = ?').bind(status, name, version)
  )
  await c.env.DB.batch(statements)

  return c.json({ name, version, status })
})

export default fragments
