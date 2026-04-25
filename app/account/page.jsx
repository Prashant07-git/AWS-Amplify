'use client'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const router = useRouter()
  const [mode,    setMode]    = useState('login')   // login | signup
  const [email,   setEmail]   = useState('')
  const [password,setPassword]= useState('')
  const [name,    setName]    = useState('')
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser(data.user)
    })
  }, [])

  async function handleAuth() {
    setLoading(true); setMessage('')
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setMessage(error.message); setLoading(false); return }
      router.push('/')
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } },
      })
      if (error) { setMessage(error.message); setLoading(false); return }
      setMessage('Check your email to confirm your account!')
    }
    setLoading(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (user) return (
    <div style={{ maxWidth:480, margin:'80px auto', padding:'0 28px' }}>
      <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:28, marginBottom:8 }}>
        Welcome back
      </h1>
      <p style={{ color:'#6b6b60', marginBottom:28 }}>{user.email}</p>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <a href="/orders" style={{
          display:'block', padding:'12px 20px', background:'#e8f0df',
          color:'#2d5016', borderRadius:10, fontWeight:500, textDecoration:'none',
        }}>View my orders</a>
        <button onClick={handleSignOut} style={{
          padding:'12px 20px', background:'#fff', color:'#6b6b60',
          border:'1px solid rgba(0,0,0,0.12)', borderRadius:10, cursor:'pointer',
          fontWeight:500, textAlign:'left',
        }}>Sign out</button>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth:400, margin:'80px auto', padding:'0 28px' }}>
      <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:28, marginBottom:4 }}>
        {mode === 'login' ? 'Sign in' : 'Create account'}
      </h1>
      <p style={{ color:'#6b6b60', fontSize:14, marginBottom:28 }}>
        {mode === 'login' ? 'Welcome back to R-R-Organic' : 'Join R-R-Organic for faster checkout'}
      </p>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {mode === 'signup' && (
          <div>
            <label style={{ fontSize:13, fontWeight:500, color:'#6b6b60', display:'block', marginBottom:5 }}>Full name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
              style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1px solid rgba(0,0,0,0.15)', fontSize:14, outline:'none' }} />
          </div>
        )}
        <div>
          <label style={{ fontSize:13, fontWeight:500, color:'#6b6b60', display:'block', marginBottom:5 }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
            style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1px solid rgba(0,0,0,0.15)', fontSize:14, outline:'none' }} />
        </div>
        <div>
          <label style={{ fontSize:13, fontWeight:500, color:'#6b6b60', display:'block', marginBottom:5 }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
            style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1px solid rgba(0,0,0,0.15)', fontSize:14, outline:'none' }} />
        </div>

        {message && <p style={{ fontSize:13, color: message.includes('Check') ? '#4a7c2f' : '#e24b4a' }}>{message}</p>}

        <button onClick={handleAuth} disabled={loading} style={{
          background:'#2d5016', color:'#fff', border:'none', borderRadius:999,
          padding:'13px', fontSize:15, fontWeight:600, cursor:'pointer', marginTop:4,
        }}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>

        <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} style={{
          background:'none', border:'none', color:'#2d5016', fontSize:13,
          cursor:'pointer', fontWeight:500,
        }}>
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
