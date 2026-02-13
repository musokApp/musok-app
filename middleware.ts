import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

// 보호된 라우트 정의
const protectedRoutes = [
  '/my-bookings',
  '/chat',
  '/profile',
  '/dashboard',
  '/bookings',
  '/schedule',
  '/revenue',
  '/reviews',
];

// 인증이 필요 없는 라우트 (로그인, 회원가입 등)
const authRoutes = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  // 인증 확인
  let user = null;
  if (token) {
    user = await verifyToken(token);
  }

  // 보호된 라우트 체크
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // 보호된 라우트인데 인증되지 않은 경우
  if (isProtectedRoute && !user) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 로그인/회원가입 페이지인데 이미 로그인된 경우
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
