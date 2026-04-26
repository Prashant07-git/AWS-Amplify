import { NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase'

const STATUS_OPTIONS = ['pending','paid','processing','dispatched','delivered','cancelled']

export async function PATCH(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { orderId, status } = await request.json()

  if (!orderId || !STATUS_OPTIONS.includes(status)) {
    return NextResponse.json({ error: 'Invalid order status update.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin()
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
