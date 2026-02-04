import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

// Roles permitidos para validación
const ALLOWED_ROLES = ['USER', 'MANAGEMENT', 'PSYCHOLOGIST'];

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operaciones de autenticación y gestión de usuarios
 * 
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - usuario
 *         - correo
 *         - contrasena
 *         - genero
 *         - role
 *       properties:
 *         usuario:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           example: "Josss"
 *           description: Nombre de usuario único (3-50 caracteres)
 *         correo:
 *           type: string
 *           format: email
 *           example: "cordobarivasjoss@mentalmente.com"
 *           description: Correo electrónico válido
 *         contrasena:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: "cordobarivasjoss"
 *           description: Contraseña con al menos 6 caracteres
 *         genero:
 *           type: string
 *           enum: [Masculino, Femenino, Otro]
 *           example: "Masculino"
 *           description: Género del usuario
 *         role:
 *           type: string
 *           enum: [PSYCHOLOGIST, MANAGEMENT, USER]
 *           example: "PSYCHOLOGIST"
 *           description: Rol del usuario en el sistema
 * 
 *     RegisterSuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Usuario registrado exitosamente"
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             usuario:
 *               type: string
 *               example: "Josss"
 *             correo:
 *               type: string
 *               example: "cordobarivasjoss@mentalmente.com"
 *             genero:
 *               type: string
 *               example: "Masculino"
 *             role:
 *               type: string
 *               example: "PSYCHOLOGIST"
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: "2023-06-15T14:30:00Z"
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Mensaje de error descriptivo"
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: |
 *       Crea una nueva cuenta de usuario en el sistema con validaciones de seguridad.
 *       Se requiere información básica del usuario y una contraseña segura.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       description: Datos del usuario a registrar
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterSuccessResponse'
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               campos_requeridos:
 *                 value:
 *                   error: "Todos los campos son requeridos"
 *               formato_correo:
 *                 value:
 *                   error: "Formato de correo inválido"
 *               longitud_contrasena:
 *                 value:
 *                   error: "La contraseña debe tener al menos 6 caracteres"
 *               rol_invalido:
 *                 value:
 *                   error: "Rol de usuario inválido. Valores permitidos: PSYCHOLOGIST, MANAGEMENT, USER"
 *               correo_existente:
 *                 value:
 *                   error: "El correo ya está registrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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

    // Validar rol permitido
    const upperRole = role.toUpperCase();
    if (!ALLOWED_ROLES.includes(upperRole)) {
      return NextResponse.json(
        { 
          error: `Rol inválido. Valores permitidos: ${ALLOWED_ROLES.join(', ')}` 
        },
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

    // Verificar si el usuario ya existe por correo
    const existingUserByEmail = await prisma.user.findUnique({
      where: { correo },
    });

    if (existingUserByEmail) {
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
        role: upperRole,
      },
    });

    // Eliminar la contraseña del objeto de respuesta
    const { contrasena: unusedPassword, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: 'Usuario registrado exitosamente',
        user: userWithoutPassword,
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error en el registro:', error);
    
    // Manejar errores específicos de Prisma
    let errorMessage = 'Error interno del servidor';
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Manejar errores de restricción única
      if (error.message.includes('Unique constraint')) {
        if (error.message.includes('correo')) {
          return NextResponse.json(
            { error: 'El correo electrónico ya está registrado' },
            { status: 400 }
          );
        }
        if (error.message.includes('usuario')) {
          return NextResponse.json(
            { error: 'El nombre de usuario ya está en uso' },
            { status: 400 }
          );
        }
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(_req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        usuario: true,
        correo: true,
        genero: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ data: users });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de usuario es requerido' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { usuario, correo, genero, role, contrasena } = body;

    // Validaciones básicas
    if (!usuario || !correo || !genero || !role) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    interface UpdateData {
      usuario: string;
      correo: string;
      genero: string;
      role: string;
      contrasena?: string;
    }

    const updateData: UpdateData = {
      usuario,
      correo,
      genero,
      role: role.toUpperCase()
    };

    // Si se proporcionó una nueva contraseña
    if (contrasena && contrasena.length >= 6) {
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      updateData.contrasena = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        usuario: updateData.usuario,
        correo: updateData.correo,
        genero: updateData.genero,
        role: updateData.role as Role,
        contrasena: updateData.contrasena ? await bcrypt.hash(updateData.contrasena, 10) : undefined
      },
      select: {
        id: true,
        usuario: true,
        correo: true,
        genero: true,
        role: true,
        createdAt: true
      }
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID de usuario es requerido' },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}