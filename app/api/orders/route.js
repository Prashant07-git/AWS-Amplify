import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyRazorpaySignature } from '@/lib/razorpay'
import { sendOrderConfirmation } from '@/lib/email'

// POST /api/orders - save order after successful payment
export async function POST(request) {
  try {
    const {
      items, total, form, userId,
      razorpayOrderId, razorpayPaymentId, razorpaySignature,
    } = await request.json()

    // Verify payment signature
    const valid = verifyRazorpaySignature({
      orderId:   razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    })
    if (!valid) return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })

    const db = supabaseAdmin()

    // Create order
    const { data: order, error: orderErr } = await db
      .from('orders')
      .insert({
        user_id:              userId || null,
        status:               'paid',
        total,
        address:              form.address,
        city:                 form.city,
        pincode:              form.pincode,
        phone:                form.phone,
        razorpay_order_id:    razorpayOrderId,
        razorpay_payment_id:  razorpayPaymentId,
      })
      .select()
      .single()

    if (orderErr) throw orderErr

    // Create order items
    const orderItems = items.map(i => ({
      order_id:   order.id,
      product_id: i.id,
      name:       i.name,
      price:      i.price,
      qty:        i.qty,
      image_url:  i.image_url || null,
    }))
    await db.from('order_items').insert(orderItems)

    // Reduce stock
    for (const item of items) {
      await db.rpc('decrement_stock', { p_id: item.id, qty: item.qty })
    }

    let emailSent = false

    // Send confirmation email after the order is safely stored.
    if (form.email) {
      try {
        await sendOrderConfirmation({
          to:    form.email,
          order: { ...order, address: `${form.address}, ${form.city} - ${form.pincode}` },
          items: orderItems,
        })
        emailSent = true
      } catch (emailError) {
        console.error('Order confirmation email error:', emailError)
      }
    }

    return NextResponse.json({ orderId: order.id, emailSent }, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

// GET /api/orders?userId=xxx - fetch user orders
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  const { data, error } = await supabaseAdmin()
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
