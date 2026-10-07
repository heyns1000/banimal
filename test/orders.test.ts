import { SELF } from 'cloudflare:test'
import { describe, expect, it } from 'vitest'

const post = (body: unknown) =>
  SELF.fetch('https://banimal.test/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

const item = { table: 'samfox_prints', id: '6f1c2c1e-3b1a-4c55-9a51-2f6d1d2b9a10', qty: 1 }

describe('POST /api/orders: the server sets the price', () => {
  it('refuses a browser-supplied total', async () => {
    const res = await post({ customerName: 'Test', email: 'buyer@example.com', totalZar: 1 })
    expect(res.status).toBe(400)
    expect((await res.json<{ error: string }>()).error).toMatch(/Prices are set by the server/)
  })

  it('requires a valid email', async () => {
    const res = await post({ customerName: 'Test', email: 'not-an-email', items: [item] })
    expect(res.status).toBe(400)
  })

  it.each([
    [{ ...item, table: 'users' }],
    [{ ...item, id: "1' or '1'='1" }],
    [{ ...item, qty: 0 }],
    [{ ...item, qty: 21 }],
    [{ ...item, qty: 1.5 }],
  ])('rejects an invalid cart item %#', async (bad) => {
    const res = await post({ customerName: 'Test', email: 'buyer@example.com', items: [bad] })
    expect(res.status).toBe(400)
    expect((await res.json<{ error: string }>()).error).toBe('Invalid cart item')
  })

  it('rejects an empty cart', async () => {
    const res = await post({ customerName: 'Test', email: 'buyer@example.com', items: [] })
    expect(res.status).toBe(400)
  })

  it('never charges without a catalogue to price from', async () => {
    // No SUPABASE_PUBLISHABLE_KEY in the test environment: the order must stop before Paystack.
    const res = await post({ customerName: 'Test', email: 'buyer@example.com', items: [item] })
    expect(res.status).toBe(400)
    expect((await res.json<{ error: string }>()).error).toBe('Shop catalogue is not configured')
  })
})

describe('GET /api/orders/verify/:reference', () => {
  it('rejects a malformed reference', async () => {
    const res = await SELF.fetch('https://banimal.test/api/orders/verify/..%2F..%2Fbalance')
    expect(res.status).toBe(400)
  })
})

describe('CORS', () => {
  it('allows the Fruitful app origin', async () => {
    const res = await SELF.fetch('https://banimal.test/api/health', { headers: { Origin: 'https://fruitful.faa.zone' } })
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://fruitful.faa.zone')
  })

  it('does not allow an unknown origin', async () => {
    const res = await SELF.fetch('https://banimal.test/api/health', { headers: { Origin: 'https://evil.example' } })
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull()
  })
})
