'use client'
import Link from 'next/link'
import { useCartStore } from '@/lib/cart-store'
import { formatINR } from '@/lib/format-money'
import { notifyCartAdded } from './CartToast'

const EMOJI = {
  vegetables:      '🥦',
  fruits:          '🍅',
  'grains-pulses': '🌾',
  dairy:           '🥛',
  herbs:           '🌿',
  'seasonal-box':  '📦',
}
const BG = {
  vegetables:      'linear-gradient(135deg,#e8f5e2,#c8e6b0)',
  fruits:          'linear-gradient(135deg,#fde8e8,#f5c4b3)',
  'grains-pulses': 'linear-gradient(135deg,#fdf3e3,#f5dfa8)',
  dairy:           'linear-gradient(135deg,#e8f0fb,#c8daf5)',
  herbs:           'linear-gradient(135deg,#e8f5e2,#b8dba0)',
  'seasonal-box':  'linear-gradient(135deg,#fdf3e3,#e8f0df)',
}

export default function ProductCard({ product }) {
  const addItem   = useCartStore(s => s.addItem)
  const updateQty = useCartStore(s => s.updateQty)
  const cartItem  = useCartStore(s => s.items.find(i => i.id === product.id))

  const slug  = product.categories?.slug || 'vegetables'
  const emoji = EMOJI[slug] || '🌱'
  const bg    = BG[slug]   || BG.vegetables
  const qty   = cartItem?.qty || 0
  const isAtStockLimit = product.stock > 0 && qty >= product.stock

  function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock === 0 || isAtStockLimit) return

    addItem({ ...product, emoji })
    notifyCartAdded(product.name)
  }

  function handleDecrease(e) {
    e.preventDefault()
    e.stopPropagation()
    updateQty(product.id, qty - 1)
  }

  return (
    <Link href={`/products/${product.slug}`} className="prod-card">
      {/* Image */}
      <div className="prod-card-media" style={{ height:140, display:'flex', alignItems:'center', justifyContent:'center', fontSize:52, background:bg, position:'relative' }}>
        {product.image_url
          ? <img src={product.image_url} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          : emoji
        }
        {product.is_organic && (
          <span style={{ position:'absolute', top:8, left:8, background:'#2d5016', color:'#fff', fontSize:9, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', padding:'3px 8px', borderRadius:999 }}>
            Organic
          </span>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <span style={{ position:'absolute', top:8, right:8, background:'#c8a96e', color:'#2d5016', fontSize:9, fontWeight:600, padding:'3px 8px', borderRadius:999 }}>
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,0.7)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600, color:'#6b6b60', fontSize:13 }}>
            Out of stock
          </div>
        )}
      </div>

      {/* Info */}
      <div className="prod-card-body" style={{ padding:'12px 14px 14px' }}>
        <div style={{ fontWeight:500, fontSize:14, color:'#1c1c1a', marginBottom:2 }}>{product.name}</div>
        <div style={{ fontSize:12, color:'#6b6b60' }}>{product.unit}</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10 }}>
          <span style={{ fontFamily:'Playfair Display,serif', fontSize:17, fontWeight:600, color:'#2d5016' }}>
            {formatINR(product.price)}
          </span>
          {qty > 0 ? (
            <div className="product-qty-stepper" onClick={e => { e.preventDefault(); e.stopPropagation() }} aria-label={`${product.name} quantity in cart`}>
              <button type="button" onClick={handleDecrease} aria-label={`Decrease ${product.name} quantity`}>-</button>
              <span className="product-qty-value">{qty}</span>
              <button type="button" onClick={handleAdd} disabled={isAtStockLimit} aria-label={`Increase ${product.name} quantity`}>+</button>
            </div>
          ) : (
            <button type="button" onClick={handleAdd} disabled={product.stock === 0} className="product-add-btn" aria-label={`Add ${product.name} to cart`}>
              +
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}
