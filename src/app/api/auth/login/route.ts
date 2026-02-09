import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Clave secreta para firmar los tokens JWT
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_segura_aqui';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operaciones de autenticación
 * 
 * components:
 *   schemas:
 *     UserWithToken:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         usuario:
 *           type: string
 *           example: "Josss"
 *         correo:
 *           type: string
 *           example: "usuario@mentalmente.com"
 *         genero:
 *           type: string
 *           example: "Masculino"
 *         role:
 *           type: string
 *           example: "PSYCHOLOGIST"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-06-15T14:30:00Z"
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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
 * /api/auth/all-user:
 *   get:
 *     summary: Obtener todos los usuarios con sus tokens
 *     description: Devuelve la lista completa de usuarios registrados en el sistema con sus tokens JWT
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserWithToken'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export async function GET() {
  try {
    // Validar que Prisma esté inicializado
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database connection not initialized' },
        { status: 500 }
      );
    }

    // Obtener todos los usuarios con manejo de errores
    const users = await prisma.user.findMany({
      select: {
        id: true,
        usuario: true,
        correo: true,
        genero: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Validar que se obtuvieron usuarios
    if (!users || users.length === 0) {
      return NextResponse.json(
        { users: [], message: 'No users found' },
        { status: 200 }
      );
    }

    // Generar tokens de manera segura
    const usersWithTokens = users.map(user => {
      try {
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
        
        return {
          ...user,
          token
        };
      } catch (jwtError) {
        console.error('Error generating JWT:', jwtError);
        return {
          ...user,
          token: null,
          error: 'Failed to generate token'
        };
      }
    });

    // Responder con formato JSON válido
    return NextResponse.json({
      success: true,
      data: usersWithTokens,
      count: usersWithTokens.length,
      timestamp: new Date().toISOString()
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    
    // Respuesta de error estructurada
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validar campos requeridos
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email y contraseña son requeridos'
        },
        { status: 400 }
      );
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { correo: email }
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Credenciales inválidas'
        },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.contrasena);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Credenciales inválidas'
        },
        { status: 401 }
      );
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        usuario: user.usuario,
        correo: user.correo,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Preparar respuesta del usuario (sin contraseña)
    const userResponse = {
      id: user.id,
      usuario: user.usuario,
      correo: user.correo,
      genero: user.genero,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return NextResponse.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token: token,
      user: userResponse
    }, { status: 200 });

  } catch (error: any) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}