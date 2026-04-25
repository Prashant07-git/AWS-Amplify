import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function POST(request) {
  try {
    const { amount, currency = 'INR' } = await request.json()
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      return NextResponse.json({
        error: 'Payment server is missing Razorpay environment variables. Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in hosting settings.',
      }, { status: 500 })
    }

    // Validate minimum amount (100 paise = ₹1)
    const amountPaise = Math.round(amount * 100)
    if (amountPaise < 100) {
      return NextResponse.json({ error: 'Minimum order amount is ₹1' }, { status: 400 })
    }

    const razorpay = new Razorpay({
      key_id:     keyId,
      key_secret: keySecret,
    })

    const order = await razorpay.orders.create({
      amount:   amountPaise,
      currency,
      receipt:  `rcpt_${Date.now()}`,
    })

    return NextResponse.json({
      order_id: order.id,
      amount:   order.amount,
      currency: order.currency,
    })

  } catch (error) {
    console.error('Razorpay create-order error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 })
  }
}
