import crypto from 'crypto'

export const ADMIN_COOKIE_NAME = 'harvestco_admin'
const SESSION_SECONDS = 60 * 60 * 12

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET
}

function timingSafeEqual(a, b) {
  const left = Buffer.from(String(a || ''))
  const right = Buffer.from(String(b || ''))

  if (left.length !== right.length) return false
  return crypto.timingSafeEqual(left, right)
}

function base64Url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function signPayload(payload) {
  const secret = getSessionSecret()
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is missing.')

  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64url')
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET)
}

export function verifyAdminCredentials(username, password) {
  const enteredUsername = String(username || '').trim()
  const enteredPassword = String(password || '').trim()
  const configuredUsername = String(process.env.ADMIN_USERNAME || '').trim()
  const configuredPassword = String(process.env.ADMIN_PASSWORD || '').trim()

  return (
    isAdminConfigured() &&
    timingSafeEqual(enteredUsername, configuredUsername) &&
    timingSafeEqual(enteredPassword, configuredPassword)
  )
}

export function createAdminToken(username) {
  const payload = base64Url(JSON.stringify({
    username,
    expiresAt: Date.now() + SESSION_SECONDS * 1000,
  }))
  const signature = signPayload(payload)

  return `${payload}.${signature}`
}

export function verifyAdminToken(token) {
  if (!token || !getSessionSecret()) return false

  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false

  const expected = signPayload(payload)
  if (!timingSafeEqual(signature, expected)) return false

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    return data.expiresAt > Date.now()
  } catch {
    return false
  }
}

export function isAdminRequest(request) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  return verifyAdminToken(token)
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_SECONDS,
  }
}
