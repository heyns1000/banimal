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

// POST /api/wp/events
// Receives signed events from the Banimal WordPress plugin. The plugin is a
// thin client only — it never talks to Paystack/BobGo/GitHub directly, it
// relays here. This endpoint verifies the HMAC-SHA256 signature, validates
// the event envelope, and stores it idempotently (by event_id) for the
// order/payment/delivery logic to consume. It does not yet drive order
// state transitions — that wiring is a separate, deliberate follow-up once
// a WooCommerce store's existence is confirmed (see system design §8.1).
wpBridge.post('/events', async (c) => {
  const env = c.env as any
  const secret: string = env.WP_BRIDGE_SECRET || ''
  const raw = await c.req.text()
  const signature = c.req.header('x-banimal-signature') || ''

  if (!secret) {
    return c.json({ ok: false, error: 'Bridge not configured' }, 503)
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

  return c.json({ ok: true, event_id: parsed.event_id }, 200)
})

export default wpBridge
