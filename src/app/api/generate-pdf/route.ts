import { NextResponse } from 'next/server';
import { PDFDocument, rgb, PDFPage } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';

function hexToRgb(hex: string) {
  const sanitized = hex.replace('#', '');
  const r = parseInt(sanitized.substring(0, 2), 16) / 255;
  const g = parseInt(sanitized.substring(2, 4), 16) / 255;
  const b = parseInt(sanitized.substring(4, 6), 16) / 255;
  return { r, g, b };
}

const PRIMARY_COLOR = hexToRgb('#bec5a4');
const SECONDARY_COLOR = hexToRgb('#f2f2f2');
const BLACK = hexToRgb('#000000');

export async function POST(request: Request) {
  console.log('=== INICIANDO GENERACIÓN DE PDF ===');
  
  try {
    const record = await request.json();
    console.log('✅ Datos recibidos:', { paciente: record.patientName, identificacion: record.identificationNumber });

    // Validaciones básicas
    if (!record || typeof record !== 'object') {
      return NextResponse.json({ success: false, error: 'Datos inválidos' }, { status: 400 });
    }
    if (!record.patientName || !record.identificationNumber) {
      return NextResponse.json({ success: false, error: 'Datos incompletos' }, { status: 400 });
    }

    // Rutas de archivos
    const templatePath = path.join(process.cwd(), 'public', 'files', 'Historia Clinica Psicologia MentalMente 2025.pdf');
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'NotoSans-Regular.ttf');

    console.log('📁 Verificando archivos...');
    if (!fs.existsSync(templatePath)) {
      console.error('❌ Plantilla no encontrada');
      return NextResponse.json({ success: false, error: 'Plantilla PDF no encontrada' }, { status: 500 });
    }
    if (!fs.existsSync(fontPath)) {
      console.error('❌ Fuente no encontrada');
      return NextResponse.json({ success: false, error: 'Fuente no encontrada' }, { status: 500 });
    }

    const templateBytes = fs.readFileSync(templatePath);
    const fontBytes = fs.readFileSync(fontPath);

    console.log('📋 Cargando PDF...');
    const pdfDoc = await PDFDocument.load(templateBytes);
    pdfDoc.registerFontkit(fontkit);
    const pages = pdfDoc.getPages();
    if (pages.length < 3) {
      return NextResponse.json({ success: false, error: 'PDF debe tener al menos 3 páginas' }, { status: 500 });
    }
    const [firstPage, secondPage, thirdPage] = pages;
    const form = pdfDoc.getForm();

    console.log('🔤 Cargando fuente...');
    const font = await pdfDoc.embedFont(fontBytes);
    const fontSize = 10;

    // Funciones auxiliares
    const drawText = (page: PDFPage, text: string | null | undefined, x: number, y: number, maxWidth?: number, lineHeight = fontSize * 1.2, color = PRIMARY_COLOR) => {
      if (!text || text.trim() === '') return;
      try {
        page.drawText(text, { x, y, size: fontSize, font, color: rgb(color.r, color.g, color.b), maxWidth: maxWidth || 500, lineHeight });
      } catch (error) {
        console.error(`Error dibujando texto en [${x},${y}]:`, error);
      }
    };

    const drawLine = (page: PDFPage, x1: number, y1: number, x2: number, y2: number, thickness = 1) => {
      try {
        page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness, color: rgb(SECONDARY_COLOR.r, SECONDARY_COLOR.g, SECONDARY_COLOR.b) });
      } catch (error) {
        console.error('Error dibujando línea:', error);
      }
    };

    const formatDate = (dateValue: unknown): string => {
      if (!dateValue) return '';
      try {
        let date: Date;
        if (typeof dateValue === 'string') {
          if (dateValue.includes('T')) date = parseISO(dateValue);
          else if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) date = new Date(dateValue);
          else if (/^\d+$/.test(dateValue)) date = new Date(parseInt(dateValue));
          else date = new Date(dateValue);
        } else if (dateValue instanceof Date) date = dateValue;
        else if (typeof dateValue === 'number') date = new Date(dateValue);
        else return '';
        if (isNaN(date.getTime())) return '';
        return format(date, 'dd/MM/yyyy');
      } catch {
        return '';
      }
    };

    const safeCheckBox = (name: string, shouldCheck: boolean) => {
      try {
        const checkbox = form.getCheckBox(name);
        if (shouldCheck) checkbox.check();
      } catch (error) {
        console.error(`Checkbox ${name} no encontrado:`, error);
      }
    };

    // === PÁGINA 1 ===
    console.log('📄 Dibujando página 1...');
    const baseY = 720;
    drawText(firstPage, 'SANATÚ SAS', 50, baseY, undefined, undefined, BLACK);
    drawText(firstPage, 'NIT 902010331-8', 50, baseY - 15, undefined, undefined, BLACK);
    drawText(firstPage, 'Tel: 3113266223', 50, baseY - 30, undefined, undefined, BLACK);
    drawText(firstPage, 'Liyiveth Quintero García', 50, baseY - 45, undefined, undefined, BLACK);
    drawText(firstPage, 'Psicóloga - TP No. 229742', 50, baseY - 60, undefined, undefined, BLACK);
    drawLine(firstPage, 50, baseY - 70, 550, baseY - 70, 1);

    drawText(firstPage, record.patientName || '', 125, 698);
    safeCheckBox('TipoIdentificacion_RC', record.identificationType === 'RC');
    safeCheckBox('TipoIdentificacion_TI', record.identificationType === 'TI');
    safeCheckBox('TipoIdentificacion_CC', record.identificationType === 'CC');
    drawText(firstPage, record.identificationNumber || '', 330, 682);
    drawText(firstPage, record.age?.toString() || '', 415, 682);
    drawText(firstPage, formatDate(record.birthDate) || '', 125, 667);
    drawText(firstPage, record.educationLevel || '', 330, 667);
    drawText(firstPage, record.occupation || '', 125, 652);
    drawText(firstPage, record.birthPlace || '', 330, 652);
    drawText(firstPage, record.nationality || '', 125, 637);
    drawText(firstPage, record.religion || '', 330, 637);
    drawText(firstPage, record.address || '', 125, 622);
    drawText(firstPage, record.neighborhood || '', 125, 607);
    drawText(firstPage, record.city || '', 200, 607);
    drawText(firstPage, record.state || '', 275, 607);
    drawText(firstPage, formatDate(record.admissionDate) || '', 125, 592);
    drawText(firstPage, record.cellPhone || '', 125, 577);
    drawText(firstPage, record.phone || '', 200, 577);
    drawText(firstPage, record.email || '', 125, 562);
    drawText(firstPage, record.eps || '', 125, 547);
    safeCheckBox('Beneficiario_Si', record.isBeneficiary === true);
    safeCheckBox('Beneficiario_No', record.isBeneficiary === false);
    drawText(firstPage, record.referredBy || '', 125, 517);
    drawLine(firstPage, 50, 500, 550, 500, 0.5);

    drawText(firstPage, record.guardian1Name || '', 125, 487);
    drawText(firstPage, record.guardian1Relationship || '', 330, 487);
    drawText(firstPage, record.guardian1Phone || '', 415, 487);
    drawText(firstPage, record.guardian1Occupation || '', 125, 472);
    drawText(firstPage, record.guardian2Name || '', 125, 452);
    drawText(firstPage, record.guardian2Relationship || '', 330, 452);
    drawText(firstPage, record.guardian2Phone || '', 415, 452);
    drawText(firstPage, record.guardian2Occupation || '', 125, 437);
    drawText(firstPage, record.attendedBy || '', 125, 407);
    drawText(firstPage, record.licenseNumber || '', 330, 407);

    drawText(firstPage, record.personalPathological || '', 125, 377, 300);
    drawText(firstPage, record.personalSurgical || '', 125, 362, 300);
    drawText(firstPage, record.personalPsychopathological || '', 125, 347, 300);
    drawText(firstPage, record.traumaHistory || '', 125, 332, 300);
    drawText(firstPage, record.sleepStatus || '', 125, 317, 300);
    drawText(firstPage, record.substanceUse || '', 125, 302, 300);
    drawText(firstPage, record.personalOther || '', 125, 287, 300);
    drawText(firstPage, record.familyPathological || '', 125, 257, 300);
    drawText(firstPage, record.familySurgical || '', 125, 242, 300);
    drawText(firstPage, record.familyPsychopathological || '', 125, 227, 300);
    drawText(firstPage, record.familyTraumatic || '', 125, 212, 300);
    drawText(firstPage, record.familySubstanceUse || '', 125, 197, 300);
    drawText(firstPage, record.familyOther || '', 125, 182, 300);
    drawText(firstPage, record.pregnancyInfo || '', 125, 152, 300);
    drawText(firstPage, record.deliveryInfo || '', 125, 137, 300);
    drawText(firstPage, record.psychomotorDevelopment || '', 125, 122, 300);
    drawText(firstPage, record.familyDynamics || '', 125, 107, 300);

    // === PÁGINA 2 ===
    console.log('📄 Dibujando página 2...');
    drawText(secondPage, record.consultationReason || '', 50, 698, 500);
    drawText(secondPage, record.problemHistory || '', 50, 668, 500);
    drawText(secondPage, record.therapyExpectations || '', 50, 638, 500);
    drawText(secondPage, record.mentalExam || '', 50, 608, 500);
    drawText(secondPage, record.psychologicalAssessment || '', 50, 578, 500);
    drawText(secondPage, record.diagnosis || '', 50, 548, 500);
    drawText(secondPage, record.therapeuticGoals || '', 50, 518, 500);
    drawText(secondPage, record.treatmentPlan || '', 50, 488, 500);
    drawText(secondPage, record.referralInfo || '', 50, 458, 500);
    drawText(secondPage, record.recommendations || '', 50, 428, 500);
    drawLine(secondPage, 50, 400, 550, 400, 0.5);

    // === PÁGINA 3 ===
    console.log('📄 Dibujando página 3...');
    drawText(thirdPage, record.patientName || '', 50, 698);
    drawText(thirdPage, record.recordNumber || '', 200, 698);
    drawText(thirdPage, record.evolution || '', 50, 668, 500, fontSize * 1.5);

    // Guardar PDF
    console.log('💾 Guardando PDF...');
    let pdfBytes: Uint8Array;
    try {
      pdfBytes = await pdfDoc.save();
    } catch (saveError) {
      console.error('❌ Error al guardar PDF:', saveError);
      return NextResponse.json({ success: false, error: 'Error al generar el PDF' }, { status: 500 });
    }
    console.log(`✅ PDF generado, tamaño: ${pdfBytes.length} bytes`);

    if (!pdfBytes || pdfBytes.length === 0) {
      console.error('❌ PDF vacío');
      return NextResponse.json({ success: false, error: 'PDF vacío' }, { status: 500 });
    }

    const pdfBuffer = Buffer.from(pdfBytes);
    console.log('📦 Enviando PDF...');

    // Devolver como Response estándar
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Historia_Clinica_${record.identificationNumber || 'sin_numero'}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('❌ Error general:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Error interno' },
      { status: 500 }
    );
  } finally {
    console.log('=== FIN GENERACIÓN PDF ===');
  }
}