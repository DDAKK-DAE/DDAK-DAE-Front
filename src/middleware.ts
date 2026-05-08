import { type NextRequest, NextResponse } from 'next/server';

// 인증이 필요한 경로 패턴
// 현재 토큰은 localStorage에 저장 → 미들웨어에서 직접 검증 불가.
// 추후 accessToken을 HttpOnly 쿠키로 전환하면 아래 로직에서 실제 검증 가능.
const PROTECTED_PATHS = ['/crews', '/challenges/new', '/me'];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  // TODO: 쿠키 기반 토큰 도입 시 여기서 실제 검증
  // const token = request.cookies.get('accessToken')?.value;
  // if (!token) { return NextResponse.redirect(new URL('/login', request.url)); }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // _next, 정적 파일, API 라우트는 제외
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
