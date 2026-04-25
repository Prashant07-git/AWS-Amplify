'use client'
import { Suspense, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const STATUS_COLORS = {
  pending:    { bg:'#fff8e1', color:'#856404' },
  paid:       { bg:'#e8f0df', color:'#2d5016' },
  processing: { bg:'#e8f0df', color:'#2d5016' },
  dispatched: { bg:'#e8f0fb', color:'#185fa5' },
  delivered:  { bg:'#e8f0df', color:'#2d5016' },
  cancelled:  { bg:'#fde8e8', color:'#a32d2d' },
}

function OrdersContent() {
  const searchParams = useSearchParams()
  const success      = searchParams.get('success')
  const [orders,   setOrders]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [user,     setUser]     = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setLoading(false); return }
      setUser(data.user)
      const { data: orders } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false })
      setOrders(orders || [])
      setLoading(false)
    })
  }, [])

  if (!user && !loading) return (
    <div style={{ textAlign:'center', padding:'80px 28px' }}>
      <h2 style={{ fontFamily:'Playfair Display,serif' }}>Please sign in to view orders</h2>
      <Link href="/account" style={{ color:'#2d5016', fontWeight:500 }}>Sign in</Link>
    </div>
  )

  return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'40px 28px' }}>
      {success && (
        <div style={{
          background:'#e8f0df', border:'1px solid #4a7c2f', borderRadius:12,
          padding:'16px 20px', marginBottom:28, display:'flex', alignItems:'center', gap:12,
        }}>
          <span style={{ fontSize:24 }}>🎉</span>
          <div>
            <div style={{ fontWeight:600, color:'#2d5016' }}>Order placed successfully!</div>
            <div style={{ fontSize:13, color:'#4a7c2f' }}>You will receive a confirmation email shortly.</div>
          </div>
        </div>
      )}

      <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:32, marginBottom:28 }}>My Orders</h1>

      {loading ? (
        <p style={{ color:'#6b6b60' }}>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', color:'#6b6b60' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📦</div>
          <p style={{ fontSize:15 }}>No orders yet</p>
          <Link href="/products" style={{ color:'#2d5016', fontWeight:500, marginTop:8, display:'inline-block' }}>
            Start shopping →
          </Link>
        </div>
      ) : (
        orders.map(order => {
          const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending
          return (
            <div key={order.id} style={{
              background:'#fff', borderRadius:16,
              border:'1px solid rgba(0,0,0,0.08)',
              padding:20, marginBottom:16,
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:12 }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:14 }}>
                    Order #{order.id.slice(0,8).toUpperCase()}
                  </div>
                  <div style={{ fontSize:12, color:'#6b6b60', marginTop:2 }}>
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{
                    background: s.bg, color: s.color,
                    fontSize:11, fontWeight:600, padding:'4px 10px',
                    borderRadius:999, textTransform:'capitalize',
                  }}>
                    {order.status}
                  </span>
                  <span style={{ fontFamily:'Playfair Display,serif', fontSize:18, fontWeight:700, color:'#2d5016' }}>
                    Rs.{order.total}
                  </span>
                </div>
              </div>
              <div style={{ fontSize:13, color:'#6b6b60' }}>
                {order.order_items?.map(i => `${i.name} x${i.qty}`).join(', ')}
              </div>
              <div style={{ fontSize:12, color:'#aaa', marginTop:8 }}>
                Delivering to: {order.address}, {order.city}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div style={{ padding:'80px 28px', textAlign:'center', color:'#6b6b60' }}>Loading orders...</div>}>
      <OrdersContent />
    </Suspense>
  )
}
