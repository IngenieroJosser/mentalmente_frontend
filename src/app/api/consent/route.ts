import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ConsentType, Prisma } from '@prisma/client';
import { createHash } from 'crypto';
import { put } from '@vercel/blob';

function generateHash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getOrCreateTemplate() {
  const templateTitle = 'Consentimiento Informado - Atención Psicológica';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="text-align: center;">CONSENTIMIENTO INFORMADO PARA SERVICIO DE ORIENTACIÓN PSICOLÓGICA VIRTUAL O DOMICILIARIO</h2>
      <p><strong>FECHA:</strong> __FECHA__</p>
      <p><strong>CIUDAD DE CONEXIÓN:</strong> ____________________</p>
      <p>Yo, <strong>__PACIENTE__</strong>, mayor de edad, identificado(a) con la cédula de ciudadanía número <strong>__DOCUMENTO__</strong>, manifiesto que acepto de manera voluntaria recibir el servicio de Orientación Psicológica en modalidad virtual brindado por la psicóloga LIYIVETH QUINTERO GARCÍA, identificada con C.C. 1.077.465.202 y Tarjeta Profesional No. 229742.</p>
      <p><strong>Declaro que he sido informado(a) sobre las características del servicio y acepto las siguientes condiciones:</strong></p>
      <ol>
        <li><strong>Naturaleza del servicio:</strong> Comprendo que la Orientación Psicológica es un espacio profesional de escucha, análisis, acompañamiento y orientación frente a situaciones personales, emocionales, familiares, relacionales o de adaptación. Este servicio está dirigido a brindar herramientas y recomendaciones psicológicas que favorezcan mi bienestar y toma de decisiones. Entiendo que este servicio no corresponde a un proceso de psicoterapia clínica ni sustituye tratamientos médicos o psicológicos especializados cuando estos sean requeridos. En caso de identificarse la necesidad de una atención especializada, recibiré la orientación correspondiente.</li>
        <li><strong>Confidencialidad y privacidad:</strong> La información compartida durante la orientación será manejada bajo el principio de confidencialidad y secreto profesional establecido en la Ley 1090 de 2006. Me comprometo a realizar la sesión desde un espacio que permita proteger mi privacidad y confidencialidad.</li>
        <li><strong>Modalidad de atención domiciliaria:</strong> La orientación psicológica domiciliaria consiste en la prestación del servicio profesional en el lugar de residencia o ubicación acordada con la persona usuaria, dentro del área de cobertura establecida. Esta modalidad busca brindar acompañamiento y orientación psicológica en un entorno cercano para el usuario, manteniendo los principios de confidencialidad, respeto, ética profesional y calidad en la atención.</li>
        <li><strong>Condiciones de la modalidad virtual:</strong> Comprendo que la orientación se desarrolla mediante herramientas tecnológicas de comunicación. En caso de presentarse dificultades técnicas que impidan la adecuada prestación del servicio, se podrá acordar una alternativa de comunicación o una reprogramación de la sesión.</li>
        <li><strong>Autonomía y participación:</strong> Reconozco mi derecho a realizar preguntas, expresar inquietudes y decidir libremente sobre mi participación en el servicio de orientación psicológica.</li>
        <li><strong>Calidad de la atención:</strong> Recibiré una atención basada en el respeto, la ética profesional y la dignidad humana, orientada a favorecer mi bienestar y autonomía personal.</li>
        <li><strong>Tratamiento de datos personales:</strong> Autorizo a la psicóloga Liyiveth Quintero García para recolectar, almacenar y utilizar mis datos personales únicamente para fines relacionados con la prestación del servicio, registro de la atención y procesos administrativos necesarios, conforme a la Ley 1581 de 2012 y demás normas aplicables de protección de datos personales.</li>
        <li><strong>Honorarios:</strong> Me comprometo a realizar el pago correspondiente por el servicio de orientación psicológica de acuerdo con las condiciones previamente informadas y mediante los canales establecidos por la profesional.</li>
      </ol>
      <p>Al firmar este documento o manifestar mi aceptación por medios electrónicos, declaro que he leído, comprendido y aceptado las condiciones aquí descritas.</p>
      <p>FIRMA DEL USUARIO(A): ________________________________________<br/>C.C. No.: ____________________</p>
      <p>FIRMA DE LA PROFESIONAL:<br/>LIYIVETH QUINTERO GARCÍA<br/>Psicóloga | T.P. No. 229742</p>
    </div>
  `;
  let template = await prisma.consentTemplate.findFirst({
    where: { title: templateTitle, isActive: true },
  });

  if (!template) {
    template = await prisma.consentTemplate.create({
      data: {
        type: ConsentType.CLINICAL_PROCEDURE,
        version: '2.0',
        title: templateTitle,
        htmlContent,
        isActive: true,
      },
    });
  } else if (template.version !== '2.0' || template.htmlContent !== htmlContent) {
    template = await prisma.consentTemplate.update({
      where: { id: template.id },
      data: { version: '2.0', htmlContent },
    });
  }
  return template;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      // Subida de archivo (consentimiento escaneado)
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

      const medicalRecord = await prisma.medicalRecord.findUnique({
        where: { id: parseInt(medicalRecordId) },
      });
      if (!medicalRecord) {
        return NextResponse.json(
          { error: 'Historia clínica no encontrada' },
          { status: 404 }
        );
      }

      // Subir archivo a Vercel Blob
      const blob = await put(file.name, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      const pdfUrl = blob.url;
      const template = await getOrCreateTemplate();

      const formattedDate = new Date().toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).replace(/\//g, ' / ');
      const htmlContent = `${template.htmlContent
        .replace('__FECHA__', formattedDate)
        .replace('__PACIENTE__', signedByName)
        .replace('__DOCUMENTO__', signedByDocument)}
        <p>Documento firmado adjunto: ${file.name}</p>`;

      const documentHash = generateHash(htmlContent + pdfUrl);
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
      const userAgent = req.headers.get('user-agent') || 'unknown';

      const consentRecord = await prisma.consentRecord.create({
        data: {
          medicalRecordId: parseInt(medicalRecordId),
          templateId: template.id,
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
      // Firma digital (JSON)
      const body = await req.json();
      const { medicalRecordId, signedByName, signedByDocument, signatureBase64 } = body;

      if (!medicalRecordId || !signedByName || !signedByDocument || !signatureBase64) {
        return NextResponse.json(
          { error: 'Faltan campos requeridos' },
          { status: 400 }
        );
      }

      const medicalRecord = await prisma.medicalRecord.findUnique({
        where: { id: parseInt(medicalRecordId) },
      });
      if (!medicalRecord) {
        return NextResponse.json(
          { error: 'Historia clínica no encontrada' },
          { status: 404 }
        );
      }

      const template = await getOrCreateTemplate();

      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
      const userAgent = req.headers.get('user-agent') || 'unknown';

      const today = new Date();
      const formattedDate = today.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
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