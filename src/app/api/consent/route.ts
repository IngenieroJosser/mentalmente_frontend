import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ConsentType, Prisma } from '@prisma/client';
import { createHash } from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

function generateHash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

// Deshabilitar el bodyParser para poder usar FormData
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    // Detectar si es multipart/form-data
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      // Procesar como FormData
      const formData = await req.formData();
      const medicalRecordId = formData.get('medicalRecordId') as string;
      const signedByName = formData.get('signedByName') as string;
      const signedByDocument = formData.get('signedByDocument') as string;
      const file = formData.get('file') as File;

      if (!medicalRecordId || !signedByName || !signedByDocument || !file) {
        return NextResponse.json(
          { error: 'Faltan campos requeridos' },
          { status: 400 }
        );
      }

      // Validar existencia de la historia clínica
      const medicalRecord = await prisma.medicalRecord.findUnique({
        where: { id: parseInt(medicalRecordId) },
      });
      if (!medicalRecord) {
        return NextResponse.json(
          { error: 'Historia clínica no encontrada' },
          { status: 404 }
        );
      }

      // Guardar el archivo en el sistema de archivos
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Crear nombre único para el archivo
      const timestamp = Date.now();
      const ext = path.extname(file.name);
      const filename = `consent-${medicalRecordId}-${timestamp}${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'consents');
      const filePath = path.join(uploadDir, filename);

      // Asegurar que el directorio existe
      await mkdir(uploadDir, { recursive: true });

      // Escribir archivo
      await writeFile(filePath, buffer);

      // URL pública
      const pdfUrl = `/uploads/consents/${filename}`;

      // Crear un documento snapshot simple (podemos generar uno genérico)
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="text-align: center;">SANATÚ SAS – CONSENTIMIENTO INFORMADO</h2>
          <p><strong>FECHA:</strong> ${new Date().toLocaleDateString('es-CO')}</p>
          <p><strong>CIUDAD:</strong> Quibdó, Chocó</p>
          <p>Yo, <strong>${signedByName}</strong>, identificado(a) con la cédula número <strong>${signedByDocument}</strong>, declaro que acepto recibir atención psicológica por parte de SANATÚ SAS.</p>
          <p>Documento firmado adjunto: ${file.name}</p>
        </div>
      `;

      const documentHash = generateHash(htmlContent + pdfUrl);
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
      const userAgent = req.headers.get('user-agent') || 'unknown';

      // Guardar en base de datos
      const consentRecord = await prisma.consentRecord.create({
        data: {
          medicalRecordId: parseInt(medicalRecordId),
          templateId: (await getOrCreateTemplate()).id, // función auxiliar
          signedByName,
          signedByDocument,
          documentSnapshot: htmlContent,
          pdfUrl,
          signatureBase64: null,
          documentHash,
          signedFromIp: ip,
          signedUserAgent: userAgent,
        },
      });

      return NextResponse.json({
        success: true,
        consentId: consentRecord.id,
        message: 'Consentimiento guardado exitosamente',
      });
    } else {
      // Procesar como JSON (firma digital)
      const body = await req.json();
      const { medicalRecordId, signedByName, signedByDocument, signatureBase64 } = body;

      if (!medicalRecordId || !signedByName || !signedByDocument || !signatureBase64) {
        return NextResponse.json(
          { error: 'Faltan campos requeridos' },
          { status: 400 }
        );
      }

      // Validar existencia de la historia clínica
      const medicalRecord = await prisma.medicalRecord.findUnique({
        where: { id: parseInt(medicalRecordId) },
      });
      if (!medicalRecord) {
        return NextResponse.json(
          { error: 'Historia clínica no encontrada' },
          { status: 404 }
        );
      }

      // Obtener o crear plantilla
      const template = await getOrCreateTemplate();

      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
      const userAgent = req.headers.get('user-agent') || 'unknown';

      // Fecha actual formateada
      const today = new Date();
      const formattedDate = today.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, ' / ');

      const finalHtml = template.htmlContent
        .replace('__FECHA__', formattedDate)
        .replace('__PACIENTE__', signedByName)
        .replace('__DOCUMENTO__', signedByDocument);

      const documentHash = generateHash(finalHtml + (signatureBase64 || ''));

      const consentRecord = await prisma.consentRecord.create({
        data: {
          medicalRecordId: parseInt(medicalRecordId),
          templateId: template.id,
          signedByName,
          signedByDocument,
          documentSnapshot: finalHtml,
          signatureBase64,
          signedFromIp: ip,
          signedUserAgent: userAgent,
          documentHash,
        },
      });

      return NextResponse.json({
        success: true,
        consentId: consentRecord.id,
        message: 'Consentimiento guardado exitosamente',
      });
    }
  } catch (error) {
    console.error('Error guardando consentimiento:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Función auxiliar para obtener o crear la plantilla (reutilizada)
async function getOrCreateTemplate() {
  const templateTitle = 'Consentimiento Informado - Atención Psicológica';
  let template = await prisma.consentTemplate.findFirst({
    where: { title: templateTitle, isActive: true },
  });

  if (!template) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="text-align: center;">SANATÚ SAS – CONSENTIMIENTO INFORMADO</h2>
        <p><strong>FECHA:</strong> __FECHA__</p>
        <p><strong>CIUDAD:</strong> Quibdó, Chocó</p>
        <p>Yo, <strong>__PACIENTE__</strong>, mayor de edad, identificado(a) con la cédula número <strong>__DOCUMENTO__</strong>, por medio de este documento declaro que acepto de manera voluntaria recibir atención psicológica por parte de SANATÚ SAS (NIT 902010331-8).</p>
        <p>Entiendo y acepto que:</p>
        <ol>
          <li><strong>Privacidad:</strong> Todo lo que hablemos es confidencial (secreto profesional). Nadie más sabrá lo que se diga en consulta, a menos que mi vida o la de alguien más esté en peligro grave, según lo manda la ley colombiana.</li>
          <li><strong>Voluntad:</strong> Puedo hacer las preguntas que quiera sobre mi proceso y puedo decidir no continuar con la terapia en el momento que lo desee.</li>
          <li><strong>Trato Digno:</strong> Recibiré una atención respetuosa, profesional y enfocada en mi bienestar.</li>
          <li><strong>Uso de Datos:</strong> Autorizo a SANATÚ SAS para usar mis datos básicos (nombre, teléfono) únicamente para contacto de citas y registro médico, cumpliendo con la ley de protección de datos.</li>
        </ol>
        <p>Al firmar, confirmo que he leído (o me han leído) y comprendido este documento y que estoy de acuerdo con lo aquí escrito.</p>
        <p>______________________________________<br/>Firma del Paciente / Consultante C.C.</p>
        <p>_____________________________________<br/>Firma del Profesional (SANATÚ SAS)<br/>Psicóloga – T.P. No. __________</p>
      </div>
    `;

    template = await prisma.consentTemplate.create({
      data: {
        type: ConsentType.CLINICAL_PROCEDURE,
        version: '1.0',
        title: templateTitle,
        htmlContent,
        isActive: true,
      },
    });
  }
  return template;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const medicalRecordId = searchParams.get('medicalRecordId');

    const where: Prisma.ConsentRecordWhereInput = {};

    if (medicalRecordId) {
      where.medicalRecordId = parseInt(medicalRecordId);
    }

    if (search) {
      where.OR = [
        { signedByName: { contains: search, mode: 'insensitive' } },
        { signedByDocument: { contains: search, mode: 'insensitive' } },
        { medicalRecord: { patientName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const consents = await prisma.consentRecord.findMany({
      where,
      include: {
        medicalRecord: {
          select: {
            id: true,
            patientName: true,
            identificationNumber: true,
            recordNumber: true,
          },
        },
        template: {
          select: {
            title: true,
            version: true,
          },
        },
      },
      orderBy: { signedAt: 'desc' },
    });

    return NextResponse.json({ data: consents });
  } catch (error) {
    console.error('Error fetching consents:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}