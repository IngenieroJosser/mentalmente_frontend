import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicPath = path === '/login';
  const token = req.cookies.get('currentUser')?.value;

  // Redirigir si está autenticado e intenta acceder a login
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  // Redirigir a login si no está autenticado y accede a rutas protegidas
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login'
  ]
}; 