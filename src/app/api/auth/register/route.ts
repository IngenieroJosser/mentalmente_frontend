import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

// Roles permitidos para validación
const ALLOWED_ROLES = ['Psicologo', 'Administrador', 'Paciente'];

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
 *           example: "passwordSegura123"
 *           description: Contraseña con al menos 6 caracteres
 *         genero:
 *           type: string
 *           enum: [Masculino, Femenino, Otro]
 *           example: "Masculino"
 *           description: Género del usuario
 *         role:
 *           type: string
 *           enum: [Psicologo, Administrador, Paciente]
 *           example: "Psicologo"
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
 *               example: "Psicologo"
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
 *                   error: "Rol de usuario inválido. Valores permitidos: Psicologo, Administrador, Paciente"
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