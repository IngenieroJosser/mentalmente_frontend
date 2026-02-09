import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';

// Roles permitidos para validación
const ALLOWED_ROLES = ['USER', 'MANAGEMENT', 'PSYCHOLOGIST'];
const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-seguro-aqui';

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
    if (!usuario || !correo || !contrasena || !role) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Todos los campos requeridos son obligatorios',
          details: 'Faltan: usuario, correo, contraseña o rol'
        },
        { status: 400 }
      );
    }

    // Validar rol permitido
    const upperRole = role.toUpperCase() as Role;
    if (!ALLOWED_ROLES.includes(upperRole)) {
      return NextResponse.json(
        { 
          success: false,
          message: `Rol inválido. Valores permitidos: ${ALLOWED_ROLES.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Formato de correo inválido' 
        },
        { status: 400 }
      );
    }

    // Validar longitud de contraseña
    if (contrasena.length < 6) {
      return NextResponse.json(
        { 
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres' 
        },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe por correo (usando findUnique ya que correo es único)
    const existingUserByEmail = await prisma.user.findUnique({
      where: { correo },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { 
          success: false,
          message: 'El correo ya está registrado' 
        },
        { status: 400 }
      );
    }

    // Verificar si el nombre de usuario ya existe (usando findFirst ya que usuario NO es único)
    const existingUserByUsername = await prisma.user.findFirst({
      where: { usuario },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { 
          success: false,
          message: 'El nombre de usuario ya está en uso' 
        },
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
        genero: genero || null,
        contrasena: hashedPassword,
        role: upperRole,
      },
    });

    // Generar token JWT
    const token = jwt.sign(
      {
        userId: newUser.id,
        usuario: newUser.usuario,
        correo: newUser.correo,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Crear objeto de usuario sin la contraseña
    const userWithoutPassword = {
      id: newUser.id,
      usuario: newUser.usuario,
      correo: newUser.correo,
      genero: newUser.genero,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Usuario registrado exitosamente',
        user: userWithoutPassword,
        token: token,
      },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('Error en el registro:', error);
    
    let errorMessage = 'Error interno del servidor';
    let statusCode = 500;

    // Manejar errores específicos de Prisma
    if (error.code === 'P2002') {
      if (error.meta?.target?.includes('correo')) {
        errorMessage = 'El correo electrónico ya está registrado';
        statusCode = 400;
      } else if (error.meta?.target?.includes('usuario')) {
        errorMessage = 'El nombre de usuario ya está en uso';
        statusCode = 400;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { 
        success: false,
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    );
  }
}

export async function GET() {
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

    // Verificar si el correo ya está en uso por otro usuario
    const existingUserByEmail = await prisma.user.findFirst({
      where: {
        correo,
        NOT: { id: parseInt(id) }
      }
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'El correo ya está registrado por otro usuario' },
        { status: 400 }
      );
    }

    // Verificar si el nombre de usuario ya está en uso por otro usuario
    const existingUserByUsername = await prisma.user.findFirst({
      where: {
        usuario,
        NOT: { id: parseInt(id) }
      }
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { error: 'El nombre de usuario ya está en uso por otro usuario' },
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
        contrasena: updateData.contrasena ? updateData.contrasena : undefined
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
  } catch (error: any) {
    console.error('Error al actualizar usuario:', error);
    
    let errorMessage = 'Error interno del servidor';
    let statusCode = 500;

    if (error.code === 'P2002') {
      if (error.meta?.target?.includes('correo')) {
        errorMessage = 'El correo electrónico ya está registrado';
        statusCode = 400;
      } else if (error.meta?.target?.includes('usuario')) {
        errorMessage = 'El nombre de usuario ya está en uso';
        statusCode = 400;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
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