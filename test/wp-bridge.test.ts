import { env, SELF } from 'cloudflare:test'
import { beforeEach, describe, expect, it } from 'vitest'
import { applyConnectorSchema, signBody } from './setup'

const SECRET = 'test-wp-bridge-secret'

function envelope(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    event_id: crypto.randomUUID(),
    event_type: 'woocommerce.order_status_changed',
    schema_version: '1.0',
    occurred_at: new Date().toISOString(),
    source: 'wordpress-plugin',
    payload: {
      wc_order_id: 4821,
      status_to: 'processing',
      total: '560.00',
      currency: 'ZAR',
      customer_email: 'shopper@example.com',
    },
    ...overrides,
  }
}

async function post(body: string, signature?: string) {
  return SELF.fetch('https://banimal.test/api/wp/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(signature !== undefined ? { 'X-Banimal-Signature': signature } : {}),
    },
    body,
  })
}

describe('POST /api/wp/events', () => {
  beforeEach(async () => {
    await applyConnectorSchema(env.DB)
    ;(env as any).WP_BRIDGE_SECRET = SECRET
  })

  it('rejects when the bridge secret is not configured', async () => {
    ;(env as any).WP_BRIDGE_SECRET = ''
    const body = JSON.stringify(envelope())
    const res = await post(body, await signBody(SECRET, body))
    expect(res.status).toBe(503)
  })

  it('rejects a missing or invalid signature', async () => {
    const body = JSON.stringify(envelope())
    expect((await post(body)).status).toBe(401)
    expect((await post(body, 'not-the-real-signature')).status).toBe(401)
  })

  it('rejects a validly-signed but malformed envelope', async () => {
    const body = JSON.stringify({ not: 'an envelope' })
    const res = await post(body, await signBody(SECRET, body))
    expect(res.status).toBe(422)
  })

  it('accepts a valid signed event and stores it idempotently by event_id', async () => {
    const body = JSON.stringify(envelope())
    const sig = await signBody(SECRET, body)

    const first = await post(body, sig)
    expect(first.status).toBe(200)
    expect(await first.json()).toMatchObject({ ok: true })

    // Replaying the exact same signed body (e.g. a WordPress retry after a
    // timeout) must not error and must not create a second stored event.
    const second = await post(body, sig)
    expect(second.status).toBe(200)

    const { results } = await env.DB.prepare(
      'SELECT COUNT(*) as n FROM wp_bridge_events WHERE event_id = ?'
    )
      .bind(JSON.parse(body).event_id)
      .all<{ n: number }>()
    expect(results[0].n).toBe(1)
  })

  it.each([
    ['processing', 'paid', 'paid'],
    ['completed', 'paid', 'fulfilled'],
    ['cancelled', 'failed', 'cancelled'],
    ['failed', 'failed', 'cancelled'],
    ['refunded', 'refunded', 'refunded'],
    ['on-hold', 'pending', 'pending'],
    ['pending', 'pending', 'pending'],
  ])(
    'maps WooCommerce status "%s" to payment_status=%s, status=%s',
    async (wcStatus, expectedPaymentStatus, expectedStatus) => {
      const orderId = Math.floor(Math.random() * 1_000_000)
      const body = JSON.stringify(
        envelope({ payload: { wc_order_id: orderId, status_to: wcStatus, total: '100.00', currency: 'ZAR' } })
      )
      const res = await post(body, await signBody(SECRET, body))
      expect(res.status).toBe(200)

      const row = await env.DB.prepare('SELECT payment_status, status FROM orders WHERE order_id = ?')
        .bind(`WC-${orderId}`)
        .first<{ payment_status: string; status: string }>()
      expect(row).toMatchObject({ payment_status: expectedPaymentStatus, status: expectedStatus })
    }
  )

  it('never moves an order out of a terminal status', async () => {
    const orderId = 9001

    // First event lands the order in the terminal 'refunded' state.
    const refundBody = JSON.stringify(
      envelope({ payload: { wc_order_id: orderId, status_to: 'refunded', total: '250.00', currency: 'ZAR' } })
    )
    expect((await post(refundBody, await signBody(SECRET, refundBody))).status).toBe(200)

    // A later, presumably out-of-order event tries to move it back to paid.
    const staleBody = JSON.stringify(
      envelope({ payload: { wc_order_id: orderId, status_to: 'processing', total: '250.00', currency: 'ZAR' } })
    )
    expect((await post(staleBody, await signBody(SECRET, staleBody))).status).toBe(200)

    const row = await env.DB.prepare('SELECT status FROM orders WHERE order_id = ?')
      .bind(`WC-${orderId}`)
      .first<{ status: string }>()
    expect(row?.status).toBe('refunded')
  })

  it('still durably logs the raw event even when the order payload fails validation', async () => {
    const body = JSON.stringify(
      envelope({ payload: { wc_order_id: 'not-a-real-payload-shape' /* missing status_to, total */ } })
    )
    const res = await post(body, await signBody(SECRET, body))
    expect(res.status).toBe(200)

    const stored = await env.DB.prepare('SELECT event_id FROM wp_bridge_events WHERE event_id = ?')
      .bind(JSON.parse(body).event_id)
      .first()
    expect(stored).toBeTruthy()
  })
})
