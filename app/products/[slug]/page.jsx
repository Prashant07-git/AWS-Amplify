import { supabase } from '@/lib/supabase'
import AddToCartBtn from './AddToCartBtn'
import Link from 'next/link'

export async function generateMetadata({ params }) {
  const { data } = await supabase.from('products').select('name,description').eq('slug', params.slug).single()
  return { title: `${data?.name} — HarvestCo`, description: data?.description }
}

const EMOJI = { vegetables:'🥦', fruits:'🍅', 'grains-pulses':'🌾', dairy:'🥛', herbs:'🌿', 'seasonal-box':'📦' }
const BG    = {
  vegetables:'linear-gradient(135deg,#e8f5e2,#c8e6b0)',
  fruits:'linear-gradient(135deg,#fde8e8,#f5c4b3)',
  'grains-pulses':'linear-gradient(135deg,#fdf3e3,#f5dfa8)',
  dairy:'linear-gradient(135deg,#e8f0fb,#c8daf5)',
  herbs:'linear-gradient(135deg,#e8f5e2,#b8dba0)',
  'seasonal-box':'linear-gradient(135deg,#fdf3e3,#e8f0df)',
}

export default async function ProductPage({ params }) {
  const { data: product } = await supabase
    .from('products')
    .select('*, categories(slug, name)')
    .eq('slug', params.slug)
    .single()

  if (!product) return (
    <div style={{ textAlign:'center', padding:'80px 28px' }}>
      <p style={{ fontSize:48, marginBottom:12 }}>🌱</p>
      <h2 style={{ fontFamily:'Playfair Display,serif' }}>Product not found</h2>
      <Link href="/products" style={{ color:'#2d5016', fontWeight:500 }}>← Back to shop</Link>
    </div>
  )

  const slug  = product.categories?.slug || 'vegetables'
  const emoji = EMOJI[slug] || '🌱'
  const bg    = BG[slug]   || BG.vegetables

  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:'48px 28px' }}>
      <Link href="/products" style={{ fontSize:13, color:'#6b6b60', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:4, marginBottom:24 }}>
        ← Back to products
      </Link>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'start' }}>
        {/* Image */}
        <div style={{ borderRadius:20, overflow:'hidden', height:380, background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:120, position:'relative' }}>
          {product.image_url
            ? <img src={product.image_url} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            : emoji
          }
          {product.is_organic && (
            <span style={{ position:'absolute', top:16, left:16, background:'#2d5016', color:'#fff', fontSize:10, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', padding:'4px 10px', borderRadius:999 }}>
              Certified Organic
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          <div style={{ fontSize:12, color:'#6b6b60', textTransform:'capitalize', marginBottom:6 }}>{product.categories?.name}</div>
          <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:34, fontWeight:700, margin:'0 0 8px', lineHeight:1.2 }}>{product.name}</h1>
          <div style={{ fontSize:12, fontWeight:500, marginBottom:20, color: product.stock > 0 ? '#4a7c2f' : '#e24b4a' }}>
            {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
          </div>
          <p style={{ fontSize:15, color:'#6b6b60', lineHeight:1.8, marginBottom:28 }}>{product.description}</p>
          <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:28 }}>
            <span style={{ fontFamily:'Playfair Display,serif', fontSize:36, fontWeight:700, color:'#2d5016' }}>₹{product.price}</span>
            <span style={{ fontSize:14, color:'#6b6b60' }}>{product.unit}</span>
          </div>

          <AddToCartBtn product={product} emoji={emoji} />

          <div style={{ marginTop:28, display:'flex', flexDirection:'column', gap:8 }}>
            {['Harvested fresh for your order','Delivered within 24 hours','100% naturally grown'].map(t => (
              <div key={t} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#6b6b60' }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:'#4a7c2f', flexShrink:0 }} />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
