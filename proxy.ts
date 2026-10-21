import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/register']

/**
 * Optimistic gate: pages need a session cookie, otherwise go sign in.
 * The real check (is the session valid? may this user see this?) happens in
 * the API routes — this only saves a round trip to an empty page.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(`${p}/`))) return NextResponse.next()
  if (request.cookies.has('os_session')) return NextResponse.next()

  const url = new URL('/login', request.url)
  if (pathname !== '/') url.searchParams.set('next', pathname + search)
  return NextResponse.redirect(url)
}

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
}
