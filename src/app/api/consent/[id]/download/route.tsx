// src/app/api/consent/[id]/download/route.tsx
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { renderToBuffer } from '@react-pdf/renderer';
import ConsentPDF from '@/components/ConsentPDF';

// Definimos el tipo localmente para evitar dependencias circulares
interface ConsentPDFData {
  id: number;
  signedByName: string;
  signedByDocument: string;
  documentSnapshot: string;
  signatureBase64: string | null;
  signedAt: string; // debe ser string, no Date
  medicalRecord: {
    patientName: string;
    identificationNumber: string;
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const consentId = Number(params.id);

    if (!consentId || isNaN(consentId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const consent = await prisma.consentRecord.findUnique({
      where: { id: consentId },
      include: {
        medicalRecord: true,
        template: true,
      },
    });

    if (!consent) {
      return NextResponse.json(
        { error: 'Consentimiento no encontrado' },
        { status: 404 }
      );
    }

    // Convertir el objeto de Prisma al formato esperado por el componente
    const consentData: ConsentPDFData = {
      id: consent.id,
      signedByName: consent.signedByName,
      signedByDocument: consent.signedByDocument,
      documentSnapshot: consent.documentSnapshot,
      signatureBase64: consent.signatureBase64,
      signedAt: consent.signedAt.toISOString(), // Convertir Date a string
      medicalRecord: {
        patientName: consent.medicalRecord.patientName,
        identificationNumber: consent.medicalRecord.identificationNumber,
      },
    };

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    let pdfBuffer: Buffer;

    try {
      pdfBuffer = await renderToBuffer(
        <ConsentPDF consent={consentData} baseUrl={baseUrl} />
      );
    } catch (renderError) {
      console.error('Error renderizando PDF:', renderError);
      return NextResponse.json(
        { error: 'Error al generar el PDF' },
        { status: 500 }
      );
    }

    if (!pdfBuffer || pdfBuffer.length === 0) {
      console.error('PDF vacío');
      return NextResponse.json(
        { error: 'PDF generado vacío' },
        { status: 500 }
      );
    }

    // Validación básica de cabecera PDF
    const headerCheck = pdfBuffer.toString('utf-8', 0, 5);
    if (!headerCheck.startsWith('%PDF-')) {
      console.error('El archivo generado no es un PDF válido');
      return NextResponse.json(
        { error: 'Archivo PDF corrupto' },
        { status: 500 }
      );
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="consentimiento_${consentId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error general generando PDF:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}