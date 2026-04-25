import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

// POST /api/webhook - Razorpay payment webhook
export async function POST(request) {
  const body      = await request.text()
  const signature = request.headers.get('x-razorpay-signature')
  const secret    = process.env.RAZORPAY_KEY_SECRET

  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  if (expected !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(body)

  if (event.event === 'payment.captured') {
    const paymentId = event.payload.payment.entity.id
    const orderId   = event.payload.payment.entity.order_id

    await supabaseAdmin()
      .from('orders')
      .update({ status: 'paid', razorpay_payment_id: paymentId })
      .eq('razorpay_order_id', orderId)
  }

  return NextResponse.json({ received: true })
}
