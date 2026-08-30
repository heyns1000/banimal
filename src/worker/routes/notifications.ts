import { Hono } from 'hono'
import { verifySession } from './auth'

const notifications = new Hono<{ Bindings: Env }>()

// Return VAPID public key for client-side push subscription
notifications.get('/vapid-public-key', (c) => {
  const key = (c.env as any).VAPID_PUBLIC_KEY as string
  if (!key) return c.json({ error: 'Push notifications not configured' }, 503)
  return c.json({ publicKey: key })
})

// Store a push subscription
notifications.post('/subscribe', async (c) => {
  const sub = await c.req.json() as {
    endpoint: string
    keys: { p256dh: string; auth: string }
    expirationTime?: number | null
  }

  if (!sub.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) {
    return c.json({ error: 'Invalid subscription object' }, 400)
  }

  const db = c.env.DB
  const authHeader = c.req.header('Authorization')
  let userId: number | null = null
  if (authHeader) {
    const payload = await verifySession(c.env as any, authHeader.replace('Bearer ', ''))
    if (payload) userId = payload.userId
  }

  await db
    .prepare(
      `INSERT INTO push_subscriptions (endpoint, p256dh, auth, user_id)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(endpoint) DO UPDATE SET p256dh=excluded.p256dh, auth=excluded.auth, updated_at=CURRENT_TIMESTAMP`
    )
    .bind(sub.endpoint, sub.keys.p256dh, sub.keys.auth, userId)
    .run()

  return c.json({ ok: true })
})

// Send a push notification (admin-triggered)
notifications.post('/send', async (c) => {
  const body = await c.req.json() as {
    endpoint?: string
    userId?: number
    title: string
    message: string
    url?: string
    image?: string
    segment?: 'all' | 'subscribers'
  }

  const vapidPrivate = (c.env as any).VAPID_PRIVATE_KEY as string
  const vapidPublic = (c.env as any).VAPID_PUBLIC_KEY as string
  const vapidSubject = (c.env as any).VAPID_SUBJECT as string || 'mailto:hello@banimal.co.za'

  if (!vapidPrivate || !vapidPublic) return c.json({ error: 'VAPID not configured' }, 503)

  const db = c.env.DB
  let subs: Array<{ endpoint: string; p256dh: string; auth: string }>

  if (body.endpoint) {
    subs = [await db.prepare('SELECT endpoint,p256dh,auth FROM push_subscriptions WHERE endpoint=?').bind(body.endpoint).first() as any].filter(Boolean)
  } else if (body.userId) {
    subs = (await db.prepare('SELECT endpoint,p256dh,auth FROM push_subscriptions WHERE user_id=?').bind(body.userId).all()).results as any
  } else {
    subs = (await db.prepare('SELECT endpoint,p256dh,auth FROM push_subscriptions LIMIT 500').all()).results as any
  }

  const payload = JSON.stringify({
    title: body.title,
    body: body.message,
    url: body.url || '/',
    image: body.image || '',
  })

  let sent = 0, failed = 0
  for (const sub of subs) {
    try {
      // In production: use a proper VAPID library (web-push compatible)
      // Cloudflare Workers support SubtleCrypto for ECDH signing
      const resp = await fetch(sub.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'TTL': '86400',
        },
        body: payload,
      })
      if (resp.ok) sent++; else failed++
    } catch {
      failed++
    }
  }

  return c.json({ sent, failed, total: subs.length })
})

export default notifications
