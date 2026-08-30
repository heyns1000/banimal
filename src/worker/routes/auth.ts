import { Hono } from 'hono'

const auth = new Hono<{ Bindings: Env }>()

const PROVIDERS: Record<string, { authUrl: string; tokenUrl: string; scope: string }> = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scope: 'openid email profile',
  },
  facebook: {
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scope: 'email,public_profile',
  },
  github: {
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    scope: 'user:email',
  },
  microsoft: {
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    scope: 'openid email profile',
  },
  apple: {
    authUrl: 'https://appleid.apple.com/auth/authorize',
    tokenUrl: 'https://appleid.apple.com/auth/token',
    scope: 'email name',
  },
  tiktok: {
    authUrl: 'https://www.tiktok.com/v2/auth/authorize',
    tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
    scope: 'user.info.basic,user.info.email',
  },
  substack: {
    authUrl: 'https://substack.com/sign-in',
    tokenUrl: 'https://substack.com/api/v1/auth/token',
    scope: 'email',
  },
  instagram: {
    authUrl: 'https://api.instagram.com/oauth/authorize',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    scope: 'user_profile,user_media',
  },
}

// Redirect to OAuth provider
auth.get('/:provider/redirect', (c) => {
  const provider = c.req.param('provider')
  const cfg = PROVIDERS[provider]
  if (!cfg) return c.json({ error: 'Unknown provider' }, 400)

  const clientId = (c.env as any)[`OAUTH_${provider.toUpperCase()}_CLIENT_ID`] as string
  if (!clientId) return c.json({ error: `${provider} OAuth not configured` }, 503)

  const redirectUri = `${new URL(c.req.url).origin}/api/auth/${provider}/callback`
  const state = crypto.randomUUID()

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: cfg.scope,
    state,
  })
  if (provider === 'apple') params.set('response_mode', 'form_post')

  return c.redirect(`${cfg.authUrl}?${params}`)
})

// OAuth callback — exchange code for token, upsert user, return session
auth.get('/:provider/callback', async (c) => {
  const provider = c.req.param('provider')
  const cfg = PROVIDERS[provider]
  if (!cfg) return c.json({ error: 'Unknown provider' }, 400)

  const code = c.req.query('code')
  if (!code) return c.json({ error: 'Missing code' }, 400)

  const clientId = (c.env as any)[`OAUTH_${provider.toUpperCase()}_CLIENT_ID`] as string
  const clientSecret = (c.env as any)[`OAUTH_${provider.toUpperCase()}_CLIENT_SECRET`] as string
  const redirectUri = `${new URL(c.req.url).origin}/api/auth/${provider}/callback`

  // Exchange code for token
  const tokenResp = await fetch(cfg.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: 'authorization_code' }),
  })
  const tokenData = await tokenResp.json() as Record<string, string>
  if (!tokenData.access_token) return c.json({ error: 'Token exchange failed', detail: tokenData }, 400)

  // Fetch user profile
  let email = '', name = '', avatar = ''
  if (provider === 'google') {
    const u = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', { headers: { Authorization: `Bearer ${tokenData.access_token}` } }).then((r) => r.json()) as any
    email = u.email; name = u.name; avatar = u.picture
  } else if (provider === 'github') {
    const u = await fetch('https://api.github.com/user', { headers: { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'Banimal/1.0' } }).then((r) => r.json()) as any
    email = u.email || `${u.login}@github`; name = u.name || u.login; avatar = u.avatar_url
  } else if (provider === 'facebook') {
    const u = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokenData.access_token}`).then((r) => r.json()) as any
    email = u.email; name = u.name; avatar = u.picture?.data?.url
  } else {
    email = `${provider}-user@banimal.co.za`; name = `${provider} user`
  }

  // Upsert user in DB
  const db = c.env.DB
  const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first() as any
  let userId: number
  if (existing) {
    await db.prepare('UPDATE users SET name=?, avatar=?, provider=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(name, avatar, provider, existing.id).run()
    userId = existing.id
  } else {
    const r = await db.prepare('INSERT INTO users (email, name, avatar, provider) VALUES (?,?,?,?)').bind(email, name, avatar, provider).run()
    userId = r.meta.last_row_id as number
  }

  // Issue an HMAC-SHA256 signed session token — same signing pattern as
  // wp-bridge.ts's event verification, so a client can't forge a session by
  // just base64-encoding their own payload.
  const token = await signSession(c.env as any, { userId, email, provider, exp: Date.now() + 86400000 * 7 })

  // Redirect back to frontend with token
  return c.redirect(`/?auth_token=${token}`)
})

// Verify token
auth.get('/me', async (c) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  if (!token) return c.json({ error: 'Unauthorized' }, 401)
  const payload = await verifySession(c.env as any, token)
  if (!payload) return c.json({ error: 'Invalid token' }, 401)
  if (payload.exp < Date.now()) return c.json({ error: 'Token expired' }, 401)
  return c.json({ user: payload })
})

export type SessionPayload = { userId: number; email: string; provider: string; exp: number }

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  return [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function signSession(env: { AUTH_SESSION_SECRET?: string }, payload: SessionPayload): Promise<string> {
  const secret = env.AUTH_SESSION_SECRET || ''
  if (!secret) throw new Error('AUTH_SESSION_SECRET not configured')
  const payloadB64 = btoa(JSON.stringify(payload))
  const signature = await hmacHex(secret, payloadB64)
  return `${payloadB64}.${signature}`
}

export async function verifySession(env: { AUTH_SESSION_SECRET?: string }, token: string): Promise<SessionPayload | null> {
  const secret = env.AUTH_SESSION_SECRET || ''
  if (!secret) return null
  const [payloadB64, signature] = token.split('.')
  if (!payloadB64 || !signature) return null
  const expected = await hmacHex(secret, payloadB64)
  if (!timingSafeEqualHex(expected, signature)) return null
  try {
    return JSON.parse(atob(payloadB64)) as SessionPayload
  } catch {
    return null
  }
}

export default auth
