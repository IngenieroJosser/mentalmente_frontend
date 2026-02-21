import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/register', '/api/auth/login', '/api/auth/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Permitir siempre las rutas públicas
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Obtener el token de la cookie
  const token = request.cookies.get('sanatu_token')?.value;

  // Si no hay token, redirigir al login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    // Agregar el parámetro de retorno para volver después del login
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verificar el token JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'tu_clave_segura_aqui');
    await jwtVerify(token, secret);
    
    // Token válido, permitir acceso
    return NextResponse.next();
  } catch (error) {
    // Token inválido o expirado, redirigir a login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    // Proteger todas las rutas que empiecen con /dashboard, /psychologist-dashboard, etc.
    '/dashboard/:path*',
    '/psychologist-dashboard/:path*',
    '/management-dashboard/:path*',
    '/reception-dashboard/:path*',
    // También proteger la raíz si es necesario
    // '/',
  ]
};