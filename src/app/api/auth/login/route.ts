<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validar datos de entrada
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Correo y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario por correo
    const user = await prisma.user.findUnique({
      where: { correo: email }
    });

    // Verificar si el usuario existe
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar contraseña (comparación segura)
    const passwordMatch = await bcrypt.compare(password, user.contrasena);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Crear objeto de usuario sin contraseña
    const { contrasena, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Inicio de sesión exitoso',
      user: userWithoutPassword
    }, { status: 200 });

  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
=======
import { NextResponse } from 'next/server';
import { AuthController } from '@/controllers/auth/auth.controller';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const user = await AuthController.login({ email, password });

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: error.message ? 400 : 500 }
>>>>>>> 22c720a (Conectando el login al backend)
    );
  }
}