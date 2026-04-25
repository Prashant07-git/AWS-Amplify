import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const body     = razorpay_order_id + '|' + razorpay_payment_id
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: 'Payment verification failed - signature mismatch' }, { status: 400 })
    }

    return NextResponse.json({ verified: true, payment_id: razorpay_payment_id })

  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json({ error: 'Verification error' }, { status: 500 })
  }
}
