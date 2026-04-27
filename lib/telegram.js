function isTelegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_ADMIN_CHAT_ID)
}

function formatOrderItems(items) {
  return items
    .map(item => `- ${item.name} x${item.qty}: Rs.${Number(item.price) * item.qty}`)
    .join('\n')
}

export async function sendAdminOrderTelegram({ order, form, items }) {
  if (!isTelegramConfigured()) return false

  const text = [
    'New order received',
    '',
    `Order: #${order.id.slice(0, 8).toUpperCase()}`,
    `Total: Rs.${order.total}`,
    `Customer: ${form.name}`,
    `Phone: ${form.phone}`,
    `Email: ${form.email || 'Not provided'}`,
    `Address: ${form.address}, ${form.city} - ${form.pincode}`,
    '',
    'Items:',
    formatOrderItems(items),
  ].join('\n')

  const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_ADMIN_CHAT_ID,
      text,
      disable_web_page_preview: true,
    }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(data?.description || 'Telegram notification failed.')
  }

  return true
}
