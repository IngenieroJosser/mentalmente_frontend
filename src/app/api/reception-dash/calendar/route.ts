import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu-clave-segura-aqui';

// Definir tipo para el token decodificado
interface DecodedToken {
  userId: number;
  usuario: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

// Función para verificar el token JWT
function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch {
    return null;
  }
}

// Función para extraer el token del header
function getTokenFromHeader(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación via JWT
    const token = getTokenFromHeader(request);
    if (!token) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 });
    }

    // Obtener usuario de recepción
    const receptionUser = await prisma.user.findUnique({
      where: { 
        id: decoded.userId 
      },
      select: { 
        id: true,
        usuario: true,
        role: true
      }
    });

    if (!receptionUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar que el usuario sea de recepción
    if (receptionUser.role !== 'USER') {
      return NextResponse.json({ error: 'No autorizado - Rol incorrecto' }, { status: 403 });
    }

    // Obtener parámetros de fecha
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    // Validar y establecer fechas
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const targetMonth = month ? parseInt(month) - 1 : currentMonth;
    const targetYear = year ? parseInt(year) : currentYear;

    // Validar que los parámetros sean números válidos
    if (isNaN(targetMonth) || targetMonth < 0 || targetMonth > 11) {
      return NextResponse.json({ error: 'Mes inválido' }, { status: 400 });
    }
    if (isNaN(targetYear) || targetYear < 2000 || targetYear > 2100) {
      return NextResponse.json({ error: 'Año inválido' }, { status: 400 });
    }

    // Fechas de inicio y fin del mes
    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0);
    endDate.setHours(23, 59, 59, 999); // Hasta el final del día

    // Obtener historias clínicas de todos los psicólogos
    const medicalRecords = await prisma.medicalRecord.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        id: true,
        patientName: true,
        identificationType: true,
        identificationNumber: true,
        birthDate: true,
        age: true,
        consultationReason: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            usuario: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Formatear datos para el frontend
    const formattedRecords = medicalRecords.map(record => ({
      id: record.id,
      title: record.consultationReason || 'Consulta psicológica',
      date: record.createdAt,
      patientName: record.patientName,
      identificationType: record.identificationType,
      identificationNumber: record.identificationNumber,
      birthDate: record.birthDate,
      age: record.age,
      updatedAt: record.updatedAt,
      psychologist: record.user ? {
        id: record.user.id,
        name: record.user.usuario,
        role: record.user.role
      } : null
    }));

    return NextResponse.json({
      success: true,
      data: formattedRecords,
      user: {
        id: receptionUser.id,
        name: receptionUser.usuario,
        role: receptionUser.role
      },
      month: targetMonth + 1,
      year: targetYear,
      total: formattedRecords.length,
      filteredBy: 'all' // Indica que se muestran todas las historias
    });

  } catch (error) {
    console.error('Error fetching calendar data for reception:', error);
    
    // Manejar errores específicos de Prisma
    if (error instanceof Error && error.message.includes('Prisma')) {
      return NextResponse.json(
        { error: 'Error en la base de datos' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// También podrías agregar un endpoint para obtener solo las historias asignadas a un psicólogo específico
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación via JWT
    const token = getTokenFromHeader(request);
    if (!token) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 });
    }

    // Obtener usuario de recepción
    const receptionUser = await prisma.user.findUnique({
      where: { 
        id: decoded.userId 
      },
      select: { 
        id: true,
        usuario: true,
        role: true
      }
    });

    if (!receptionUser || receptionUser.role !== 'USER') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const { psychologistId } = body;

    if (!psychologistId) {
      return NextResponse.json({ error: 'ID de psicólogo requerido' }, { status: 400 });
    }

    // Obtener historias clínicas de un psicólogo específico
    const medicalRecords = await prisma.medicalRecord.findMany({
      where: {
        userId: parseInt(psychologistId)
      },
      select: {
        id: true,
        patientName: true,
        identificationType: true,
        identificationNumber: true,
        birthDate: true,
        age: true,
        consultationReason: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            usuario: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limitar a 50 registros
    });

    return NextResponse.json({
      success: true,
      data: medicalRecords,
      psychologistId
    });

  } catch (error) {
    console.error('Error filtering by psychologist:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}