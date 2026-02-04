import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// Clave secreta para firmar los tokens JWT
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operaciones de autenticación
 * 
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "usuario@mentalmente.com"
 *           description: Correo electrónico registrado
 *         password:
 *           type: string
 *           format: password
 *           example: "password123"
 *           description: Contraseña del usuario
 * 
 *     LoginSuccessResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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
 *               example: "usuario@mentalmente.com"
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
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica a un usuario con sus credenciales
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       description: Credenciales de acceso
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginSuccessResponse'
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
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               credenciales_invalidas:
 *                 value:
 *                   error: "Credenciales inválidas"
 *               usuario_no_encontrado:
 *                 value:
 *                   error: "Usuario no registrado"
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
    const { email, password } = body;

    // 1. Validación de campos requeridos
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // 2. Validación de formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de correo inválido' },
        { status: 400 }
      );
    }

    // 3. Buscar usuario por correo
    const user = await prisma.user.findUnique({
      where: { correo: email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no registrado' },
        { status: 401 }
      );
    }

    // 4. Comparar contraseña hasheada
    const passwordMatch = await bcrypt.compare(password, user.contrasena);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // 5. Generar token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        usuario: user.usuario,
        email: user.correo,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 6. Eliminar la contraseña del objeto de usuario
    const { contrasena: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        token,
        user: {
          id: userWithoutPassword.id,
          usuario: userWithoutPassword.usuario,
          correo: userWithoutPassword.correo,
          genero: userWithoutPassword.genero,
          role: userWithoutPassword.role,
          createdAt: userWithoutPassword.createdAt
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}