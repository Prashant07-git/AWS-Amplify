import crypto from 'crypto'
import Razorpay from 'razorpay'

// Initialize lazily so missing env vars give a clear error
export function getRazorpay() {
  return new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

export function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  const body     = orderId + '|' + paymentId
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex')
  return expected === signature
}
