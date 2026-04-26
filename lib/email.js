import { Resend } from 'resend'

const CONTACT_EMAIL = 'prashantvasukar@gmail.com'
const CONTACT_PHONE = '9082727526'

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is missing.')
  }

  return new Resend(process.env.RESEND_API_KEY)
}

function getFromEmail() {
  if (!process.env.RESEND_FROM_EMAIL) {
    throw new Error('RESEND_FROM_EMAIL is missing.')
  }

  return process.env.RESEND_FROM_EMAIL
}

export async function sendOrderConfirmation({ to, order, items }) {
  const itemsList = items.map(i =>
    `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #eee">${i.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center">${i.qty}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">Rs.${i.price * i.qty}</td>
    </tr>`
  ).join('')

  const resend = getResend()
  const { error } = await resend.emails.send({
    from: getFromEmail(),
    to,
    replyTo: process.env.CONTACT_TO_EMAIL || CONTACT_EMAIL,
    subject: `Order confirmed #${order.id.slice(0, 8).toUpperCase()} - R-R-Organic`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1c1c1a">
        <div style="background:#2d5016;padding:24px 32px">
          <h1 style="font-family:Georgia,serif;color:#fff;margin:0;font-size:24px">R-R-Organic</h1>
          <p style="color:#c8a96e;margin:4px 0 0;font-size:13px">Fresh farm produce delivered locally</p>
        </div>
        <div style="padding:32px">
          <h2 style="font-family:Georgia,serif;font-size:22px;margin:0 0 8px">Your order is confirmed!</h2>
          <p style="color:#6b6b60;margin:0 0 24px">We received your payment and will prepare your order soon.</p>
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="border-bottom:2px solid #2d5016">
                <th style="text-align:left;padding-bottom:8px;font-size:13px">Item</th>
                <th style="text-align:center;padding-bottom:8px;font-size:13px">Qty</th>
                <th style="text-align:right;padding-bottom:8px;font-size:13px">Amount</th>
              </tr>
            </thead>
            <tbody>${itemsList}</tbody>
          </table>
          <div style="text-align:right;margin-top:16px;font-size:18px;font-weight:600">
            Total: Rs.${order.total}
          </div>
          <div style="margin-top:24px;padding:16px;background:#f5ede3;border-radius:8px;font-size:13px;color:#6b6b60">
            Delivering to: ${order.address}
          </div>
        </div>
        <div style="padding:16px 32px;border-top:1px solid #eee;font-size:12px;color:#777;text-align:center">
          Questions? Contact ${CONTACT_EMAIL} or WhatsApp +91 ${CONTACT_PHONE}.
        </div>
      </div>
    `,
  })

  if (error) {
    throw new Error(error.message || 'Could not send order confirmation email.')
  }
}
