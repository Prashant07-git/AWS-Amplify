'use client'

import { useState } from 'react'

const CONTACT_PHONE = '9082727526'
const CONTACT_EMAIL = 'prashantvasukar@gmail.com'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function updateForm(key, value) {
    setForm(current => ({ ...current, [key]: value }))
  }

  async function sendMessage(event) {
    event.preventDefault()
    setError('')
    setStatus('')
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Could not send message.')
      }

      setStatus('Message sent. We will get back to you shortly.')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setError(err.message || 'Could not send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 10,
    border: '1px solid rgba(0,0,0,0.14)',
    fontSize: 14,
    background: '#fff',
    outline: 'none',
  }

  return (
    <div className="contact-page" style={{ maxWidth: 960, margin: '0 auto', padding: '44px 28px 64px' }}>
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 36, margin: '0 0 8px' }}>
          Contact Us
        </h1>
        <p style={{ color: '#6b6b60', fontSize: 15, maxWidth: 560, lineHeight: 1.7 }}>
          Have a question about produce, delivery, or an order? Send a message and the farm team will respond soon.
        </p>
      </div>

      <div className="contact-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 28, alignItems: 'start' }}>
        <form onSubmit={sendMessage} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: 24 }}>
          <div className="contact-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#6b6b60', marginBottom: 6 }}>
                Full name *
              </label>
              <input value={form.name} onChange={e => updateForm('name', e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#6b6b60', marginBottom: 6 }}>
                Email *
              </label>
              <input type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#6b6b60', marginBottom: 6 }}>
                WhatsApp / Phone
              </label>
              <input value={form.phone} onChange={e => updateForm('phone', e.target.value)} style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#6b6b60', marginBottom: 6 }}>
                Message *
              </label>
              <textarea
                value={form.message}
                onChange={e => updateForm('message', e.target.value)}
                required
                rows={6}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
              />
            </div>
          </div>

          {status && (
            <div style={{ marginTop: 16, padding: '11px 14px', borderRadius: 10, background: '#e8f0df', color: '#2d5016', fontSize: 13 }}>
              {status}
            </div>
          )}
          {error && (
            <div style={{ marginTop: 16, padding: '11px 14px', borderRadius: 10, background: '#fde8e8', color: '#a32d2d', fontSize: 13 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 18,
              background: loading ? '#6b9e52' : '#2d5016',
              color: '#fff',
              border: 'none',
              borderRadius: 999,
              padding: '12px 26px',
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Sending...' : 'Send message'}
          </button>
        </form>

        <div style={{ background: '#f5ede3', borderRadius: 14, padding: 22, color: '#1c1c1a' }}>
          <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, margin: '0 0 14px' }}>
            Farm Support
          </h2>
          <p style={{ fontSize: 13, color: '#6b6b60', lineHeight: 1.7, margin: '0 0 18px' }}>
            For delivery updates, include your order number or registered phone number in the message.
          </p>
          <div style={{ fontSize: 13, lineHeight: 1.9 }}>
            <div><strong>Phone:</strong> <a href={`tel:+91${CONTACT_PHONE}`} style={{ color: '#2d5016', fontWeight: 600 }}>{CONTACT_PHONE}</a></div>
            <div><strong>Email:</strong> <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#2d5016', fontWeight: 600 }}>{CONTACT_EMAIL}</a></div>
            <div><strong>Location:</strong> Amravati, Maharashtra</div>
            <div><strong>Delivery:</strong> Farm-fresh local orders</div>
            <div><strong>Response:</strong> Within 24 hours</div>
          </div>
        </div>
      </div>
    </div>
  )
}
