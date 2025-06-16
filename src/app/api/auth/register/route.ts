import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

// Roles permitidos para validación
const ALLOWED_ROLES = ['Psicologo', 'Administrador', 'Paciente'];

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Crea una nueva cuenta de usuario en el sistema con validaciones de seguridad
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *                 minLength: 3
 *                 example: "Josss"
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: "cordobarivasjoss@mentalmente.com"
 *               contrasena:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "passwordSegura123"
 *               genero:
 *                 type: string
 *                 example: "Masculino"
 *               role:
 *                 type: string
 *                 enum: [Psicologo, Administrador, Paciente] 
 *                 example: "Psicologo"
 *             required:
 *               - usuario
 *               - correo
 *               - contrasena
 *               - genero
 *               - role
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     usuario:
 *                       type: string
 *                     correo:
 *                       type: string
 *                     genero:
 *                       type: string
 *                     role:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: |
 *           Error en la solicitud. Posibles causas:
 *           - Campos requeridos faltantes
 *           - Formato de correo inválido
 *           - Contraseña menor a 6 caracteres
 *           - Rol no válido
 *           - Correo ya registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error interno del servidor
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { usuario, correo, contrasena, genero, role } = body;

    // Validación básica de campos requeridos
    if (!usuario || !correo || !contrasena || !genero || !role) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return NextResponse.json(
        { error: 'Formato de correo inválido' },
        { status: 400 }
      );
    }

    // Validar longitud de contraseña
    if (contrasena.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Validar rol permitido
    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json(
        { error: 'Rol de usuario inválido. Valores permitidos: ' + ALLOWED_ROLES.join(', ') },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { correo },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El correo ya está registrado' },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        usuario,
        correo,
        genero,
        contrasena: hashedPassword,
        role,
      },
    });

    // Eliminar la contraseña del objeto de respuesta
    const { contrasena: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: 'Usuario registrado exitosamente',
        user: userWithoutPassword,
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error en el registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}