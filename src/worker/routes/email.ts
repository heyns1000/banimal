import { Hono } from 'hono'

const email = new Hono<{ Bindings: Env }>()

const FROM_HELLO = 'hello@banimal.co.za'
const FROM_MUD = 'mud@banimal.co.za'

type MailPayload = {
  to: string
  subject: string
  html: string
  text: string
}

async function sendMail(env: Env, payload: MailPayload, from: string): Promise<boolean> {
  const apiKey = (env as any).SENDGRID_API_KEY as string
  if (!apiKey) {
    console.log(`[MAIL] (no key) From ${from} → ${payload.to}: ${payload.subject}`)
    return true
  }

  const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: payload.to }] }],
      from: { email: from, name: 'Banimal' },
      subject: payload.subject,
      content: [
        { type: 'text/plain', value: payload.text },
        { type: 'text/html', value: payload.html },
      ],
    }),
  })
  return resp.ok
}

// hello@banimal.co.za — general enquiry handler
email.post('/hello/enquiry', async (c) => {
  const body = await c.req.json() as {
    name: string
    email: string
    message: string
    subject?: string
  }

  if (!body.email || !body.message) return c.json({ error: 'Missing required fields' }, 400)

  // Forward to the hello@ inbox
  const forwarded = await sendMail(c.env, {
    to: FROM_HELLO,
    subject: `Enquiry from ${body.name}: ${body.subject || 'General'}`,
    html: `<p><strong>From:</strong> ${body.name} (${body.email})</p><p>${body.message.replace(/\n/g, '<br>')}</p>`,
    text: `From: ${body.name} (${body.email})\n\n${body.message}`,
  }, FROM_HELLO)

  // Auto-reply to sender
  await sendMail(c.env, {
    to: body.email,
    subject: `Thanks for reaching out, ${body.name.split(' ')[0]} — Banimal`,
    html: helloAutoReply(body.name),
    text: `Hi ${body.name},\n\nThanks for your message. We\'ll get back to you within 1–2 business days.\n\nWarm regards,\nThe Banimal Team\nhello@banimal.co.za`,
  }, FROM_HELLO)

  return c.json({ ok: forwarded })
})

// mud@banimal.co.za — transactional email automation
email.post('/mud/welcome', async (c) => {
  const body = await c.req.json() as { name: string; email: string; provider?: string }
  const ok = await sendMail(c.env, {
    to: body.email,
    subject: `Welcome to Banimal, ${body.name.split(' ')[0]} ✨`,
    html: welcomeEmail(body.name),
    text: `Hi ${body.name},\n\nWelcome to Banimal! We make 100% organic cotton babygrows and bibs, thoughtfully designed in South Africa.\n\nShop now: https://banimal.faa.zone/shop\n\nWarm regards,\nThe Banimal Team`,
  }, FROM_MUD)
  return c.json({ ok })
})

email.post('/mud/order-confirmation', async (c) => {
  const body = await c.req.json() as {
    name: string
    email: string
    orderId: string
    items: Array<{ name: string; qty: number; price: number }>
    total: number
    deliveryService: string
    givingAmount: number
  }
  const ok = await sendMail(c.env, {
    to: body.email,
    subject: `Order confirmed — #${body.orderId}`,
    html: orderConfirmationEmail(body),
    text: `Hi ${body.name},\n\nYour order #${body.orderId} is confirmed.\nTotal: R${body.total}\nDelivery: ${body.deliveryService}\nYour order funds R${body.givingAmount.toFixed(2)} for a child in need.\n\nTrack your order: https://banimal.faa.zone/track/${body.orderId}`,
  }, FROM_MUD)
  return c.json({ ok })
})

email.post('/mud/order-update', async (c) => {
  const body = await c.req.json() as {
    name: string
    email: string
    orderId: string
    status: string
    trackingUrl?: string
    message?: string
  }
  const statusLabels: Record<string, string> = {
    packed: 'packed and ready to go',
    dispatched: 'on its way to you',
    out_for_delivery: 'out for delivery today',
    delivered: 'delivered',
  }
  const ok = await sendMail(c.env, {
    to: body.email,
    subject: `Your Banimal order #${body.orderId} is ${statusLabels[body.status] || body.status}`,
    html: orderUpdateEmail(body),
    text: `Hi ${body.name},\n\nOrder #${body.orderId} update: ${body.status}.${body.trackingUrl ? `\nTrack: ${body.trackingUrl}` : ''}`,
  }, FROM_MUD)
  return c.json({ ok })
})

email.post('/mud/abandoned-cart', async (c) => {
  const body = await c.req.json() as {
    name: string
    email: string
    items: Array<{ name: string; price: number }>
    cartUrl: string
  }
  const ok = await sendMail(c.env, {
    to: body.email,
    subject: `You left something behind — Banimal`,
    html: abandonedCartEmail(body),
    text: `Hi ${body.name},\n\nYou left items in your cart. Come back and complete your purchase:\n${body.cartUrl}\n\nUse code STAY10 for 10% off.`,
  }, FROM_MUD)
  return c.json({ ok })
})

function helloAutoReply(name: string) {
  return `<!DOCTYPE html><html><body style="font-family:Inter,sans-serif;color:#3d3019;background:#f6f1e7;padding:32px">
<div style="max-width:520px;margin:0 auto;background:#fdfbf5;border-radius:16px;padding:32px">
<img src="https://banimal.co.za/assets/logo-oV1EcZZO.png" alt="Banimal" style="height:28px;margin-bottom:24px" />
<h2 style="font-family:Georgia,serif;font-weight:400">Hi ${name.split(' ')[0]},</h2>
<p>Thanks for reaching out! We received your message and will get back to you within <strong>1–2 business days</strong>.</p>
<p style="color:#b49a6e">The Banimal Team — <a href="mailto:hello@banimal.co.za" style="color:#5c4a2a">hello@banimal.co.za</a></p>
</div></body></html>`
}

function welcomeEmail(name: string) {
  return `<!DOCTYPE html><html><body style="font-family:Inter,sans-serif;color:#3d3019;background:#f6f1e7;padding:32px">
<div style="max-width:520px;margin:0 auto;background:#fdfbf5;border-radius:16px;padding:32px">
<img src="https://banimal.co.za/assets/logo-oV1EcZZO.png" alt="Banimal" style="height:28px;margin-bottom:24px" />
<h2 style="font-family:Georgia,serif;font-weight:400">Welcome, ${name.split(' ')[0]} ✨</h2>
<p>We\'re so glad you\'re here. Banimal makes 100% organic cotton babygrows and bibs, thoughtfully designed in South Africa and shipped worldwide.</p>
<p><strong>Every order funds babygrows for children in need</strong> — 15.01% of every pre-tax sale goes straight to making that happen.</p>
<a href="https://banimal.faa.zone/shop" style="display:inline-block;margin-top:16px;background:#3d3019;color:#f6f1e7;padding:12px 24px;border-radius:12px;text-decoration:none;font-size:14px">Shop now</a>
</div></body></html>`
}

function orderConfirmationEmail(body: { name: string; orderId: string; items: any[]; total: number; deliveryService: string; givingAmount: number }) {
  const itemRows = body.items.map((i) => `<tr><td>${i.name}</td><td>${i.qty}</td><td>R ${i.price}</td></tr>`).join('')
  return `<!DOCTYPE html><html><body style="font-family:Inter,sans-serif;color:#3d3019;background:#f6f1e7;padding:32px">
<div style="max-width:520px;margin:0 auto;background:#fdfbf5;border-radius:16px;padding:32px">
<img src="https://banimal.co.za/assets/logo-oV1EcZZO.png" alt="Banimal" style="height:28px;margin-bottom:24px" />
<h2 style="font-family:Georgia,serif;font-weight:400">Order confirmed — #${body.orderId}</h2>
<table style="width:100%;font-size:14px;border-collapse:collapse"><thead><tr style="border-bottom:1px solid #ede4cf"><th align="left">Item</th><th>Qty</th><th>Price</th></tr></thead><tbody>${itemRows}</tbody></table>
<p style="margin-top:16px"><strong>Total:</strong> R ${body.total} &nbsp;&middot;&nbsp; <strong>Delivery:</strong> ${body.deliveryService}</p>
<p style="background:#fff0f0;border-radius:8px;padding:12px;font-size:13px">❤️ <strong>R ${body.givingAmount.toFixed(2)}</strong> from your order funds a babygrow for a child in need.</p>
<a href="https://banimal.faa.zone/track/${body.orderId}" style="display:inline-block;margin-top:16px;background:#3d3019;color:#f6f1e7;padding:12px 24px;border-radius:12px;text-decoration:none;font-size:14px">Track order</a>
</div></body></html>`
}

function orderUpdateEmail(body: { name: string; orderId: string; status: string; trackingUrl?: string; message?: string }) {
  return `<!DOCTYPE html><html><body style="font-family:Inter,sans-serif;color:#3d3019;background:#f6f1e7;padding:32px">
<div style="max-width:520px;margin:0 auto;background:#fdfbf5;border-radius:16px;padding:32px">
<img src="https://banimal.co.za/assets/logo-oV1EcZZO.png" alt="Banimal" style="height:28px;margin-bottom:24px" />
<h2 style="font-family:Georgia,serif;font-weight:400">Order update — #${body.orderId}</h2>
<p style="font-size:18px">${body.status}</p>
${body.message ? `<p>${body.message}</p>` : ''}
${body.trackingUrl ? `<a href="${body.trackingUrl}" style="display:inline-block;margin-top:16px;background:#3d3019;color:#f6f1e7;padding:12px 24px;border-radius:12px;text-decoration:none;font-size:14px">Track parcel</a>` : ''}
</div></body></html>`
}

function abandonedCartEmail(body: { name: string; items: any[]; cartUrl: string }) {
  return `<!DOCTYPE html><html><body style="font-family:Inter,sans-serif;color:#3d3019;background:#f6f1e7;padding:32px">
<div style="max-width:520px;margin:0 auto;background:#fdfbf5;border-radius:16px;padding:32px">
<img src="https://banimal.co.za/assets/logo-oV1EcZZO.png" alt="Banimal" style="height:28px;margin-bottom:24px" />
<h2 style="font-family:Georgia,serif;font-weight:400">You left something soft behind…</h2>
<p>Hi ${body.name.split(' ')[0]}, your Banimal cart is waiting. Use <strong>STAY10</strong> for 10% off.</p>
<a href="${body.cartUrl}" style="display:inline-block;margin-top:16px;background:#3d3019;color:#f6f1e7;padding:12px 24px;border-radius:12px;text-decoration:none;font-size:14px">Return to cart</a>
</div></body></html>`
}

export default email
