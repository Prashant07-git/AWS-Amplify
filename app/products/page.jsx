'use client'
import { Suspense, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import { useSearchParams } from 'next/navigation'

const CATEGORIES = [
  { label:'All',             slug: null },
  { label:'Vegetables',      slug:'vegetables' },
  { label:'Fruits',          slug:'fruits' },
  { label:'Grains & Pulses', slug:'grains-pulses' },
  { label:'Dairy',           slug:'dairy' },
  { label:'Herbs',           slug:'herbs' },
  { label:'Seasonal Box',    slug:'seasonal-box' },
]

function ProductsContent() {
  const searchParams  = useSearchParams()
  const catParam      = searchParams.get('cat')
  const [products, setProducts]     = useState([])
  const [loading,  setLoading]      = useState(true)
  const [activecat, setActiveCat]   = useState(catParam)
  const [search, setSearch]         = useState('')

  useEffect(() => {
    fetchProducts()
  }, [activecat])

  async function fetchProducts() {
    setLoading(true)
    let query = supabase
      .from('products')
      .select('*, categories(slug, name)')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })

    if (activecat) {
      query = query.eq('categories.slug', activecat)
    }

    const { data } = await query
    setProducts(data || [])
    setLoading(false)
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="products-page" style={{ maxWidth:1200, margin:'0 auto', padding:'32px 28px' }}>
      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:36, fontWeight:700, margin:'0 0 6px' }}>
          Our Produce
        </h1>
        <p style={{ fontSize:15, color:'#6b6b60' }}>
          Everything harvested fresh for your order
        </p>
      </div>

      {/* Filters + Search */}
      <div className="products-toolbar" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div className="products-filters" style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.label} onClick={() => setActiveCat(cat.slug)} style={{
              background: activecat === cat.slug ? '#2d5016' : '#e8f0df',
              color:      activecat === cat.slug ? '#fff' : '#2d5016',
              border:'none', borderRadius:999, padding:'7px 18px',
              fontSize:13, fontWeight:500, cursor:'pointer', transition:'all .2s',
            }}>
              {cat.label}
            </button>
          ))}
        </div>
        <input
          className="products-search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          style={{
            padding:'8px 16px', borderRadius:999,
            border:'1px solid rgba(0,0,0,0.12)',
            fontSize:13, background:'#fff', outline:'none', width:200,
          }}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign:'center', padding:'60px 0', color:'#6b6b60', fontSize:15 }}>
          Loading fresh produce...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', color:'#6b6b60' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🌱</div>
          <p>No products found. Try a different filter!</p>
        </div>
      ) : (
        <div className="product-grid product-grid-large" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:18 }}>
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div style={{ padding:'60px 28px', textAlign:'center', color:'#6b6b60' }}>Loading fresh produce...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
