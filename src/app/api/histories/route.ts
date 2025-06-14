import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { MedicalRecord, Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const whereClause: Prisma.MedicalRecordWhereInput = {
      OR: [
        { patientName: { contains: search, mode: 'insensitive' } },
        { identificationNumber: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    }

    const [records, total] = await Promise.all([
      prisma.medicalRecord.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              usuario: true,
              correo: true,
            },
          },
        },
      }),
      prisma.medicalRecord.count({ where: whereClause }),
    ])

    return NextResponse.json({
      data: records,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error en GET /api/histories:', error)
    return NextResponse.json(
      { error: 'Error al obtener las historias clínicas' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const data: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'> = await req.json();

    // Validación mínima
    const { patientName, identificationNumber, userId } = data;
    if (!patientName || !identificationNumber || !userId) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: nombre, identificación o usuario.' },
        { status: 400 }
      );
    }

    const newRecord = await prisma.medicalRecord.create({
      data: {
        ...data,
        recordNumber: `HC-${Date.now()}`,
      },
    });

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/histories:', error);
    return NextResponse.json(
      { error: 'Error al crear la historia clínica' },
      { status: 500 }
    );
  }
}
