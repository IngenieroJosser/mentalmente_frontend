import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ConsentType } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { medicalRecordId, signedByName, signedByDocument, signatureBase64 } = body;

    if (!medicalRecordId || !signedByName || !signedByDocument) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Buscar o crear la plantilla de consentimiento informado
    const templateTitle = 'Consentimiento Informado - Atención Psicológica';
    let template = await prisma.consentTemplate.findFirst({
      where: { title: templateTitle, isActive: true },
    });

    if (!template) {
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="text-align: center;">SANATÚ SAS – CONSENTIMIENTO INFORMADO</h2>
          <p><strong>FECHA:</strong> ____ / ____ / 20____</p>
          <p><strong>CIUDAD:</strong> Quibdó, Chocó</p>
          <p>Yo, <strong>___PACIENTE___</strong>, mayor de edad, identificado(a) con la cédula número <strong>___DOCUMENTO___</strong>, por medio de este documento declaro que acepto de manera voluntaria recibir atención psicológica por parte de SANATÚ SAS (NIT 902010331-8).</p>
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

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    const finalHtml = template.htmlContent
      .replace('___PACIENTE___', signedByName)
      .replace('___DOCUMENTO___', signedByDocument);

    const consentRecord = await prisma.consentRecord.create({
      data: {
        medicalRecordId,
        templateId: template.id,
        signedByName,
        signedByDocument,
        documentSnapshot: finalHtml,
        signatureBase64,
        signedFromIp: ip,
        signedUserAgent: userAgent,
      },
    });

    return NextResponse.json({
      success: true,
      consentId: consentRecord.id,
      message: 'Consentimiento guardado exitosamente',
    });
  } catch (error) {
    console.error('Error guardando consentimiento:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}