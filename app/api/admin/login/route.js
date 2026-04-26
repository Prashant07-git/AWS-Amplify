import { NextResponse } from 'next/server'
import {
  ADMIN_COOKIE_NAME,
  adminCookieOptions,
  createAdminToken,
  isAdminConfigured,
  verifyAdminCredentials,
} from '@/lib/admin-auth'

export async function POST(request) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json({ error: 'Admin login is not configured.' }, { status: 500 })
    }

    const { username, password } = await request.json()

    if (!verifyAdminCredentials(username, password)) {
      return NextResponse.json({ error: 'Invalid admin username or password.' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set(ADMIN_COOKIE_NAME, createAdminToken(username), adminCookieOptions())

    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Could not sign in.' }, { status: 500 })
  }
}
