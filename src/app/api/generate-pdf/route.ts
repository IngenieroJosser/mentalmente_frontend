import { NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';

export async function POST(request: Request) {
  try {
    const record = await request.json();

    // Validar parámetros esenciales
    if (!record || typeof record !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Datos de registro inválidos' },
        { status: 400 }
      );
    }

    // Definir rutas de archivos
    const templatePath = path.join(
      process.cwd(),
      'public',
      'files',
      'Historia Clinica Psicologia MentalMente 2025.pdf'
    );
    
    const fontPath = path.join(
      process.cwd(),
      'public',
      'fonts',
      'NotoSans-Regular.ttf'
    );

    // Verificar existencia de archivos
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Plantilla PDF no encontrada',
          path: templatePath
        },
        { status: 500 }
      );
    }

    if (!fs.existsSync(fontPath)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Fuente tipográfica no encontrada',
          path: fontPath
        },
        { status: 500 }
      );
    }

    // Cargar archivos
    const templateBytes = fs.readFileSync(templatePath);
    const fontBytes = fs.readFileSync(fontPath);

    // Procesar PDF
    const pdfDoc = await PDFDocument.load(templateBytes);
    pdfDoc.registerFontkit(fontkit);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const secondPage = pages[1];
    const thirdPage = pages[2];

    // Cargar fuente
    const font = await pdfDoc.embedFont(fontBytes);
    const fontSize = 10;

    // Función para dibujar texto con ajuste automático
    const drawText = (
      page: any,
      text: string | null | undefined,
      x: number,
      y: number,
      maxWidth?: number,
      lineHeight: number = fontSize * 1.2
    ) => {
      if (!text || text.trim() === '') return;
      
      try {
        // Ajustar texto para valores cortos
        const adjustedText = text.length < 10 ? text + ' '.repeat(10 - text.length) : text;
        
        // Dibujar texto con ajuste de línea automático
        page.drawText(adjustedText, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
          maxWidth: maxWidth || 500,
          lineHeight,
        });
      } catch (error) {
        console.error(`Error dibujando texto: "${text}" en [${x},${y}]`, error);
      }
    };

    // Función para formatear fechas
    const formatDate = (dateValue: any): string => {
      if (!dateValue) return '';
      
      try {
        let date: Date;
        
        if (typeof dateValue === 'string') {
          if (dateValue.includes('T')) {
            date = parseISO(dateValue);
          } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
            date = new Date(dateValue);
          } else if (/^\d+$/.test(dateValue)) {
            date = new Date(parseInt(dateValue));
          } else {
            date = new Date(dateValue);
          }
        } else if (dateValue instanceof Date) {
          date = dateValue;
        } else if (typeof dateValue === 'number') {
          date = new Date(dateValue);
        } else {
          return '';
        }

        if (isNaN(date.getTime())) return '';
        return format(date, 'dd/MM/yyyy');
      } catch (error) {
        return '';
      }
    };

    // === PÁGINA 1: INFORMACIÓN PERSONAL ===
    // Ajuste de coordenadas para alinear con las líneas
    drawText(firstPage, record.patientName || '', 125, 698);
    
    // Tipo de identificación
    if (record.identificationType === 'RC') {
      drawText(firstPage, 'X', 210, 682);
    } else if (record.identificationType === 'TI') {
      drawText(firstPage, 'X', 245, 682);
    } else if (record.identificationType === 'CC') {
      drawText(firstPage, 'X', 280, 682);
    }
    
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
    
    // Estado EPS
    if (record.isBeneficiary) {
      drawText(firstPage, 'X', 220, 532);
    } else {
      drawText(firstPage, 'X', 165, 532);
    }
    
    drawText(firstPage, record.referredBy || '', 125, 517);
    
    // Responsables
    drawText(firstPage, record.guardian1Name || '', 125, 487);
    drawText(firstPage, record.guardian1Relationship || '', 330, 487);
    drawText(firstPage, record.guardian1Phone || '', 415, 487);
    drawText(firstPage, record.guardian1Occupation || '', 125, 472);
    
    drawText(firstPage, record.guardian2Name || '', 125, 452);
    drawText(firstPage, record.guardian2Relationship || '', 330, 452);
    drawText(firstPage, record.guardian2Phone || '', 415, 452);
    drawText(firstPage, record.guardian2Occupation || '', 125, 437);
    
    // Profesional
    drawText(firstPage, record.attendedBy || '', 125, 407);
    drawText(firstPage, record.licenseNumber || '', 330, 407);
    
    // Antecedentes personales - Añadido maxWidth para ajuste automático
    drawText(firstPage, record.personalPathological || '', 125, 377, 300);
    drawText(firstPage, record.personalSurgical || '', 125, 362, 300);
    drawText(firstPage, record.personalPsychopathological || '', 125, 347, 300);
    drawText(firstPage, record.traumaHistory || '', 125, 332, 300);
    drawText(firstPage, record.sleepStatus || '', 125, 317, 300);
    drawText(firstPage, record.substanceUse || '', 125, 302, 300);
    drawText(firstPage, record.personalOther || '', 125, 287, 300);
    
    // Antecedentes familiares
    drawText(firstPage, record.familyPathological || '', 125, 257, 300);
    drawText(firstPage, record.familySurgical || '', 125, 242, 300);
    drawText(firstPage, record.familyPsychopathological || '', 125, 227, 300);
    drawText(firstPage, record.familyTraumatic || '', 125, 212, 300);
    drawText(firstPage, record.familySubstanceUse || '', 125, 197, 300);
    drawText(firstPage, record.familyOther || '', 125, 182, 300);
    
    // Desarrollo
    drawText(firstPage, record.pregnancyInfo || '', 125, 152, 300);
    drawText(firstPage, record.deliveryInfo || '', 125, 137, 300);
    drawText(firstPage, record.psychomotorDevelopment || '', 125, 122, 300);
    drawText(firstPage, record.familyDynamics || '', 125, 107, 300);
    
    // === PÁGINA 2: INFORMACIÓN CLÍNICA ===
    // Añadido maxWidth y lineHeight para texto extenso
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
    
    // === PÁGINA 3: EVOLUCIÓN ===
    drawText(thirdPage, record.patientName || '', 50, 698);
    drawText(thirdPage, record.recordNumber || '', 200, 698);
    // Texto de evolución con ajuste automático de líneas
    drawText(thirdPage, record.evolution || '', 50, 668, 500, fontSize * 1.5);

    // Generar PDF
    const pdfBytes = await pdfDoc.save();
    
    // Crear respuesta
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=Historia_Clinica_${record.identificationNumber || 'sin_numero'}.pdf`
      },
    });

  } catch (error: any) {
    console.error('Error crítico al generar PDF:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor',
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && {
          stack: error.stack
        })
      },
      { status: 500 }
    );
  }
}