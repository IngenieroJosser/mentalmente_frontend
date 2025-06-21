import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Obtener psicólogo asociado al usuario
    const psychologist = await prisma.medicalRecord.findUnique({
      where: { id: session.user.id },
      select: { id: true }
    });

    if (!psychologist) {
      return NextResponse.json({ error: 'Psychologist not found' }, { status: 404 });
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

    // Fechas de inicio y fin del mes
    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0);
    endDate.setHours(23, 59, 59, 999); // Hasta el final del día

    // Obtener historias clínicas
    const medicalRecords = await prisma.medicalRecord.findMany({
      where: {
        userId: psychologist.id,
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
        createdAt: true
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
      age: record.age
    }));

    return NextResponse.json(formattedRecords);

  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}