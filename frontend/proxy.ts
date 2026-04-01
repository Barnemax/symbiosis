import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)
const localeSegment = new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`)

export default async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl
  const normalizedPath = pathname.replace(localeSegment, '')

  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  if (normalizedPath.startsWith('/admin')) {
    if (normalizedPath === '/admin/login') {
      return NextResponse.next()
    }
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.next()
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)', '/admin/:path*'],
}
