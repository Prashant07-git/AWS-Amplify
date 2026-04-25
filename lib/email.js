import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmation({ to, order, items }) {
  const itemsList = items.map(i =>
    `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #eee">${i.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center">${i.qty}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">₹${i.price * i.qty}</td>
    </tr>`
  ).join('')

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to,
    subject: `Order confirmed #${order.id.slice(0, 8).toUpperCase()} — R-R-Organic`,
    html: `
      <div style="font-family:DM Sans,sans-serif;max-width:560px;margin:0 auto;color:#1c1c1a">
        <div style="background:#2d5016;padding:24px 32px">
          <h1 style="font-family:Georgia,serif;color:#fff;margin:0;font-size:24px">R-R-Organic</h1>
          <p style="color:#c8a96e;margin:4px 0 0;font-size:13px">100% Organic · Amravati, Maharashtra</p>
        </div>
        <div style="padding:32px">
          <h2 style="font-family:Georgia,serif;font-size:22px;margin:0 0 8px">Your order is confirmed!</h2>
          <p style="color:#6b6b60;margin:0 0 24px">We'll harvest your items fresh and dispatch within 24 hours.</p>
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
            Total: ₹${order.total}
          </div>
          <div style="margin-top:24px;padding:16px;background:#f5ede3;border-radius:8px;font-size:13px;color:#6b6b60">
            Delivering to: ${order.address}
          </div>
        </div>
        <div style="padding:16px 32px;border-top:1px solid #eee;font-size:12px;color:#999;text-align:center">
          Questions? Reply to this email or WhatsApp us · R-R-Organic, Amravati
        </div>
      </div>
    `,
  })
}
