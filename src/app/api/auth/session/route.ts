import { NextRequest, NextResponse } from 'next/server';
import { User } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // En una implementación real, aquí validarías el token JWT
    // Para este ejemplo, simplemente devolvemos el usuario del localStorage
    
    return NextResponse.json({
      message: 'Sesión válida',
      user: JSON.parse(token) // Simulamos el token como el objeto de usuario
    }, { status: 200 });

  } catch (error) {
    console.error('Error verificando sesión:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}