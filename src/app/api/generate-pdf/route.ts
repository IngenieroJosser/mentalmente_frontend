import { NextResponse } from 'next/server';
import { PDFDocument, rgb, PDFPage } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';

export async function POST(request: Request) {
  console.log('=== INICIANDO GENERACIÓN DE PDF ===');
  console.log('URL solicitada:', request.url);
  console.log('Método:', request.method);
  
  try {
    const record = await request.json();
    console.log('✅ Datos recibidos correctamente:', {
      paciente: record.patientName,
      identificacion: record.identificationNumber,
      totalCampos: Object.keys(record).length
    });

    // Validar parámetros esenciales
    if (!record || typeof record !== 'object') {
      console.error('❌ Error: Datos de registro inválidos');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Datos de registro inválidos',
          message: 'El registro médico está vacío o no es válido'
        },
        { status: 400 }
      );
    }

    // Verificar datos mínimos requeridos
    if (!record.patientName || !record.identificationNumber) {
      console.error('❌ Error: Datos mínimos faltantes');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Datos incompletos',
          message: 'Faltan datos esenciales como nombre del paciente o número de identificación'
        },
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

    console.log('📁 Buscando archivos en:', {
      templatePath,
      fontPath,
      directorioActual: process.cwd(),
      existePublic: fs.existsSync(path.join(process.cwd(), 'public')),
      existeFiles: fs.existsSync(path.join(process.cwd(), 'public', 'files')),
      existeFonts: fs.existsSync(path.join(process.cwd(), 'public', 'fonts'))
    });

    // Verificar existencia de archivos
    if (!fs.existsSync(templatePath)) {
      console.error('❌ Error: Plantilla no encontrada en:', templatePath);
      
      // Listar archivos en el directorio files
      try {
        const filesDir = path.join(process.cwd(), 'public', 'files');
        if (fs.existsSync(filesDir)) {
          const files = fs.readdirSync(filesDir);
          console.log('Archivos disponibles en /public/files:', files);
        }
      } catch (err) {
        console.error('No se pudo leer directorio files:', err);
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Plantilla PDF no encontrada',
          message: `No se encontró el archivo: ${templatePath}`,
          solucion: 'Verifique que el archivo "Historia Clinica Psicologia MentalMente 2025.pdf" esté en /public/files/'
        },
        { status: 500 }
      );
    }

    if (!fs.existsSync(fontPath)) {
      console.error('❌ Error: Fuente no encontrada en:', fontPath);
      
      // Listar archivos en el directorio fonts
      try {
        const fontsDir = path.join(process.cwd(), 'public', 'fonts');
        if (fs.existsSync(fontsDir)) {
          const fonts = fs.readdirSync(fontsDir);
          console.log('Fuentes disponibles en /public/fonts:', fonts);
        }
      } catch (err) {
        console.error('No se pudo leer directorio fonts:', err);
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Fuente tipográfica no encontrada',
          message: `No se encontró la fuente: ${fontPath}`,
          solucion: 'Verifique que el archivo "NotoSans-Regular.ttf" esté en /public/fonts/'
        },
        { status: 500 }
      );
    }

    console.log('✅ Archivos encontrados correctamente');
    console.log(`📄 Tamaño plantilla: ${fs.statSync(templatePath).size} bytes`);
    console.log(`🔤 Tamaño fuente: ${fs.statSync(fontPath).size} bytes`);

    // Cargar archivos
    console.log('⏳ Cargando archivos...');
    const templateBytes = fs.readFileSync(templatePath);
    const fontBytes = fs.readFileSync(fontPath);
    console.log('✅ Archivos cargados');

    // Procesar PDF
    console.log('📋 Cargando PDF template...');
    const pdfDoc = await PDFDocument.load(templateBytes);
    pdfDoc.registerFontkit(fontkit);
    const pages = pdfDoc.getPages();
    console.log(`✅ Número de páginas encontradas: ${pages.length}`);
    
    if (pages.length < 3) {
      console.error(`❌ Error: PDF debe tener al menos 3 páginas, tiene ${pages.length}`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Formato de plantilla incorrecto',
          message: `La plantilla PDF debe tener 3 páginas, pero tiene ${pages.length}`
        },
        { status: 500 }
      );
    }
    
    const firstPage = pages[0];
    const secondPage = pages[1];
    const thirdPage = pages[2];
    const form = pdfDoc.getForm();
    
    console.log('✅ Páginas obtenidas correctamente');

    // Cargar fuente
    console.log('🔤 Cargando fuente...');
    const font = await pdfDoc.embedFont(fontBytes);
    const fontSize = 10;
    console.log('✅ Fuente cargada correctamente');

    console.log('🎨 Iniciando dibujo de campos...');

    // Función para dibujar texto con ajuste automático
    const drawText = (
      page: PDFPage,
      text: string | null | undefined,
      x: number,
      y: number,
      maxWidth?: number,
      lineHeight: number = fontSize * 1.2
    ) => {
      if (!text || text.trim() === '') {
        console.log(`⏭️  Campo vacío en [${x},${y}] - omitiendo`);
        return;
      }
      
      try {
        console.log(`✍️  Dibujando texto en [${x},${y}]: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
          maxWidth: maxWidth || 500,
          lineHeight,
        });
        console.log(`✅ Texto dibujado correctamente en [${x},${y}]`);
      } catch (error) {
        console.error(`❌ Error dibujando texto: "${text}" en [${x},${y}]`, error);
      }
    };

    // Función para formatear fechas
    const formatDate = (dateValue: unknown): string => {
      if (!dateValue) {
        console.log('📅 Fecha vacía - retornando vacío');
        return '';
      }
      
      try {
        let date: Date;
        
        if (typeof dateValue === 'string') {
          console.log(`📅 Procesando fecha string: "${dateValue}"`);
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
          console.log(`📅 Tipo de fecha no reconocido: ${typeof dateValue}`);
          return '';
        }

        if (isNaN(date.getTime())) {
          console.error(`❌ Fecha inválida: ${dateValue}`);
          return '';
        }
        
        const formatted = format(date, 'dd/MM/yyyy');
        console.log(`✅ Fecha formateada: "${dateValue}" -> "${formatted}"`);
        return formatted;
      } catch (error) {
        console.error('❌ Error formateando fecha:', error);
        return '';
      }
    };

    // === PÁGINA 1: INFORMACIÓN PERSONAL ===
    console.log('\n📄 === DIBUJANDO PÁGINA 1 ===');
    drawText(firstPage, record.patientName || '', 125, 698);
    
    // Tipo de identificación (usando checkboxes)
    console.log(`🔘 Tipo identificación: ${record.identificationType}`);
    if (record.identificationType === 'RC') {
      try {
        form.getCheckBox('TipoIdentificacion_RC').check();
        console.log('✅ Checkbox RC marcado');
      } catch (error) {
        console.error('❌ Error marcando checkbox RC:', error);
        drawText(firstPage, 'X', 210, 682);
      }
    } else if (record.identificationType === 'TI') {
      try {
        form.getCheckBox('TipoIdentificacion_TI').check();
        console.log('✅ Checkbox TI marcado');
      } catch (error) {
        console.error('❌ Error marcando checkbox TI:', error);
        drawText(firstPage, 'X', 245, 682);
      }
    } else if (record.identificationType === 'CC') {
      try {
        form.getCheckBox('TipoIdentificacion_CC').check();
        console.log('✅ Checkbox CC marcado');
      } catch (error) {
        console.error('❌ Error marcando checkbox CC:', error);
        drawText(firstPage, 'X', 280, 682);
      }
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
    
    // Estado EPS (usando checkboxes)
    console.log(`🔘 Es beneficiario: ${record.isBeneficiary}`);
    if (record.isBeneficiary) {
      try {
        form.getCheckBox('Beneficiario_Si').check();
        console.log('✅ Checkbox Beneficiario Sí marcado');
      } catch (error) {
        console.error('❌ Error marcando checkbox Beneficiario Sí:', error);
        drawText(firstPage, 'X', 220, 532);
      }
    } else {
      try {
        form.getCheckBox('Beneficiario_No').check();
        console.log('✅ Checkbox Beneficiario No marcado');
      } catch (error) {
        console.error('❌ Error marcando checkbox Beneficiario No:', error);
        drawText(firstPage, 'X', 165, 532);
      }
    }
    
    drawText(firstPage, record.referredBy || '', 125, 517);
    
    // Responsables
    console.log('\n👤 RESPONSABLES:');
    drawText(firstPage, record.guardian1Name || '', 125, 487);
    drawText(firstPage, record.guardian1Relationship || '', 330, 487);
    drawText(firstPage, record.guardian1Phone || '', 415, 487);
    drawText(firstPage, record.guardian1Occupation || '', 125, 472);
    
    drawText(firstPage, record.guardian2Name || '', 125, 452);
    drawText(firstPage, record.guardian2Relationship || '', 330, 452);
    drawText(firstPage, record.guardian2Phone || '', 415, 452);
    drawText(firstPage, record.guardian2Occupation || '', 125, 437);
    
    // Profesional
    console.log('\n👨‍⚕️ PROFESIONAL:');
    drawText(firstPage, record.attendedBy || '', 125, 407);
    drawText(firstPage, record.licenseNumber || '', 330, 407);
    
    // Antecedentes personales (texto largo)
    console.log('\n📝 ANTECEDENTES PERSONALES:');
    drawText(firstPage, record.personalPathological || '', 125, 377, 300);
    drawText(firstPage, record.personalSurgical || '', 125, 362, 300);
    drawText(firstPage, record.personalPsychopathological || '', 125, 347, 300);
    drawText(firstPage, record.traumaHistory || '', 125, 332, 300);
    drawText(firstPage, record.sleepStatus || '', 125, 317, 300);
    drawText(firstPage, record.substanceUse || '', 125, 302, 300);
    drawText(firstPage, record.personalOther || '', 125, 287, 300);
    
    // Antecedentes familiares (texto largo)
    console.log('\n👨‍👩‍👧‍👦 ANTECEDENTES FAMILIARES:');
    drawText(firstPage, record.familyPathological || '', 125, 257, 300);
    drawText(firstPage, record.familySurgical || '', 125, 242, 300);
    drawText(firstPage, record.familyPsychopathological || '', 125, 227, 300);
    drawText(firstPage, record.familyTraumatic || '', 125, 212, 300);
    drawText(firstPage, record.familySubstanceUse || '', 125, 197, 300);
    drawText(firstPage, record.familyOther || '', 125, 182, 300);
    
    // Desarrollo (texto largo)
    console.log('\n👶 DESARROLLO:');
    drawText(firstPage, record.pregnancyInfo || '', 125, 152, 300);
    drawText(firstPage, record.deliveryInfo || '', 125, 137, 300);
    drawText(firstPage, record.psychomotorDevelopment || '', 125, 122, 300);
    drawText(firstPage, record.familyDynamics || '', 125, 107, 300);
    
    // === PÁGINA 2: INFORMACIÓN CLÍNICA ===
    console.log('\n📄 === DIBUJANDO PÁGINA 2 ===');
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
    console.log('\n📄 === DIBUJANDO PÁGINA 3 ===');
    drawText(thirdPage, record.patientName || '', 50, 698);
    drawText(thirdPage, record.recordNumber || '', 200, 698);
    drawText(thirdPage, record.evolution || '', 50, 668, 500, fontSize * 1.5);

    // Generar PDF
    console.log('\n💾 Guardando PDF...');
    const pdfBytes = await pdfDoc.save();
    console.log(`✅ PDF generado. Tamaño bytes: ${pdfBytes.length}`);
    
    // Crear respuesta - convertir Uint8Array a Buffer para NextResponse
    const pdfBuffer = Buffer.from(pdfBytes);
    
    console.log(`\n✅✅✅ PDF GENERADO EXITOSAMENTE`);
    console.log(`📊 Estadísticas:`);
    console.log(`   - Tamaño final: ${pdfBuffer.length} bytes`);
    console.log(`   - Paciente: ${record.patientName}`);
    console.log(`   - ID: ${record.identificationNumber}`);
    console.log(`   - Nombre archivo: Historia_Clinica_${record.identificationNumber || 'sin_numero'}.pdf`);
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        // Cambiado de 'attachment' a 'inline' para evitar IDM
        'Content-Disposition': `inline; filename="Historia_Clinica_${record.identificationNumber || 'sin_numero'}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Content-Type-Options': 'nosniff',
        'X-Download-Options': 'noopen'
      },
    });

  } catch (error: unknown) {
    console.error('\n❌❌❌ === ERROR CRÍTICO ===');
    console.error('Error al generar PDF:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Detalles del error:', {
      message: errorMessage,
      stack: errorStack?.split('\n').slice(0, 5).join('\n')
    });
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor',
        message: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache'
        }
      }
    );
  } finally {
    console.log('\n🏁 === FIN DE PROCESO GENERACIÓN PDF ===\n');
  }
}