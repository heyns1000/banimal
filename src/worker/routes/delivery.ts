import { Hono } from 'hono'

const delivery = new Hono<{ Bindings: Env }>()

const BOBGO_PROD_BASE = 'https://api.bobgo.co.za/v2'
const BOBGO_SANDBOX_BASE = 'https://api.sandbox.bobgo.co.za/v2'

// Pick the BobGo base URL from env. Set BOBGO_ENV='production' to go live;
// anything else (or unset) uses the sandbox so test keys never hit production.
function bobgoBase(env: any): string {
  return env?.BOBGO_ENV === 'production' ? BOBGO_PROD_BASE : BOBGO_SANDBOX_BASE
}

// BobGo authenticates with the API key as a Bearer token.
function bobgoHeaders(apiKey: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  }
}

// Get delivery rates from BobGo
delivery.post('/rates', async (c) => {
  // The deployed checkout bundle POSTs { address, city, postal, province,
  // country, itemCount, cartValueZar } — not the { toPostalCode,
  // orderValueZAR } shape this route was originally written against. Accept
  // both so this keeps working for any other caller too.
  const body = await c.req.json() as {
    postal?: string
    toPostalCode?: string
    cartValueZar?: number
    orderValueZAR?: number
    parcelWeightKg?: number
    fromPostalCode?: string
  }
  const toPostalCode = body.postal ?? body.toPostalCode
  const orderValueZAR = body.cartValueZar ?? body.orderValueZAR

  const apiKey = (c.env as any).BOBGO_API_KEY as string

  // The checkout UI reads rate.id / rate.amountZar / rate.courier /
  // rate.estimatedDays — not service/price/carrier/days. Every rate
  // returned from this route (real or fallback) must use that shape or
  // the UI renders "NaN" for the price and can't tell rates apart.
  if (!apiKey) {
    return c.json({
      rates: [
        { id: 'standard', service: 'Standard Delivery', courier: 'Courier Guy', amountZar: 85, estimatedDays: '3–5 business days' },
        { id: 'express', service: 'Express Delivery', courier: 'Fastway', amountZar: 145, estimatedDays: '1–2 business days' },
        { id: 'economy', service: 'Economy Delivery', courier: 'Pargo', amountZar: 55, estimatedDays: '5–7 business days' },
      ],
    })
  }

  if (!toPostalCode) {
    return c.json({ rates: [], error: 'missing delivery postal code' })
  }

  try {
    const resp = await fetch(`${bobgoBase(c.env)}/rates`, {
      method: 'POST',
      headers: bobgoHeaders(apiKey),
      body: JSON.stringify({
        collection_address: { postal_code: body.fromPostalCode || '7550' },
        delivery_address: { postal_code: toPostalCode },
        parcels: [{
          submitted_length_cm: 35,
          submitted_width_cm: 25,
          submitted_height_cm: 10,
          submitted_weight_kg: body.parcelWeightKg || 0.5,
        }],
        declared_value: orderValueZAR,
      }),
    })

    const data = await resp.json() as any
    const rates = (data.rates || []).map((r: any, idx: number) => ({
      id: r.service_code || r.code || `rate-${idx}`,
      service: r.service_name || r.service_level,
      courier: r.carrier_name || r.courier,
      amountZar: Math.round(r.rate || r.price || 0),
      estimatedDays: r.estimated_delivery_days ? `${r.estimated_delivery_days} business days` : 'Contact for ETA',
    }))

    return c.json({ rates })
  } catch (err) {
    return c.json({ rates: [], error: 'Could not fetch BobGo rates', message: String(err) }, 502)
  }
})

// Book a shipment via BobGo
delivery.post('/book', async (c) => {
  const body = await c.req.json() as {
    serviceCode: string
    from: { name: string; address: string; suburb: string; city: string; postalCode: string; phone: string }
    to: { name: string; address: string; suburb: string; city: string; postalCode: string; phone: string }
    parcelDescription: string
    orderRef: string
  }

  const apiKey = (c.env as any).BOBGO_API_KEY as string
  if (!apiKey) return c.json({ error: 'BobGo not configured' }, 503)

  const resp = await fetch(`${bobgoBase(c.env)}/shipments`, {
    method: 'POST',
    headers: bobgoHeaders(apiKey),
    body: JSON.stringify({
      service_code: body.serviceCode,
      collection_address: { name: body.from.name, address: body.from.address, suburb: body.from.suburb, city: body.from.city, postal_code: body.from.postalCode, contact_number: body.from.phone },
      delivery_address: { name: body.to.name, address: body.to.address, suburb: body.to.suburb, city: body.to.city, postal_code: body.to.postalCode, contact_number: body.to.phone },
      parcels: [{ description: body.parcelDescription, submitted_weight_kg: 0.5 }],
      reference: body.orderRef,
    }),
  })

  const data = await resp.json() as any
  return c.json({ waybillNumber: data.waybill_number, trackingUrl: data.tracking_url, status: data.status })
})

// Track a shipment
delivery.get('/track/:waybill', async (c) => {
  const waybill = c.req.param('waybill')
  const apiKey = (c.env as any).BOBGO_API_KEY as string
  if (!apiKey) return c.json({ error: 'BobGo not configured' }, 503)

  const resp = await fetch(`${bobgoBase(c.env)}/shipments/${waybill}/tracking`, {
    headers: bobgoHeaders(apiKey),
  })
  const data = await resp.json() as any
  return c.json(data)
})

export default delivery
