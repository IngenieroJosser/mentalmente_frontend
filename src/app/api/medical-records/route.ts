import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * tags:
 *   name: Medical Records
 *   description: Gestión integral de historias clínicas de pacientes
 * 
 * components:
 *   schemas:
 *     MedicalRecord:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         recordNumber:
 *           type: string
 *           example: "HC-2023-001"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-06-15T14:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-06-20T10:15:00Z"
 *         userId:
 *           type: integer
 *           example: 5
 *         patientName:
 *           type: string
 *           example: "María Rodríguez"
 *         identificationType:
 *           type: string
 *           example: "Cédula"
 *         identificationNumber:
 *           type: string
 *           example: "1234567890"
 *         birthDate:
 *           type: string
 *           format: date-time
 *           example: "1985-05-15T00:00:00Z"
 *         age:
 *           type: integer
 *           example: 38
 *         educationLevel:
 *           type: string
 *           example: "Universitaria"
 *         occupation:
 *           type: string
 *           example: "Ingeniera de Sistemas"
 *         birthPlace:
 *           type: string
 *           example: "Bogotá, Colombia"
 *         nationality:
 *           type: string
 *           example: "Colombiana"
 *         religion:
 *           type: string
 *           example: "Católica"
 *         address:
 *           type: string
 *           example: "Calle 123 #45-67"
 *         neighborhood:
 *           type: string
 *           example: "El Poblado"
 *         city:
 *           type: string
 *           example: "Medellín"
 *         state:
 *           type: string
 *           example: "Antioquia"
 *         admissionDate:
 *           type: string
 *           format: date-time
 *           example: "2023-06-10T09:00:00Z"
 *         phone:
 *           type: string
 *           example: "6041234567"
 *         cellPhone:
 *           type: string
 *           example: "3001234567"
 *         email:
 *           type: string
 *           example: "maria.rodriguez@ejemplo.com"
 *         eps:
 *           type: string
 *           example: "Sura EPS"
 *         isBeneficiary:
 *           type: boolean
 *           example: false
 *         referredBy:
 *           type: string
 *           example: "Dr. Carlos Andrés Gómez"
 *         guardian1Name:
 *           type: string
 *           example: "Juan Rodríguez"
 *         guardian1Relationship:
 *           type: string
 *           example: "Padre"
 *         guardian1Phone:
 *           type: string
 *           example: "3007654321"
 *         guardian1Occupation:
 *           type: string
 *           example: "Comerciante"
 *         guardian2Name:
 *           type: string
 *           example: "Ana María López"
 *         guardian2Relationship:
 *           type: string
 *           example: "Madre"
 *         guardian2Phone:
 *           type: string
 *           example: "3007654322"
 *         guardian2Occupation:
 *           type: string
 *           example: "Docente"
 *         attendedBy:
 *           type: string
 *           example: "Dra. Laura Méndez"
 *         licenseNumber:
 *           type: string
 *           example: "PSI-12345"
 *         personalPathological:
 *           type: string
 *           example: "Hipertensión arterial controlada"
 *         personalSurgical:
 *           type: string
 *           example: "Apendicectomía en 2010"
 *         personalPsychopathological:
 *           type: string
 *           example: "Episodio depresivo en 2018"
 *         traumaHistory:
 *           type: string
 *           example: "Accidente automovilístico en 2015"
 *         sleepStatus:
 *           type: string
 *           example: "Insomnio ocasional"
 *         substanceUse:
 *           type: string
 *           example: "Ninguna"
 *         personalOther:
 *           type: string
 *           example: "Alergia a la penicilina"
 *         familyPathological:
 *           type: string
 *           example: "Diabetes mellitus en abuela materna"
 *         familySurgical:
 *           type: string
 *           example: "Ninguna"
 *         familyPsychopathological:
 *           type: string
 *           example: "Depresión en madre"
 *         familyTraumatic:
 *           type: string
 *           example: "Ninguno"
 *         familySubstanceUse:
 *           type: string
 *           example: "Ninguno"
 *         familyOther:
 *           type: string
 *           example: "Ninguno"
 *         pregnancyInfo:
 *           type: string
 *           example: "Embarazo normal a término"
 *         deliveryInfo:
 *           type: string
 *           example: "Parto vaginal sin complicaciones"
 *         psychomotorDevelopment:
 *           type: string
 *           example: "Desarrollo normal"
 *         familyDynamics:
 *           type: string
 *           example: "Relaciones estables con comunicación abierta"
 *         consultationReason:
 *           type: string
 *           example: "Ansiedad generalizada y ataques de pánico"
 *         problemHistory:
 *           type: string
 *           example: "Síntomas presentes desde hace 6 meses, aumentaron en el último mes"
 *         therapyExpectations:
 *           type: string
 *           example: "Aprender técnicas para manejar la ansiedad"
 *         mentalExam:
 *           type: string
 *           example: "Paciente orientada, ánimo depresivo, pensamiento coherente"
 *         psychologicalAssessment:
 *           type: string
 *           example: "Inventario de Depresión de Beck: 25 (moderada)"
 *         diagnosis:
 *           type: string
 *           example: "F41.1 Trastorno de ansiedad generalizada"
 *         therapeuticGoals:
 *           type: string
 *           example: "Reducir frecuencia de ataques de pánico en un 80% en 3 meses"
 *         treatmentPlan:
 *           type: string
 *           example: "Terapia cognitivo-conductual semanal durante 12 semanas"
 *         referralInfo:
 *           type: string
 *           example: "Derivación a psiquiatría para evaluación farmacológica"
 *         recommendations:
 *           type: string
 *           example: "Ejercicios de respiración diarios y actividad física regular"
 *         evolution:
 *           type: string
 *           example: "Primera sesión: Paciente colaboradora, expresó sus preocupaciones abiertamente"
 *         user:
 *           type: object
 *           properties:
 *             usuario:
 *               type: string
 *               example: "DraLaura"
 *             role:
 *               type: string
 *               example: "Psicologo"
 * 
 *     MedicalRecordInput:
 *       type: object
 *       required:
 *         - recordNumber
 *         - userId
 *         - patientName
 *       properties:
 *         recordNumber:
 *           type: string
 *           example: "HC-2023-002"
 *         userId:
 *           type: integer
 *           example: 5
 *         patientName:
 *           type: string
 *           example: "Carlos Sánchez"
 *         identificationType:
 *           type: string
 *           example: "Cédula"
 *         identificationNumber:
 *           type: string
 *           example: "987654321"
 *         birthDate:
 *           type: string
 *           format: date-time
 *           example: "1992-11-30T00:00:00Z"
 *         age:
 *           type: integer
 *           example: 30
 *         educationLevel:
 *           type: string
 *           example: "Técnico"
 *         occupation:
 *           type: string
 *           example: "Diseñador Gráfico"
 *         birthPlace:
 *           type: string
 *           example: "Cali, Colombia"
 *         nationality:
 *           type: string
 *           example: "Colombiana"
 *         religion:
 *           type: string
 *           example: "Ateo"
 *         address:
 *           type: string
 *           example: "Carrera 56 #78-90"
 *         neighborhood:
 *           type: string
 *           example: "San Fernando"
 *         city:
 *           type: string
 *           example: "Cali"
 *         state:
 *           type: string
 *           example: "Valle del Cauca"
 *         admissionDate:
 *           type: string
 *           format: date-time
 *           example: "2023-06-18T10:30:00Z"
 *         phone:
 *           type: string
 *           example: "6027654321"
 *         cellPhone:
 *           type: string
 *           example: "3176543210"
 *         email:
 *           type: string
 *           example: "carlos.sanchez@ejemplo.com"
 *         eps:
 *           type: string
 *           example: "Nueva EPS"
 *         isBeneficiary:
 *           type: boolean
 *           example: true
 *         referredBy:
 *           type: string
 *           example: "Dr. Andrés Ramírez"
 *         guardian1Name:
 *           type: string
 *           example: "Luisa Fernández"
 *         guardian1Relationship:
 *           type: string
 *           example: "Esposa"
 *         guardian1Phone:
 *           type: string
 *           example: "3187654321"
 *         guardian1Occupation:
 *           type: string
 *           example: "Arquitecta"
 *         guardian2Name:
 *           type: string
 *           example: "Pedro Sánchez"
 *         guardian2Relationship:
 *           type: string
 *           example: "Hermano"
 *         guardian2Phone:
 *           type: string
 *           example: "3158765432"
 *         guardian2Occupation:
 *           type: string
 *           example: "Ingeniero"
 *         attendedBy:
 *           type: string
 *           example: "Dr. Miguel Torres"
 *         licenseNumber:
 *           type: string
 *           example: "PSI-54321"
 *         personalPathological:
 *           type: string
 *           example: "Asma leve"
 *         personalSurgical:
 *           type: string
 *           example: "Cirugía de rodilla en 2018"
 *         personalPsychopathological:
 *           type: string
 *           example: "Ninguno"
 *         traumaHistory:
 *           type: string
 *           example: "Ninguno"
 *         sleepStatus:
 *           type: string
 *           example: "Calidad regular del sueño"
 *         substanceUse:
 *           type: string
 *           example: "Consumo ocasional de alcohol"
 *         personalOther:
 *           type: string
 *           example: "Alergia a los mariscos"
 *         familyPathological:
 *           type: string
 *           example: "Cáncer de pulmón en padre"
 *         familySurgical:
 *           type: string
 *           example: "Cirugía de vesícula en madre"
 *         familyPsychopathological:
 *           type: string
 *           example: "Esquizofrenia en tío materno"
 *         familyTraumatic:
 *           type: string
 *           example: "Ninguno"
 *         familySubstanceUse:
 *           type: string
 *           example: "Alcoholismo en abuelo paterno"
 *         familyOther:
 *           type: string
 *           example: "Ninguno"
 *         pregnancyInfo:
 *           type: string
 *           example: "N/A"
 *         deliveryInfo:
 *           type: string
 *           example: "N/A"
 *         psychomotorDevelopment:
 *           type: string
 *           example: "Normal"
 *         familyDynamics:
 *           type: string
 *           example: "Relaciones tensas con padre"
 *         consultationReason:
 *           type: string
 *           example: "Problemas de pareja y comunicación"
 *         problemHistory:
 *           type: string
 *           example: "Conflictos recurrentes durante 2 años"
 *         therapyExpectations:
 *           type: string
 *           example: "Mejorar comunicación en la relación"
 *         mentalExam:
 *           type: string
 *           example: "Paciente orientado, discurso coherente, ánimo estable"
 *         psychologicalAssessment:
 *           type: string
 *           example: "Escala de Satisfacción Marital: 45/100"
 *         diagnosis:
 *           type: string
 *           example: "Problemas de relación conyugal"
 *         therapeuticGoals:
 *           type: string
 *           example: "Desarrollar habilidades de comunicación efectiva"
 *         treatmentPlan:
 *           type: string
 *           example: "Terapia de pareja quincenal durante 6 meses"
 *         referralInfo:
 *           type: string
 *           example: "Ninguna"
 *         recommendations:
 *           type: string
 *           example: "Lectura sobre comunicación asertiva"
 *         evolution:
 *           type: string
 *           example: "Sesión inicial: Ambos cónyuges expresaron sus preocupaciones"
 */

/**
 * @swagger
 * /api/medical-records:
 *   post:
 *     summary: Crea una nueva historia clínica
 *     description: Registra una historia clínica completa con todos los datos médicos del paciente
 *     tags: [Medical Records]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicalRecordInput'
 *     responses:
 *       201:
 *         description: Historia clínica creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MedicalRecord'
 *       400:
 *         description: Faltan campos obligatorios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Número de registro, ID de usuario y nombre del paciente son requeridos"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor"
 * 
 *   get:
 *     summary: Obtiene todas las historias clínicas
 *     description: Retorna un listado completo de historias clínicas con información básica del terapeuta asociado
 *     tags: [Medical Records]
 *     responses:
 *       200:
 *         description: Lista de historias clínicas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MedicalRecord'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor"
 */

/**
 * Crea una nueva historia clínica
 * @param req Solicitud HTTP con los datos de la historia clínica
 * @returns Respuesta JSON con la historia creada o mensaje de error
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validación de campos obligatorios
    if (!body.recordNumber || !body.userId || !body.patientName) {
      return NextResponse.json(
        { error: 'Número de registro, ID de usuario y nombre del paciente son requeridos' },
        { status: 400 }
      );
    }

    // Crear la historia clínica con conversión de tipos
    const newMedicalRecord = await prisma.medicalRecord.create({
      data: {
        recordNumber: body.recordNumber,
        userId: body.userId,
        patientName: body.patientName,
        identificationType: body.identificationType,
        identificationNumber: body.identificationNumber,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        age: body.age ? parseInt(body.age) : null,
        educationLevel: body.educationLevel,
        occupation: body.occupation,
        birthPlace: body.birthPlace,
        nationality: body.nationality,
        religion: body.religion,
        address: body.address,
        neighborhood: body.neighborhood,
        city: body.city,
        state: body.state,
        admissionDate: body.admissionDate ? new Date(body.admissionDate) : null,
        phone: body.phone,
        cellPhone: body.cellPhone,
        email: body.email,
        eps: body.eps,
        isBeneficiary: body.isBeneficiary || false,
        referredBy: body.referredBy,
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
      },
    });

    return NextResponse.json(newMedicalRecord, { status: 201 });
    
  } catch (error) {
    console.error('Error creando la historia clinica:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * Obtiene todas las historias clínicas registradas
 * @returns Respuesta JSON con listado de historias clínicas
 */
export async function GET() {
  try {
    const medicalRecords = await prisma.medicalRecord.findMany({
      include: {
        user: {
          select: {
            usuario: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Devolver en el formato esperado por el frontend
    return NextResponse.json({
      data: medicalRecords,
      total: medicalRecords.length,
      page: 1,
      totalPages: 1
    });
    
  } catch (error) {
    console.error('Error al obtener las historias clinicas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * Actualiza la historias clínicas registradas
 * @returns Respuesta JSON actualizando la historia clínica
 */
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de historia clínica es requerido' },
        { status: 400 }
      );
    }

    const body = await req.json();
    
    // Eliminar solo campos protegidos si existen
    const updateData = { ...body };
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    
    // Convertir fechas si es necesario
    if (updateData.birthDate) {
      updateData.birthDate = new Date(updateData.birthDate);
    }
    if (updateData.admissionDate) {
      updateData.admissionDate = new Date(updateData.admissionDate);
    }
    
    const updatedRecord = await prisma.medicalRecord.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return NextResponse.json(updatedRecord);
    
  } catch (error) {
    console.error('Error actualizando historia clínica:', error);
    
    // Mensaje más detallado para depuración
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Error interno del servidor';
    
    return NextResponse.json(
      { error: errorMessage, details: error },
      { status: 500 }
    );
  }
}