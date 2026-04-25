'use client'
import { useCartStore } from '@/lib/cart-store'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddToCartBtn({ product, emoji }) {
  const addItem = useCartStore(s => s.addItem)
  const [added, setAdded] = useState(false)
  const router  = useRouter()

  function handleAdd() {
    addItem({ ...product, emoji })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div style={{ display:'flex', gap:12 }}>
      <button onClick={handleAdd} disabled={product.stock === 0} style={{
        flex:1, background: added ? '#c8a96e' : '#2d5016',
        color:'#fff', border:'none', borderRadius:999,
        padding:'14px 28px', fontSize:15, fontWeight:600,
        cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
        transition:'background .2s',
      }}>
        {product.stock === 0 ? 'Out of stock' : added ? '✓ Added to cart' : 'Add to cart'}
      </button>
      {added && (
        <button onClick={() => router.push('/checkout')} style={{
          background:'#fff', color:'#2d5016', border:'2px solid #2d5016',
          borderRadius:999, padding:'14px 24px', fontSize:15, fontWeight:600, cursor:'pointer',
        }}>
          Checkout →
        </button>
      )}
    </div>
  )
}
