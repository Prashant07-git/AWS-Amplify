import { NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase'

const TOGGLE_FIELDS = ['is_active', 'is_featured']

export async function PATCH(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, field, value } = await request.json()

  if (!id || !TOGGLE_FIELDS.includes(field) || typeof value !== 'boolean') {
    return NextResponse.json({ error: 'Invalid product update.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin()
    .from('products')
    .update({ [field]: value })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function POST(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const product = await request.json()

  if (!product.name || !product.price) {
    return NextResponse.json({ error: 'Product name and price are required.' }, { status: 400 })
  }

  const slug = product.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const { data, error } = await supabaseAdmin()
    .from('products')
    .insert({
      name: product.name,
      slug,
      description: product.description || '',
      price: Number(product.price),
      unit: product.unit || '',
      stock: Number.parseInt(product.stock, 10) || 0,
      category_id: product.category_id || null,
    })
    .select('*, categories(name)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ product: data }, { status: 201 })
}
