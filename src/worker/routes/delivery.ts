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
  const body = await c.req.json() as {
    toPostalCode: string
    orderValueZAR: number
    parcelWeightKg?: number
    fromPostalCode?: string
  }

  const apiKey = (c.env as any).BOBGO_API_KEY as string

  if (!apiKey) {
    // Return sensible defaults when not configured
    return c.json({
      rates: [
        { service: 'Standard Delivery', carrier: 'Courier Guy', price: 85, days: '3–5 business days' },
        { service: 'Express Delivery', carrier: 'Fastway', price: 145, days: '1–2 business days' },
        { service: 'Economy Delivery', carrier: 'Pargo', price: 55, days: '5–7 business days' },
      ],
    })
  }

  try {
    const resp = await fetch(`${bobgoBase(c.env)}/rates`, {
      method: 'POST',
      headers: bobgoHeaders(apiKey),
      body: JSON.stringify({
        collection_address: { postal_code: body.fromPostalCode || '7550' },
        delivery_address: { postal_code: body.toPostalCode },
        parcels: [{
          submitted_length_cm: 35,
          submitted_width_cm: 25,
          submitted_height_cm: 10,
          submitted_weight_kg: body.parcelWeightKg || 0.5,
        }],
        declared_value: body.orderValueZAR,
      }),
    })

    const data = await resp.json() as any
    const rates = (data.rates || []).map((r: any) => ({
      service: r.service_name || r.service_level,
      carrier: r.carrier_name || r.courier,
      price: Math.round(r.rate || r.price || 0),
      days: r.estimated_delivery_days ? `${r.estimated_delivery_days} business days` : 'Contact for ETA',
      serviceCode: r.service_code || r.code,
    }))

    return c.json({ rates })
  } catch (err) {
    return c.json({ error: 'Could not fetch BobGo rates', message: String(err) }, 502)
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
