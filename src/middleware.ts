import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    if (pathname.startsWith('/api') && !pathname.startsWith('/api/auth') && !token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (pathname.startsWith('/dashboard') && !token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
  },
  {
    pages: {
      signIn: '/login',
    },
    callbacks: {
      authorized: () => true,
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/create-post/:path*', '/calendar/:path*', '/media-library/:path*', '/analytics/:path*', '/insights/:path*', '/settings/:path*', '/api/:path*'],
}
