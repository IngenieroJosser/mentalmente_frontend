import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/type';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

/* ============================
   Tipos auxiliares
============================ */

interface SessionUser {
  id: number;
}

/* ============================
   GET — listar pacientes
============================ */

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get('page') ?? 1);
    const limit = Number(url.searchParams.get('limit') ?? 10);
    const search = url.searchParams.get('search') ?? '';
    const status = url.searchParams.get('status');

    const skip = (page - 1) * limit;

    const where: Prisma.MedicalRecordWhereInput = {
      ...(search && {
        OR: [
          { patientName: { contains: search, mode: 'insensitive' } },
          { identificationNumber: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(status && { status })
    };

    const [patients, total] = await Promise.all([
      prisma.medicalRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          recordNumber: true,
          patientName: true,
          identificationType: true,
          identificationNumber: true,
          birthDate: true,
          age: true,
          phone: true,
          cellPhone: true,
          email: true,
          eps: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              usuario: true,
              correo: true,
              role: true
            }
          }
        }
      }),
      prisma.medicalRecord.count({ where })
    ]);

    return NextResponse.json({
      data: patients,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('GET patients error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/* ============================
   POST — crear paciente
============================ */

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.patientName || !body.identificationNumber) {
      return NextResponse.json(
        { error: 'patientName e identificationNumber son requeridos' },
        { status: 400 }
      );
    }

    const exists = await prisma.medicalRecord.findFirst({
      where: { identificationNumber: body.identificationNumber }
    });

    if (exists) {
      return NextResponse.json(
        { error: 'Paciente ya existe' },
        { status: 409 }
      );
    }

    const sessionUser = session.user as SessionUser;

    const recordNumber = `HC-${uuidv4().slice(0, 8).toUpperCase()}`;

    const patient = await prisma.medicalRecord.create({
      data: {
        recordNumber,
        patientName: body.patientName,
        identificationType: body.identificationType ?? 'CC',
        identificationNumber: body.identificationNumber,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        age: body.age ?? 0,
        phone: body.phone ?? null,
        cellPhone: body.cellPhone ?? null,
        email: body.email ?? null,
        eps: body.eps ?? null,
        referredBy: body.referredBy ?? null,
        address: body.address ?? null,

        educationLevel: body.educationLevel ?? null,
        occupation: body.occupation ?? null,
        birthPlace: body.birthPlace ?? null,
        nationality: body.nationality ?? null,
        religion: body.religion ?? null,
        neighborhood: body.neighborhood ?? null,
        city: body.city ?? null,
        state: body.state ?? null,
        admissionDate: body.admissionDate
          ? new Date(body.admissionDate)
          : null,

        isBeneficiary: body.isBeneficiary ?? false,

        guardian1Name: body.guardian1Name ?? null,
        guardian1Relationship: body.guardian1Relationship ?? null,
        guardian1Phone: body.guardian1Phone ?? null,
        guardian1Occupation: body.guardian1Occupation ?? null,

        guardian2Name: body.guardian2Name ?? null,
        guardian2Relationship: body.guardian2Relationship ?? null,
        guardian2Phone: body.guardian2Phone ?? null,
        guardian2Occupation: body.guardian2Occupation ?? null,

        attendedBy: body.attendedBy ?? null,
        licenseNumber: body.licenseNumber ?? null,

        personalPathological: body.personalPathological ?? null,
        personalSurgical: body.personalSurgical ?? null,
        personalPsychopathological: body.personalPsychopathological ?? null,
        traumaHistory: body.traumaHistory ?? null,
        sleepStatus: body.sleepStatus ?? null,
        substanceUse: body.substanceUse ?? null,
        personalOther: body.personalOther ?? null,

        familyPathological: body.familyPathological ?? null,
        familySurgical: body.familySurgical ?? null,
        familyPsychopathological: body.familyPsychopathological ?? null,
        familyTraumatic: body.familyTraumatic ?? null,
        familySubstanceUse: body.familySubstanceUse ?? null,
        familyOther: body.familyOther ?? null,

        pregnancyInfo: body.pregnancyInfo ?? null,
        deliveryInfo: body.deliveryInfo ?? null,
        psychomotorDevelopment: body.psychomotorDevelopment ?? null,
        familyDynamics: body.familyDynamics ?? null,

        consultationReason: body.consultationReason ?? null,
        problemHistory: body.problemHistory ?? null,
        therapyExpectations: body.therapyExpectations ?? null,
        mentalExam: body.mentalExam ?? null,
        psychologicalAssessment: body.psychologicalAssessment ?? null,
        diagnosis: body.diagnosis ?? null,
        therapeuticGoals: body.therapeuticGoals ?? null,
        treatmentPlan: body.treatmentPlan ?? null,
        referralInfo: body.referralInfo ?? null,
        recommendations: body.recommendations ?? null,
        evolution: body.evolution ?? null,

        userId: sessionUser.id
      }
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('POST patient error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/* ============================
   PUT — actualizar paciente
============================ */

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'ID requerido' },
        { status: 400 }
      );
    }

    const exists = await prisma.medicalRecord.findUnique({
      where: { id: body.id }
    });

    if (!exists) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }

    const updated = await prisma.medicalRecord.update({
      where: { id: body.id },
      data: {
        ...body,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        admissionDate: body.admissionDate
          ? new Date(body.admissionDate)
          : null,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT patient error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/* ============================
   DELETE — eliminar paciente
============================ */

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = Number(url.searchParams.get('id'));

    if (!id) {
      return NextResponse.json(
        { error: 'ID requerido' },
        { status: 400 }
      );
    }

    const exists = await prisma.medicalRecord.findUnique({
      where: { id }
    });

    if (!exists) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }

    await prisma.medicalRecord.delete({ where: { id } });

    return NextResponse.json({ message: 'Paciente eliminado' });
  } catch (error) {
    console.error('DELETE patient error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
