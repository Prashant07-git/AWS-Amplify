import { NextResponse } from 'next/server'

export function middleware(request) {
  const maintenance = false // 🔴 turn ON/OFF here

  if (maintenance) {
    return NextResponse.rewrite(new URL('/static/maintenance.html', request.url))
  }

  return NextResponse.next()
}