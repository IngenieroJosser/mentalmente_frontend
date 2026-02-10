import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/login', '/register', '/api/auth/login', '/api/auth/register'];
  
  // Si es una ruta pública, permitir acceso
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Para otras rutas, el frontend manejará la autenticación
  // El middleware solo redirige si intenta acceder directamente
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Proteger solo las rutas de dashboard
    '/dashboard/:path*',
    '/psychologist-dashboard/:path*',
    '/management-dashboard/:path*',
    '/reception-dashboard/:path*',
  ]
};