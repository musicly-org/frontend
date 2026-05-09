import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  console.log(`[frontend] ${request.method} ${pathname}${search}`)

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
