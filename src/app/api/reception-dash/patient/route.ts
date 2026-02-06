import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/type';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Definir el tipo para las condiciones WHERE
interface WhereConditions {
  OR?: Array<{
    patientName?: { contains: string; mode: 'insensitive' };
    identificationNumber?: { contains: string; mode: 'insensitive' };
    email?: { contains: string; mode: 'insensitive' };
  }>;
  status?: string;
}

// Tipo para el usuario de la sesión
interface SessionUser {
  id: number;
  [key: string]: unknown; // Cambiado de any a unknown
}

// Tipo para la condición WHERE usando el tipo generado por Prisma
type PrismaWhereType = NonNullable<Parameters<typeof prisma.medicalRecord.findMany>[0]>['where'];

/**
 * @swagger
 * tags:
 *   name: Pacientes
 *   description: Gestión de pacientes psicológicos
 * 
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         recordNumber:
 *           type: string
 *         patientName:
 *           type: string
 *         identificationType:
 *           type: string
 *         identificationNumber:
 *           type: string
 *         birthDate:
 *           type: string
 *           format: date
 *         age:
 *           type: integer
 *         gender:
 *           type: string
 *         phone:
 *           type: string
 *         cellPhone:
 *           type: string
 *         email:
 *           type: string
 *         eps:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, inactive, pending]
 *         therapist:
 *           type: string
 *         sessions:
 *           type: integer
 *         notes:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     PatientInput:
 *       type: object
 *       required:
 *         - patientName
 *         - identificationNumber
 *       properties:
 *         patientName:
 *           type: string
 *         identificationType:
 *           type: string
 *         identificationNumber:
 *           type: string
 *         birthDate:
 *           type: string
 *           format: date
 *         age:
 *           type: integer
 *         gender:
 *           type: string
 *         phone:
 *           type: string
 *         cellPhone:
 *           type: string
 *         email:
 *           type: string
 *         eps:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, inactive, pending]
 *         sessions:
 *           type: integer
 *         notes:
 *           type: string
 * 
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/reception-dash/patient:
 *   get:
 *     summary: Obtiene la lista de pacientes paginada
 *     tags: [Pacientes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Límite de resultados por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término de búsqueda (nombre, identificación o email)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, pending]
 *         description: Filtrar por estado del paciente
 *     responses:
 *       200:
 *         description: Lista de pacientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Patient'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';

    const offset = (page - 1) * limit;

    // Crear objeto where con el tipo correcto
    const where: PrismaWhereType = {
      OR: [
        { patientName: { contains: search, mode: 'insensitive' } },
        { identificationNumber: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    };

    if (status) {
      // Necesitamos hacer un cast aquí porque el tipo Prisma no incluye 'status'
      (where as any).status = status;
    }

    const patients = await prisma.medicalRecord.findMany({
      where,
      skip: offset,
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
        userId: true,
        referredBy: true,
        address: true,
        // Agregar más campos según sea necesario
        user: {
          select: {
            id: true,
            usuario: true,
            correo: true,
            role: true
          }
        }
      }
    });

    const total = await prisma.medicalRecord.count({ where: where as any });
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: patients,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/reception-dash/patient:
 *   post:
 *     summary: Crea un nuevo paciente
 *     tags: [Pacientes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatientInput'
 *     responses:
 *       201:
 *         description: Paciente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       409:
 *         description: Ya existe un paciente con esta identificación
 *       500:
 *         description: Error del servidor
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    if (!body.patientName || !body.identificationNumber) {
      return NextResponse.json(
        { error: 'Nombre del paciente e identificación son campos requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el paciente ya existe
    const existingPatient = await prisma.medicalRecord.findFirst({
      where: { identificationNumber: body.identificationNumber },
    });

    if (existingPatient) {
      return NextResponse.json(
        { error: 'Ya existe un paciente con este número de identificación' },
        { status: 409 }
      );
    }

    // Obtener el ID del usuario de la sesión de forma segura
    const sessionUser = session.user as SessionUser;
    if (!sessionUser?.id) {
      return NextResponse.json(
        { error: 'No se pudo identificar al usuario' },
        { status: 400 }
      );
    }

    // Crear número de registro único
    const recordNumber = `HC-${uuidv4().substring(0, 8).toUpperCase()}`;

    const newPatient = await prisma.medicalRecord.create({
      data: {
        recordNumber,
        patientName: body.patientName,
        identificationType: body.identificationType || 'CC',
        identificationNumber: body.identificationNumber,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        age: body.age || 0,
        phone: body.phone || null,
        cellPhone: body.cellPhone || null,
        email: body.email || null,
        eps: body.eps || null,
        referredBy: body.referredBy || null,
        address: body.address || null,
        // Agregar más campos según el modelo
        educationLevel: body.educationLevel || null,
        occupation: body.occupation || null,
        birthPlace: body.birthPlace || null,
        nationality: body.nationality || null,
        religion: body.religion || null,
        neighborhood: body.neighborhood || null,
        city: body.city || null,
        state: body.state || null,
        admissionDate: body.admissionDate ? new Date(body.admissionDate) : null,
        isBeneficiary: body.isBeneficiary || false,
        guardian1Name: body.guardian1Name || null,
        guardian1Relationship: body.guardian1Relationship || null,
        guardian1Phone: body.guardian1Phone || null,
        guardian1Occupation: body.guardian1Occupation || null,
        guardian2Name: body.guardian2Name || null,
        guardian2Relationship: body.guardian2Relationship || null,
        guardian2Phone: body.guardian2Phone || null,
        guardian2Occupation: body.guardian2Occupation || null,
        attendedBy: body.attendedBy || null,
        licenseNumber: body.licenseNumber || null,
        personalPathological: body.personalPathological || null,
        personalSurgical: body.personalSurgical || null,
        personalPsychopathological: body.personalPsychopathological || null,
        traumaHistory: body.traumaHistory || null,
        sleepStatus: body.sleepStatus || null,
        substanceUse: body.substanceUse || null,
        personalOther: body.personalOther || null,
        familyPathological: body.familyPathological || null,
        familySurgical: body.familySurgical || null,
        familyPsychopathological: body.familyPsychopathological || null,
        familyTraumatic: body.familyTraumatic || null,
        familySubstanceUse: body.familySubstanceUse || null,
        familyOther: body.familyOther || null,
        pregnancyInfo: body.pregnancyInfo || null,
        deliveryInfo: body.deliveryInfo || null,
        psychomotorDevelopment: body.psychomotorDevelopment || null,
        familyDynamics: body.familyDynamics || null,
        consultationReason: body.consultationReason || null,
        problemHistory: body.problemHistory || null,
        therapyExpectations: body.therapyExpectations || null,
        mentalExam: body.mentalExam || null,
        psychologicalAssessment: body.psychologicalAssessment || null,
        diagnosis: body.diagnosis || null,
        therapeuticGoals: body.therapeuticGoals || null,
        treatmentPlan: body.treatmentPlan || null,
        referralInfo: body.referralInfo || null,
        recommendations: body.recommendations || null,
        evolution: body.evolution || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: sessionUser.id,
      },
    });

    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    console.error('Error al crear paciente:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/reception-dash/patient:
 *   put:
 *     summary: Actualiza un paciente existente
 *     tags: [Pacientes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatientInput'
 *     responses:
 *       200:
 *         description: Paciente actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Paciente no encontrado
 *       500:
 *         description: Error del servidor
 */
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'ID de paciente es requerido para actualizar' },
        { status: 400 }
      );
    }

    // Verificar si el paciente existe
    const existingPatient = await prisma.medicalRecord.findUnique({
      where: { id: body.id },
    });

    if (!existingPatient) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }

    const updatedPatient = await prisma.medicalRecord.update({
      where: { id: body.id },
      data: {
        patientName: body.patientName,
        identificationType: body.identificationType,
        identificationNumber: body.identificationNumber,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        age: body.age,
        phone: body.phone,
        cellPhone: body.cellPhone,
        email: body.email,
        eps: body.eps,
        referredBy: body.referredBy,
        address: body.address,
        // Agregar más campos según el modelo
        educationLevel: body.educationLevel,
        occupation: body.occupation,
        birthPlace: body.birthPlace,
        nationality: body.nationality,
        religion: body.religion,
        neighborhood: body.neighborhood,
        city: body.city,
        state: body.state,
        admissionDate: body.admissionDate ? new Date(body.admissionDate) : null,
        isBeneficiary: body.isBeneficiary,
        guardian1Name: body.guardian1Name,
        guardian1Relationship: body.guardian1Relationship,
        guardian1Phone: body.guardian1Phone,
        guardian1Occupation: body.guardian1Occupation,
        guardian2Name: body.guardian2Name,
        guardian2Relationship: body.guardian2Relationship,
        guardian2Phone: body.guardian2Phone,
        guardian2Occupation: body.guardian2Occupation,
        attendedBy: body.attendedBy,
        licenseNumber: body.licenseNumber,
        personalPathological: body.personalPathological,
        personalSurgical: body.personalSurgical,
        personalPsychopathological: body.personalPsychopathological,
        traumaHistory: body.traumaHistory,
        sleepStatus: body.sleepStatus,
        substanceUse: body.substanceUse,
        personalOther: body.personalOther,
        familyPathological: body.familyPathological,
        familySurgical: body.familySurgical,
        familyPsychopathological: body.familyPsychopathological,
        familyTraumatic: body.familyTraumatic,
        familySubstanceUse: body.familySubstanceUse,
        familyOther: body.familyOther,
        pregnancyInfo: body.pregnancyInfo,
        deliveryInfo: body.deliveryInfo,
        psychomotorDevelopment: body.psychomotorDevelopment,
        familyDynamics: body.familyDynamics,
        consultationReason: body.consultationReason,
        problemHistory: body.problemHistory,
        therapyExpectations: body.therapyExpectations,
        mentalExam: body.mentalExam,
        psychologicalAssessment: body.psychologicalAssessment,
        diagnosis: body.diagnosis,
        therapeuticGoals: body.therapeuticGoals,
        treatmentPlan: body.treatmentPlan,
        referralInfo: body.referralInfo,
        recommendations: body.recommendations,
        evolution: body.evolution,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/reception-dash/patient:
 *   delete:
 *     summary: Elimina un paciente
 *     tags: [Pacientes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del paciente a eliminar
 *     responses:
 *       200:
 *         description: Paciente eliminado exitosamente
 *       400:
 *         description: ID de paciente no proporcionado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Paciente no encontrado
 *       500:
 *         description: Error del servidor
 */
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = parseInt(url.searchParams.get('id') || '0');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de paciente es requerido' },
        { status: 400 }
      );
    }

    // Verificar si el paciente existe
    const existingPatient = await prisma.medicalRecord.findUnique({
      where: { id },
    });

    if (!existingPatient) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }

    await prisma.medicalRecord.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Paciente eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}