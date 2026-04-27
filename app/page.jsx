import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import HeroCarousel from '@/components/HeroCarousel'
import Link from 'next/link'

async function getFeaturedProducts() {
  const { data } = await supabase
    .from('products')
    .select('*, categories(slug, name)')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(6)
  return data || []
}

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  const categories = [
    ['All products',    '/products'],
    ['Vegetables',      '/products?cat=vegetables'],
    ['Fruits',          '/products?cat=fruits'],
    ['Grains & Pulses', '/products?cat=grains-pulses'],
    ['Dairy',           '/products?cat=dairy'],
    ['Herbs',           '/products?cat=herbs'],
    ['Seasonal box',    '/products?cat=seasonal-box'],
  ]

  const trustItems = ['No pesticides ever','Harvested to order','24hr delivery','Seasonal picks weekly']
  const stats      = [['12','Acres farmed'],['40+','Varieties grown'],['3','Generations']]

  return (
    <div>
      {/* Hero */}
      <section className="home-hero" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:380, overflow:'hidden' }}>
        <div className="home-hero-copy" style={{ padding:'56px 48px', background:'#2d5016', display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'#c8a96e', marginBottom:16 }}>
            100% Certified Organic · Amravati, Maharashtra
          </div>
          <h1 className="home-hero-title" style={{ fontFamily:'Playfair Display,serif', fontSize:42, fontWeight:700, color:'#fff', lineHeight:1.15, margin:'0 0 18px' }}>
            Farm-fresh goodness,<br />
            <em style={{ color:'#c8a96e', fontStyle:'normal' }}>straight</em> to your door
          </h1>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.7)', lineHeight:1.75, marginBottom:32, maxWidth:360 }}>
            Grown without chemicals on our family farm. Harvested at peak freshness and delivered within 24 hours of picking.
          </p>
          <div className="hero-actions" style={{ display:'flex', gap:12 }}>
            <Link href="/products" className="btn-primary">Shop now</Link>
            <a href="#story" className="btn-outline">Our story</a>
          </div>
        </div>
        <div className="home-hero-art" style={{ background:'#e8f0df', display:'flex', alignItems:'center', justifyContent:'center', padding:40, position:'relative' }}>
          <div style={{ width:240, height:240, borderRadius:'50%', background:'linear-gradient(135deg,#c8e6b0,#88c057)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ width:170, height:170, borderRadius:'50%', background:'linear-gradient(135deg,#4a7c2f,#2d5016)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:80 }}>🌿</div>
          </div>
          <HeroCarousel />
          <div style={{ position:'absolute', top:36, right:36, background:'#fff', borderRadius:12, padding:'12px 16px', boxShadow:'0 4px 16px rgba(0,0,0,0.1)' }}>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, color:'#2d5016' }}>200+</div>
            <div style={{ fontSize:12, color:'#6b6b60', marginTop:2 }}>Happy customers</div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="trust-bar" style={{ display:'flex', justifyContent:'center', background:'#fff', borderBottom:'1px solid rgba(0,0,0,0.06)' }}>
        {trustItems.map((t, i) => (
          <div className="trust-item" key={t} style={{
            padding:'14px 32px', fontSize:13, fontWeight:500, color:'#6b6b60',
            display:'flex', alignItems:'center', gap:8,
            borderRight: i < 3 ? '1px solid rgba(0,0,0,0.06)' : 'none',
          }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#4a7c2f' }} />
            {t}
          </div>
        ))}
      </div>

      {/* Categories */}
      <section className="page-section categories-section" style={{ padding:'36px 28px 0' }}>
        <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:26, fontWeight:600, margin:'0 0 20px' }}>
          What are you looking for?
        </h2>
        <div className="chip-row" style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          {categories.map(([label, href]) => (
            <Link key={label} href={href} className="cat-chip">{label}</Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="page-section" style={{ padding:'28px 28px 40px' }}>
        <div className="section-heading-row" style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:20 }}>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:26, fontWeight:600, margin:0 }}>Fresh this week</h2>
          <Link href="/products" className="see-all">See all →</Link>
        </div>
        <div className="product-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:16 }}>
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Story */}
      <section id="story" className="story-section" style={{ background:'#f5ede3', padding:'52px 28px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, alignItems:'center' }}>
        <div>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#8b5e3c', marginBottom:12 }}>Our farm</div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:32, fontWeight:700, margin:'0 0 16px', lineHeight:1.2 }}>
            Three generations of<br />honest farming
          </h2>
          <p style={{ fontSize:15, color:'#6b6b60', lineHeight:1.8, marginBottom:28 }}>
            No shortcuts. No chemicals. Just the goodness of rich Vidarbha black soil., rainwater, and the kind of patience that comes from loving the land.
          </p>
          <div className="stats-row" style={{ display:'flex', gap:32 }}>
            {stats.map(([n, l]) => (
              <div key={l} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'Playfair Display,serif', fontSize:32, fontWeight:700, color:'#2d5016' }}>{n}</div>
                <div style={{ fontSize:12, color:'#6b6b60', marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background:'#e8f0df', borderRadius:24, height:240, display:'flex', alignItems:'center', justifyContent:'center', fontSize:80 }}>🌱</div>
      </section>
    </div>
  )
}
