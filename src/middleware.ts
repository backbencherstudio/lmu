import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')
  const isAdminLoginPage = request.nextUrl.pathname.startsWith('/admin-login')
  const token = request.cookies.get('token')?.value

  // If trying to access dashboard without token, redirect to login
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL('/admin-login', request.url))
  }

  // If trying to access login page with token, redirect to dashboard
  if (isAdminLoginPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin-login/:path*']
} 