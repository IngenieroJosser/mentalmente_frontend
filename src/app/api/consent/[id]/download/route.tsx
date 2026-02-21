import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { renderToBuffer } from '@react-pdf/renderer';
import ConsentPDF from '@/components/ConsentPDF';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const consentId = parseInt(params.id);
    if (isNaN(consentId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const consent = await prisma.consentRecord.findUnique({
      where: { id: consentId },
      include: {
        medicalRecord: true,
        template: true,
      },
    });

    if (!consent) {
      return NextResponse.json({ error: 'Consentimiento no encontrado' }, { status: 404 });
    }

    const protocol = req.nextUrl.protocol;
    const host = req.nextUrl.host;
    const baseUrl = `${protocol}//${host}`;

    console.log('Generando PDF para consentimiento ID:', consentId);
    console.log('Paciente:', consent.medicalRecord.patientName);
    console.log('Tamaño documentSnapshot:', consent.documentSnapshot?.length);
    console.log('Tiene firma:', !!consent.signatureBase64);

    let pdfBuffer;
    try {
      pdfBuffer = await renderToBuffer(
        <ConsentPDF consent={consent} baseUrl={baseUrl} />
      );
    } catch (renderError) {
      console.error('Error en renderToBuffer:', renderError);
      return NextResponse.json(
        { error: 'Error al generar el PDF', details: renderError instanceof Error ? renderError.message : String(renderError) },
        { status: 500 }
      );
    }

    if (!pdfBuffer || pdfBuffer.length === 0) {
      console.error('El buffer del PDF está vacío');
      return NextResponse.json(
        { error: 'El PDF generado está vacío' },
        { status: 500 }
      );
    }

    console.log('PDF generado, tamaño:', pdfBuffer.length);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="consentimiento_${consentId}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error general:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}