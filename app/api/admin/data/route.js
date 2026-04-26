import { NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = supabaseAdmin()
  const [{ data: orders, error: ordersError }, { data: products, error: productsError }, { data: categories, error: categoriesError }] = await Promise.all([
    db.from('orders').select('*, order_items(*)').order('created_at', { ascending:false }),
    db.from('products').select('*, categories(name)').order('created_at', { ascending:false }),
    db.from('categories').select('*'),
  ])

  const error = ordersError || productsError || categoriesError
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    orders: orders || [],
    products: products || [],
    categories: categories || [],
  })
}
