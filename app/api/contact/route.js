import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const CONTACT_EMAIL = 'prashantvasukar@gmail.com'
const CONTACT_PHONE = '9082727526'

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
      return NextResponse.json({
        error: 'Contact email is not configured. Check RESEND_API_KEY and RESEND_FROM_EMAIL.',
      }, { status: 500 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL || CONTACT_EMAIL,
      replyTo: email,
      subject: `New contact message from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || 'Not provided'}`,
        `Store phone: ${CONTACT_PHONE}`,
        '',
        'Message:',
        message,
      ].join('\n'),
    })

    if (error) {
      return NextResponse.json({ error: error.message || 'Could not send message.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Could not send message. Please try again.' }, { status: 500 })
  }
}
