'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const STATUS_OPTIONS = ['pending','paid','processing','dispatched','delivered','cancelled']
const STATUS_COLORS  = {
  pending:    '#856404', paid:'#2d5016', processing:'#2d5016',
  dispatched: '#185fa5', delivered:'#2d5016', cancelled:'#a32d2d',
}

export default function AdminPage() {
  const [tab,      setTab]      = useState('orders')
  const [orders,   setOrders]   = useState([])
  const [products, setProducts] = useState([])
  const [cats,     setCats]     = useState([])
  const [loading,  setLoading]  = useState(true)
  const [newProd,  setNewProd]  = useState({ name:'', slug:'', description:'', price:'', unit:'', stock:'', category_id:'' })

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    const [{ data: o }, { data: p }, { data: c }] = await Promise.all([
      supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending:false }),
      supabase.from('products').select('*, categories(name)').order('created_at', { ascending:false }),
      supabase.from('categories').select('*'),
    ])
    setOrders(o || [])
    setProducts(p || [])
    setCats(c || [])
    setLoading(false)
  }

  async function updateOrderStatus(orderId, status) {
    await supabase.from('orders').update({ status }).eq('id', orderId)
    setOrders(os => os.map(o => o.id === orderId ? { ...o, status } : o))
  }

  async function toggleProduct(id, field, val) {
    await supabase.from('products').update({ [field]: val }).eq('id', id)
    setProducts(ps => ps.map(p => p.id === id ? { ...p, [field]: val } : p))
  }

  async function addProduct() {
    if (!newProd.name || !newProd.price) return
    const slug = newProd.name.toLowerCase().replace(/\s+/g, '-')
    const { data } = await supabase.from('products').insert({ ...newProd, slug, price: parseFloat(newProd.price), stock: parseInt(newProd.stock) || 0 }).select('*, categories(name)').single()
    if (data) { setProducts(ps => [data, ...ps]); setNewProd({ name:'', slug:'', description:'', price:'', unit:'', stock:'', category_id:'' }) }
  }

  const inputStyle = {
    padding:'8px 10px', borderRadius:8, border:'1px solid rgba(0,0,0,0.12)',
    fontSize:13, background:'#fff', outline:'none', width:'100%',
  }
  const thStyle = { textAlign:'left', fontSize:11, fontWeight:600, color:'#6b6b60', letterSpacing:'0.06em', textTransform:'uppercase', padding:'8px 12px', borderBottom:'1px solid rgba(0,0,0,0.08)' }
  const tdStyle = { padding:'10px 12px', fontSize:13, borderBottom:'1px solid rgba(0,0,0,0.05)', verticalAlign:'middle' }

  return (
    <div className="admin-page" style={{ maxWidth:1100, margin:'0 auto', padding:'32px 28px' }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:30, margin:'0 0 4px' }}>Admin Dashboard</h1>
        <p style={{ fontSize:13, color:'#6b6b60' }}>Manage your farm store</p>
      </div>

      {/* Tabs */}
      <div className="admin-tabs" style={{ display:'flex', gap:4, marginBottom:24, borderBottom:'1px solid rgba(0,0,0,0.08)' }}>
        {['orders','products','add product'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:'10px 20px', background:'none', border:'none',
            borderBottom: tab === t ? '2px solid #2d5016' : '2px solid transparent',
            color: tab === t ? '#2d5016' : '#6b6b60', fontWeight:500,
            fontSize:14, cursor:'pointer', textTransform:'capitalize', transition:'all .15s',
            marginBottom:-1,
          }}>{t}</button>
        ))}
      </div>

      {loading ? <p style={{ color:'#6b6b60' }}>Loading...</p> : (
        <>
          {/* ORDERS TAB */}
          {tab === 'orders' && (
            <div>
              <div className="admin-stats" style={{ display:'flex', gap:16, marginBottom:20, flexWrap:'wrap' }}>
                {['pending','paid','processing','dispatched','delivered'].map(s => {
                  const count = orders.filter(o => o.status === s).length
                  return (
                    <div key={s} style={{ background:'#fff', borderRadius:10, border:'1px solid rgba(0,0,0,0.08)', padding:'12px 18px', minWidth:100 }}>
                      <div style={{ fontSize:22, fontWeight:700, color:'#2d5016', fontFamily:'Playfair Display,serif' }}>{count}</div>
                      <div style={{ fontSize:11, color:'#6b6b60', textTransform:'capitalize' }}>{s}</div>
                    </div>
                  )
                })}
              </div>
              <div className="table-scroll-card" style={{ background:'#fff', borderRadius:14, border:'1px solid rgba(0,0,0,0.08)', overflow:'hidden' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr>
                      {['Order','Date','Customer','Items','Total','Status','Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td style={tdStyle}><code style={{ fontSize:12 }}>#{order.id.slice(0,8).toUpperCase()}</code></td>
                        <td style={tdStyle}>{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                        <td style={tdStyle}>
                          <div style={{ fontWeight:500 }}>{order.phone}</div>
                          <div style={{ fontSize:11, color:'#6b6b60' }}>{order.city}</div>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ fontSize:12, color:'#6b6b60', maxWidth:200 }}>
                            {order.order_items?.map(i => `${i.name}x${i.qty}`).join(', ')}
                          </div>
                        </td>
                        <td style={tdStyle}><strong>Rs.{order.total}</strong></td>
                        <td style={tdStyle}>
                          <span style={{
                            background: STATUS_COLORS[order.status] + '22',
                            color: STATUS_COLORS[order.status],
                            fontSize:11, fontWeight:600, padding:'3px 8px', borderRadius:999,
                            textTransform:'capitalize',
                          }}>{order.status}</span>
                        </td>
                        <td style={tdStyle}>
                          <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value)}
                            style={{ ...inputStyle, width:'auto', padding:'5px 8px' }}>
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {tab === 'products' && (
            <div className="table-scroll-card" style={{ background:'#fff', borderRadius:14, border:'1px solid rgba(0,0,0,0.08)', overflow:'hidden' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>{['Product','Category','Price','Stock','Active','Featured'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td style={tdStyle}>
                        <div style={{ fontWeight:500 }}>{p.name}</div>
                        <div style={{ fontSize:11, color:'#6b6b60' }}>{p.unit}</div>
                      </td>
                      <td style={tdStyle}><span style={{ fontSize:12, color:'#6b6b60' }}>{p.categories?.name}</span></td>
                      <td style={tdStyle}><strong>Rs.{p.price}</strong></td>
                      <td style={tdStyle}>
                        <span style={{ color: p.stock < 5 ? '#e24b4a' : '#2d5016', fontWeight:500 }}>{p.stock}</span>
                      </td>
                      <td style={tdStyle}>
                        <input type="checkbox" checked={p.is_active} onChange={e => toggleProduct(p.id, 'is_active', e.target.checked)} />
                      </td>
                      <td style={tdStyle}>
                        <input type="checkbox" checked={p.is_featured} onChange={e => toggleProduct(p.id, 'is_featured', e.target.checked)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ADD PRODUCT TAB */}
          {tab === 'add product' && (
            <div className="admin-form-card" style={{ background:'#fff', borderRadius:14, border:'1px solid rgba(0,0,0,0.08)', padding:28, maxWidth:560 }}>
              <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:22, margin:'0 0 20px' }}>Add new product</h2>
              <div className="admin-form-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {[
                  { key:'name',        label:'Product name',   placeholder:'e.g. Fresh Spinach' },
                  { key:'price',       label:'Price (Rs.)',    placeholder:'e.g. 45',    type:'number' },
                  { key:'unit',        label:'Unit',          placeholder:'e.g. per 500g' },
                  { key:'stock',       label:'Stock qty',     placeholder:'e.g. 50',    type:'number' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize:12, fontWeight:500, color:'#6b6b60', display:'block', marginBottom:5 }}>{f.label}</label>
                    <input type={f.type || 'text'} value={newProd[f.key]} onChange={e => setNewProd(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder} style={inputStyle} />
                  </div>
                ))}
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ fontSize:12, fontWeight:500, color:'#6b6b60', display:'block', marginBottom:5 }}>Category</label>
                  <select value={newProd.category_id} onChange={e => setNewProd(p => ({ ...p, category_id: e.target.value }))}
                    style={{ ...inputStyle }}>
                    <option value="">Select category</option>
                    {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ fontSize:12, fontWeight:500, color:'#6b6b60', display:'block', marginBottom:5 }}>Description</label>
                  <textarea value={newProd.description} onChange={e => setNewProd(p => ({ ...p, description: e.target.value }))}
                    placeholder="Describe this product..." rows={3}
                    style={{ ...inputStyle, resize:'vertical' }} />
                </div>
              </div>
              <button onClick={addProduct} style={{
                marginTop:20, background:'#2d5016', color:'#fff', border:'none',
                borderRadius:999, padding:'12px 28px', fontSize:14, fontWeight:600, cursor:'pointer',
              }}>
                Add product
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
