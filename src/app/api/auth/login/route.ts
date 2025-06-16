import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validación básica
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Correo y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario incluyendo la relación con el profesional
    const user = await prisma.user.findUnique({
      where: { correo: email },
      include: {
        // profesional: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.contrasena);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Preparar datos de usuario para el frontend
    const userData = {
      id: user.id,
      nombre: user.usuario,
      correo: user.correo,
      genero: user.genero,
      rol: user.role,
      // especialidad: user.usuario?.especialidad || null,
    };

    return NextResponse.json({
      message: 'Inicio de sesión exitoso',
      token: 'token_simulado_para_jwt', // Reemplazar con JWT real
      user: userData
    }, { status: 200 });

  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}