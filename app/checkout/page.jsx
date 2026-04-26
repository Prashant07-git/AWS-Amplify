'use client'
import { useCartStore } from '@/lib/cart-store'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false)
    if (window.Razorpay) return resolve(true)
    const script   = document.createElement('script')
    script.src     = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload  = () => resolve(true)
    script.onerror = () => resolve(false)
    document.head.appendChild(script)
  })
}

export default function CheckoutPage() {
  const items     = useCartStore(s => s.items)
  const getTotal  = useCartStore(s => s.getTotal)
  const clearCart = useCartStore(s => s.clearCart)
  const total     = getTotal()

  const router = useRouter()
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [form,    setForm]    = useState({ name:'', email:'', phone:'', address:'', city:'Panvel', pincode:'' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    // Pre-load Razorpay script as soon as checkout opens
    loadRazorpayScript()

    // Load user + pre-fill form from saved profile
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      setUser(data.user)
      setForm(current => ({ ...current, email: data.user.email || '' }))
      const { data: prof } = await supabase
        .from('profiles').select('*').eq('id', data.user.id).single()
      if (prof) {
        setProfile(prof)
        setForm({
          name:    prof.full_name || '',
          email:   data.user.email || '',
          phone:   prof.phone    || '',
          address: prof.address  || '',
          city:    prof.city     || 'Panvel',
          pincode: prof.pincode  || '',
        })
      }
    })
  }, [])

  function updateForm(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleCheckout() {
    // Validate form
    if (!form.name)    { setError('Please enter your full name.');    return }
    if (!form.email)   { setError('Please enter your email address.'); return }
    if (!form.phone)   { setError('Please enter your phone number.'); return }
    if (!form.address) { setError('Please enter your address.');      return }
    if (!form.pincode) { setError('Please enter your pincode.');      return }

    setLoading(true); setError('')

    try {
      // STEP 1: Load Razorpay SDK
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        setError('Could not load payment system. Please check internet connection.')
        setLoading(false); return
      }

      // STEP 2: Create order on backend
      const orderRes = await fetch('/api/payment', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ amount: total, currency: 'INR' }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create order')

      // STEP 3: Open Razorpay modal
      const options = {
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:      orderData.amount,
        currency:    orderData.currency,
        order_id:    orderData.order_id,      // ← from server
        name:        'R-R-Organic',
        description: 'Fresh Organic Produce',
        image:       '/logo.png',             // optional — add your logo to /public/
        prefill: {
          name:    form.name,
          contact: form.phone,
          email:   form.email || user?.email || '',
        },
        theme: { color: '#2d5016' },
        config: { display: { blocks: { utib: { name: 'Pay via UPI', instruments: [{ method: 'upi', flows: ['collect', 'intent', 'qr'] }] }, other: { name: 'Cards & Net Banking', instruments: [{ method: 'card' }, { method: 'netbanking' }, { method: 'wallet' }] } }, sequence: ['block.utib', 'block.other'], preferences: { show_default_blocks: false } } },

        // STEP 4: Handle success
        handler: async function(response) {
          try {
            // Verify signature on backend first
            const verifyRes = await fetch('/api/verify-payment', {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body:    JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
              }),
            })
            const verifyData = await verifyRes.json()
            if (!verifyRes.ok) throw new Error(verifyData.error)

            // Save order to Supabase
            const orderSaveRes = await fetch('/api/orders', {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body:    JSON.stringify({
                items, total, form,
                userId:            user?.id,
                razorpayOrderId:   response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            })
            const orderSaveData = await orderSaveRes.json()
            if (!orderSaveRes.ok) throw new Error(orderSaveData.error || 'Order save failed')

            clearCart()
            router.push('/orders?success=true')
          } catch(e) {
            setError('Payment received but order save failed. Please contact us with payment ID: ' + response.razorpay_payment_id)
            setLoading(false)
          }
        },

        // Handle modal close (user cancelled)
        modal: {
          ondismiss: () => {
            setError('Payment cancelled. Your cart is still saved.')
            setLoading(false)
          }
        },
      }

      const rzp = new window.Razorpay(options)

      // Handle payment failure inside modal
      rzp.on('payment.failed', function(response) {
        setError(`Payment failed: ${response.error.description}. Please try again.`)
        setLoading(false)
      })

      rzp.open()

    } catch(e) {
      console.error('Checkout error:', e)
      setError(e.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (items.length === 0) return (
    <div style={{ textAlign:'center', padding:'80px 28px' }}>
      <div style={{ fontSize:48, marginBottom:16 }}>🛒</div>
      <h2 style={{ fontFamily:'Playfair Display,serif', marginBottom:12 }}>Your cart is empty</h2>
      <Link href="/products" style={{ color:'#2d5016', fontWeight:500 }}>Browse products →</Link>
    </div>
  )

  return (
    <div style={{ maxWidth:860, margin:'0 auto', padding:'40px 28px' }}>
      <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:32, marginBottom:32 }}>Checkout</h1>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:32, alignItems:'start' }}>

        {/* Delivery form */}
        <div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:20, marginBottom:4 }}>Delivery details</h2>
          {!user && (
            <p style={{ fontSize:13, color:'#6b6b60', marginBottom:20 }}>
              <Link href="/account" style={{ color:'#2d5016', fontWeight:500 }}>Sign in</Link> to auto-fill your saved address
            </p>
          )}
          {user && profile?.full_name && (
            <p style={{ fontSize:13, color:'#4a7c2f', marginBottom:20 }}>✓ Pre-filled from your saved profile</p>
          )}

          {[
            { key:'name',    label:'Full name',        type:'text', placeholder:'Your full name',      required:true },
            { key:'email',   label:'Email',            type:'email', placeholder:'you@example.com',     required:true },
            { key:'phone',   label:'WhatsApp / Phone', type:'tel',  placeholder:'+91 9876543210',      required:true },
            { key:'address', label:'Full address',     type:'text', placeholder:'House no, street, area', required:true },
            { key:'city',    label:'City',             type:'text', placeholder:'Panvel',               required:false },
            { key:'pincode', label:'Pincode',          type:'text', placeholder:'410206',               required:true },
          ].map(f => (
            <div key={f.key} style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:500, color:'#6b6b60', marginBottom:5 }}>
                {f.label} {f.required && <span style={{ color:'#e24b4a' }}>*</span>}
              </label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={e => updateForm(f.key, e.target.value)}
                placeholder={f.placeholder}
                style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1px solid rgba(0,0,0,0.15)', fontSize:14, background:'#fff', outline:'none' }}
              />
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div style={{ background:'#fff', borderRadius:16, border:'1px solid rgba(0,0,0,0.08)', padding:24, position:'sticky', top:90 }}>
          <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:18, margin:'0 0 16px' }}>Order summary</h3>

          {items.map(item => (
            <div key={item.id} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #f0f0f0', fontSize:13 }}>
              <span style={{ color:'#1c1c1a' }}>{item.name} x{item.qty}</span>
              <span style={{ fontWeight:500 }}>₹{Number(item.price) * item.qty}</span>
            </div>
          ))}

          <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', fontSize:13, color:'#6b6b60' }}>
            <span>Delivery</span>
            <span style={{ color:'#4a7c2f', fontWeight:500 }}>Free</span>
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, paddingTop:12, borderTop:'2px solid #2d5016' }}>
            <span style={{ fontWeight:600, fontSize:15 }}>Total</span>
            <span style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, color:'#2d5016' }}>₹{total}</span>
          </div>

          {error && (
            <div style={{ marginTop:12, padding:'10px 14px', background:'#fde8e8', borderRadius:8, fontSize:13, color:'#a32d2d', lineHeight:1.5 }}>
              {error}
            </div>
          )}

          <button onClick={handleCheckout} disabled={loading} style={{
            width:'100%', marginTop:16, background: loading ? '#6b9e52' : '#2d5016',
            color:'#fff', border:'none', borderRadius:999,
            padding:'14px', fontSize:15, fontWeight:600,
            cursor: loading ? 'not-allowed' : 'pointer', transition:'background .2s',
          }}>
            {loading ? '⏳ Opening payment...' : `Pay ₹${total} securely`}
          </button>

          <div style={{ textAlign:'center', marginTop:10, fontSize:11, color:'#aaa' }}>
            🔒 Secured by Razorpay · UPI · Cards · Net Banking
          </div>
        </div>
      </div>
    </div>
  )
}
