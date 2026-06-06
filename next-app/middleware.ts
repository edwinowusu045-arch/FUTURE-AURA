import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimitMap = new Map<string, { count: number; lastRequest: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 30 // 30 requests per minute

const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https:; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none';",
  'X-XSS-Protection': '1; mode=block',
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://future-aura.netlify.app',
    'https://aura.ai',
    'https://www.aura.ai',
    process.env.NEXT_PUBLIC_FRONTEND_URL,
  ].filter(Boolean)

  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(JSON.stringify({ error: 'CORS Not Allowed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || request.ip || 'anonymous'
    const now = Date.now()
    const record = rateLimitMap.get(ip) || { count: 0, lastRequest: now }

    if (now - record.lastRequest > RATE_LIMIT_WINDOW) {
      record.count = 1
      record.lastRequest = now
    } else {
      record.count++
    }

    record.lastRequest = now
    rateLimitMap.set(ip, record)

    if (record.count > MAX_REQUESTS) {
      return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  const response = NextResponse.next()
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: ['/api/:path*', '/auth/:path*', '/dashboard/:path*', '/data-room/:path*', '/insights/:path*'],
}
