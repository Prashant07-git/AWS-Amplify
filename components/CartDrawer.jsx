'use client'
import { useCartStore } from '@/lib/cart-store'
import Link from 'next/link'

export default function CartDrawer({ open, onClose }) {
  const items        = useCartStore(s => s.items)
  const removeItem   = useCartStore(s => s.removeItem)
  const updateQty    = useCartStore(s => s.updateQty)
  const getTotal     = useCartStore(s => s.getTotal)
  const total        = getTotal()

  return (
    <>
      {open && <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', zIndex:100, backdropFilter:'blur(2px)' }} />}
      <div style={{
        position:'fixed', top:0, right:0, height:'100vh', width:380,
        background:'#faf6ef', zIndex:101, boxShadow:'-8px 0 32px rgba(0,0,0,0.12)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition:'transform 0.3s ease', display:'flex', flexDirection:'column',
      }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(0,0,0,0.08)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:600 }}>Your Cart</span>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#6b6b60', lineHeight:1 }}>×</button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'16px 24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign:'center', padding:'48px 0', color:'#6b6b60' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🛒</div>
              <p style={{ fontSize:15 }}>Your cart is empty</p>
              <p style={{ fontSize:13, marginTop:4 }}>Add some fresh produce!</p>
            </div>
          ) : items.map(item => (
            <div key={item.id} style={{ display:'flex', gap:12, padding:'12px 0', borderBottom:'1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ width:56, height:56, borderRadius:10, background:'#e8f0df', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>
                {item.emoji || '🌱'}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:500, fontSize:14 }}>{item.name}</div>
                <div style={{ fontSize:12, color:'#6b6b60' }}>{item.unit}</div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width:24, height:24, borderRadius:'50%', border:'1px solid #ddd', background:'#fff', cursor:'pointer', fontSize:14, lineHeight:1 }}>−</button>
                    <span style={{ fontSize:14, fontWeight:500, minWidth:20, textAlign:'center' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width:24, height:24, borderRadius:'50%', border:'none', background:'#2d5016', color:'#fff', cursor:'pointer', fontSize:14, lineHeight:1 }}>+</button>
                  </div>
                  <span style={{ fontFamily:'Playfair Display,serif', fontWeight:600, fontSize:15 }}>₹{Number(item.price) * item.qty}</span>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#bbb', fontSize:16, alignSelf:'flex-start', padding:0 }}>×</button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div style={{ padding:'16px 24px', borderTop:'1px solid rgba(0,0,0,0.08)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14, fontSize:16, fontWeight:500 }}>
              <span>Total</span>
              <span style={{ fontFamily:'Playfair Display,serif', fontSize:20 }}>₹{total}</span>
            </div>
            <Link href="/checkout" onClick={onClose} style={{
              display:'block', width:'100%', background:'#2d5016', color:'#fff',
              padding:'14px', borderRadius:999, textAlign:'center',
              textDecoration:'none', fontWeight:500, fontSize:15,
            }}>
              Proceed to checkout
            </Link>
            <button onClick={onClose} style={{ display:'block', width:'100%', background:'none', border:'none', color:'#6b6b60', fontSize:13, cursor:'pointer', marginTop:10 }}>
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
