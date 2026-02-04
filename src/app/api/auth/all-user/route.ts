import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(_req: NextRequest) {
  try {
    // Obtener todos los usuarios (excluyendo contraseñas)
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

    // Generar un token para cada usuario
    const usersWithTokens = users.map(user => {
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
    });

    return NextResponse.json(usersWithTokens, { status: 200 });
    
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}