// app/api/psychologist-dash/report/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';

interface TherapyReport {
  month: string;
  patients: number;
  sessions: number;
  ageGroups: {
    '0-18': number;
    '19-30': number;
    '31-45': number;
    '46-60': number;
    '61+': number;
  };
  therapyTypes: {
    individual: number;
    couple: number;
    family: number;
    group: number;
  };
  diagnoses: {
    anxiety: number;
    depression: number;
    relationship: number;
    trauma: number;
    other: number;
  };
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  beneficiaryRatio: number;
  satisfactionRate: number;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const range = searchParams.get('range') || '6m';

    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuario es requerido' },
        { status: 400 }
      );
    }

    // Calcular rango de fechas
    const months = parseInt(range === '3m' ? '3' : range === '1y' ? '12' : '6');
    const endDate = new Date();
    const startDate = subMonths(endDate, months);
    
    // Obtener datos de historias clínicas
    const medicalRecords = await prisma.medicalRecord.findMany({
      where: {
        userId: parseInt(userId),
        admissionDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        user: true
      }
    });

    // Generar datos mensuales
    const monthlyData: TherapyReport[] = [];
    const monthRange = Array.from({ length: months }, (_, i) => subMonths(endDate, i)).reverse();

    for (const month of monthRange) {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      // Formatear el mes usando Intl.DateTimeFormat para evitar errores
      const monthLabel = new Intl.DateTimeFormat('es-ES', {
        month: 'long',
        year: 'numeric'
      }).format(month);
      
      const monthRecords = medicalRecords.filter(record => {
        // Verificar que admissionDate no sea null
        if (!record.admissionDate) return false;
        
        const admissionDate = new Date(record.admissionDate);
        return admissionDate >= monthStart && admissionDate <= monthEnd;
      });
      
      // Calcular estadísticas para el mes
      const therapyReport = {
        month: monthLabel,
        patients: monthRecords.length,
        sessions: monthRecords.length * 4, // Suponiendo 4 sesiones por paciente
        ageGroups: {
          '0-18': monthRecords.filter(r => r.age && r.age <= 18).length,
          '19-30': monthRecords.filter(r => r.age && r.age > 18 && r.age <= 30).length,
          '31-45': monthRecords.filter(r => r.age && r.age > 30 && r.age <= 45).length,
          '46-60': monthRecords.filter(r => r.age && r.age > 45 && r.age <= 60).length,
          '61+': monthRecords.filter(r => r.age && r.age > 60).length
        },
        therapyTypes: {
          individual: monthRecords.filter(r => r.consultationReason?.toLowerCase().includes('individual')).length,
          couple: monthRecords.filter(r => r.consultationReason?.toLowerCase().includes('pareja')).length,
          family: monthRecords.filter(r => r.consultationReason?.toLowerCase().includes('familiar')).length,
          group: monthRecords.filter(r => r.consultationReason?.toLowerCase().includes('grupal')).length
        },
        diagnoses: {
          anxiety: monthRecords.filter(r => r.diagnosis?.toLowerCase().includes('ansiedad')).length,
          depression: monthRecords.filter(r => r.diagnosis?.toLowerCase().includes('depresión')).length,
          relationship: monthRecords.filter(r => r.diagnosis?.toLowerCase().includes('relación') || r.diagnosis?.toLowerCase().includes('relaciones')).length,
          trauma: monthRecords.filter(r => r.diagnosis?.toLowerCase().includes('trauma')).length,
          other: monthRecords.filter(r => 
            !['ansiedad', 'depresión', 'relación', 'relaciones', 'trauma'].some(d => 
              r.diagnosis?.toLowerCase().includes(d.toLowerCase())
            )
          ).length
        },
        genderDistribution: {
          male: monthRecords.filter(r => r.user.genero === 'masculino').length,
          female: monthRecords.filter(r => r.user.genero === 'femenino').length,
          other: monthRecords.filter(r => 
            r.user.genero && !['masculino', 'femenino'].includes(r.user.genero.toLowerCase())
          ).length
        },
        beneficiaryRatio: monthRecords.length > 0 
          ? Math.round((monthRecords.filter(r => r.isBeneficiary).length / monthRecords.length) * 100) 
          : 0,
        satisfactionRate: 85 + Math.floor(Math.random() * 10) // Datos simulados
      };
      
      monthlyData.push(therapyReport);
    }

    return NextResponse.json({ data: monthlyData });
    
  } catch (error) {
    console.error('Error al generar reportes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
