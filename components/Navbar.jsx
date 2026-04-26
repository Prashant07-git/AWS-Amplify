'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useCartStore } from '@/lib/cart-store'
import CartDrawer from './CartDrawer'

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const getItemCount = useCartStore(s => s.getItemCount)
  const itemCount    = getItemCount()

  return (
    <>
      <nav className="site-nav" style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'14px 28px', background:'#faf6ef',
        borderBottom:'1px solid rgba(45,80,22,0.12)',
        position:'sticky', top:0, zIndex:50,
      }}>
        <Link href="/" style={{ textDecoration:'none' }}>
          <span style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, color:'#2d5016', letterSpacing:'-0.5px' }}>
            R-R-<span style={{ color:'#c8a96e' }}>Organic</span>
          </span>
        </Link>

        <div className="site-nav-links" style={{ display:'flex', gap:24 }}>
          {[['Shop','/products'],['Our Farm','/#story'],['Seasonal','/products?cat=seasonal-box']].map(([label,href]) => (
            <Link key={label} href={href} className="nav-link">{label}</Link>
          ))}
          <Link href="/account" className="nav-link mobile-account-link">Account</Link>
        </div>

        <div className="site-nav-actions" style={{ display:'flex', gap:12, alignItems:'center' }}>
          <Link href="/account" className="nav-link">Account</Link>
          <button onClick={() => setDrawerOpen(true)} style={{
            background:'#2d5016', color:'#fff', border:'none', borderRadius:999,
            padding:'8px 18px', fontSize:13, fontWeight:500, cursor:'pointer',
            display:'flex', alignItems:'center', gap:8,
          }}>
            Cart
            {itemCount > 0 && (
              <span style={{
                background:'#c8a96e', color:'#2d5016', borderRadius:'50%',
                width:20, height:20, fontSize:10, fontWeight:700,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>{itemCount}</span>
            )}
          </button>
        </div>
      </nav>
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
