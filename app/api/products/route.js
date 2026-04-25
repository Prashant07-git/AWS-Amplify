import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/products - list products (with optional ?cat=slug)
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const cat = searchParams.get('cat')

  let query = supabaseAdmin()
    .from('products')
    .select('*, categories(slug, name)')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })

  if (cat) query = query.eq('categories.slug', cat)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/products - create product (admin only)
export async function POST(request) {
  const body = await request.json()
  const { data, error } = await supabaseAdmin()
    .from('products')
    .insert(body)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
