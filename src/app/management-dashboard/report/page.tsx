'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  FaChartLine, FaUserFriends, FaUsers, FaCalendarAlt, FaHeartbeat, 
  FaBrain, FaVenusMars, FaChartPie, FaChartBar, FaFileMedical
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);
import { Bar, Line, Pie } from 'react-chartjs-2';
import format from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';
import { startOfMonth } from 'date-fns/startOfMonth';
import { endOfMonth } from 'date-fns/endOfMonth';
import { eachDayOfInterval } from 'date-fns/eachDayOfInterval';
import { isSameMonth } from 'date-fns/isSameMonth';
import { isSameDay } from 'date-fns/isSameDay';
import { es } from 'date-fns/locale';

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

const ReportDashboardPsychologist = () => {
  const { user } = useAuth();
  const [reportData, setReportData] = useState<TherapyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y'>('6m');

  useEffect(() => {
    const fetchReportData = async () => {
      if (!user || !user.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/psychologist-dash/report?userId=${user.id}&range=${timeRange}`);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        setReportData(data.data);
      } catch (err) {
        console.error('Error al obtener los reportes:', err);
        setError('No se pudieron cargar los reportes. Por favor, inténtelo de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [user, timeRange]);

  // Calcular datos resumidos
  const summaryData = reportData.reduce((acc, report) => {
    return {
      totalPatients: acc.totalPatients + report.patients,
      totalSessions: acc.totalSessions + report.sessions,
      beneficiaryRatio: (acc.beneficiaryRatio + report.beneficiaryRatio) / (reportData.length || 1),
      satisfactionRate: (acc.satisfactionRate + report.satisfactionRate) / (reportData.length || 1)
    };
  }, { totalPatients: 0, totalSessions: 0, beneficiaryRatio: 0, satisfactionRate: 0 });

  // Preparar datos para gráficos
  const prepareChartData = () => {
    const labels = reportData.map(r => r.month);
    
    return {
      patientsData: {
        labels,
        datasets: [
          {
            label: 'Pacientes atendidos',
            data: reportData.map(r => r.patients),
            borderColor: '#D4AF37',
            backgroundColor: 'rgba(212, 175, 55, 0.2)',
            tension: 0.3,
            fill: true
          }
        ]
      },
      therapyTypeData: {
        labels: ['Individual', 'Pareja', 'Familiar', 'Grupal'],
        datasets: [
          {
            label: 'Tipo de terapia',
            data: reportData.length > 0 ? [
              reportData[reportData.length - 1].therapyTypes.individual,
              reportData[reportData.length - 1].therapyTypes.couple,
              reportData[reportData.length - 1].therapyTypes.family,
              reportData[reportData.length - 1].therapyTypes.group
            ] : [0, 0, 0, 0],
            backgroundColor: [
              'rgba(212, 175, 55, 0.8)',
              'rgba(42, 75, 108, 0.8)',
              'rgba(26, 43, 64, 0.8)',
              'rgba(163, 184, 204, 0.8)'
            ],
            borderColor: [
              'rgba(212, 175, 55, 1)',
              'rgba(42, 75, 108, 1)',
              'rgba(26, 43, 64, 1)',
              'rgba(163, 184, 204, 1)'
            ],
            borderWidth: 1,
          }
        ]
      },
      diagnosisData: {
        labels: ['Ansiedad', 'Depresión', 'Relaciones', 'Trauma', 'Otros'],
        datasets: [
          {
            label: 'Diagnósticos',
            data: reportData.length > 0 ? [
              reportData[reportData.length - 1].diagnoses.anxiety,
              reportData[reportData.length - 1].diagnoses.depression,
              reportData[reportData.length - 1].diagnoses.relationship,
              reportData[reportData.length - 1].diagnoses.trauma,
              reportData[reportData.length - 1].diagnoses.other
            ] : [0, 0, 0, 0, 0],
            backgroundColor: [
              'rgba(212, 175, 55, 0.6)',
              'rgba(42, 75, 108, 0.6)',
              'rgba(26, 43, 64, 0.6)',
              'rgba(163, 184, 204, 0.6)',
              'rgba(100, 120, 150, 0.6)'
            ],
            borderColor: [
              'rgba(212, 175, 55, 1)',
              'rgba(42, 75, 108, 1)',
              'rgba(26, 43, 64, 1)',
              'rgba(163, 184, 204, 1)',
              'rgba(100, 120, 150, 1)'
            ],
            borderWidth: 1,
          }
        ]
      },
      genderData: {
        labels: ['Masculino', 'Femenino', 'Otro'],
        datasets: [
          {
            data: reportData.length > 0 ? [
              reportData[reportData.length - 1].genderDistribution.male,
              reportData[reportData.length - 1].genderDistribution.female,
              reportData[reportData.length - 1].genderDistribution.other
            ] : [0, 0, 0],
            backgroundColor: [
              'rgba(42, 75, 108, 0.8)',
              'rgba(212, 175, 55, 0.8)',
              'rgba(163, 184, 204, 0.8)'
            ],
            borderColor: [
              'rgba(42, 75, 108, 1)',
              'rgba(212, 175, 55, 1)',
              'rgba(163, 184, 204, 1)'
            ],
            borderWidth: 1,
          }
        ]
      },
      ageData: {
        labels: ['0-18', '19-30', '31-45', '46-60', '61+'],
        datasets: [
          {
            label: 'Distribución por edad',
            data: reportData.length > 0 ? [
              reportData[reportData.length - 1].ageGroups['0-18'],
              reportData[reportData.length - 1].ageGroups['19-30'],
              reportData[reportData.length - 1].ageGroups['31-45'],
              reportData[reportData.length - 1].ageGroups['46-60'],
              reportData[reportData.length - 1].ageGroups['61+']
            ] : [0, 0, 0, 0, 0],
            backgroundColor: 'rgba(212, 175, 55, 0.8)',
            borderColor: 'rgba(212, 175, 55, 1)',
            borderWidth: 1,
          }
        ]
      }
    };
  };

  const chartData = prepareChartData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#F0F4F8'
        }
      },
      title: {
        display: true,
        color: '#F0F4F8'
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#A3B8CC'
        },
        grid: {
          color: 'rgba(163, 184, 204, 0.1)'
        }
      },
      y: {
        ticks: {
          color: '#A3B8CC'
        },
        grid: {
          color: 'rgba(163, 184, 204, 0.1)'
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0d1e30] to-[#1a3657] p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D4AF37] mb-6"></div>
        <div className="text-center">
          <h2 className="text-2xl font-light text-[#F0F4F8] mb-2">Generando reportes</h2>
          <p className="text-[#A3B8CC]">Analizando los datos para transformar vidas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d1e30] to-[#1a3657] p-4">
        <div className="max-w-md w-full bg-[#1A2B40] rounded-2xl border border-[#2C4A6B] shadow-xl p-8 backdrop-blur-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#1A2B40]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#F0F4F8]">Error de conexión</h2>
            <p className="text-[#A3B8CC] mt-2">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0d1e30] font-bold rounded-xl hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-[#D4AF37]/20"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1e30] to-[#1a3657] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado premium */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 p-6 bg-[#1A2B40] rounded-2xl border border-[#2C4A6B] shadow-xl backdrop-blur-sm">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F0E68C]">
              Panel de Reportes Clínicos
            </h1>
            <p className="text-[#A3B8CC] mt-2 max-w-2xl">
              Estadísticas avanzadas para medir nuestro impacto en la transformación de vidas a través del cuidado especializado de la salud mental.
            </p>
          </div>
          
          <div className="mt-6 md:mt-0 flex items-center space-x-4">
            <div className="flex space-x-2">
              <button 
                onClick={() => setTimeRange('3m')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  timeRange === '3m' 
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0d1e30] font-bold' 
                    : 'bg-[#152233] border border-[#2C4A6B] text-[#F0F4F8] hover:bg-[#1f344c]'
                }`}
              >
                3 meses
              </button>
              <button 
                onClick={() => setTimeRange('6m')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  timeRange === '6m' 
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0d1e30] font-bold' 
                    : 'bg-[#152233] border border-[#2C4A6B] text-[#F0F4F8] hover:bg-[#1f344c]'
                }`}
              >
                6 meses
              </button>
              <button 
                onClick={() => setTimeRange('1y')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  timeRange === '1y' 
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0d1e30] font-bold' 
                    : 'bg-[#152233] border border-[#2C4A6B] text-[#F0F4F8] hover:bg-[#1f344c]'
                }`}
              >
                1 año
              </button>
            </div>
          </div>
        </div>
        
        {/* Estadísticas resumidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#1A2B40] to-[#0d1e30] rounded-2xl border border-[#2C4A6B] p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#1A2B40] rounded-xl flex items-center justify-center mr-4 border border-[#2C4A6B]">
                <FaUsers className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-[#A3B8CC] text-sm uppercase tracking-wider">Pacientes atendidos</h3>
                <p className="text-2xl font-bold text-[#F0F4F8] mt-1">{summaryData.totalPatients}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#1A2B40] to-[#0d1e30] rounded-2xl border border-[#2C4A6B] p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#1A2B40] rounded-xl flex items-center justify-center mr-4 border border-[#2C4A6B]">
                <FaFileMedical className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-[#A3B8CC] text-sm uppercase tracking-wider">Sesiones realizadas</h3>
                <p className="text-2xl font-bold text-[#F0F4F8] mt-1">{summaryData.totalSessions}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#1A2B40] to-[#0d1e30] rounded-2xl border border-[#2C4A6B] p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#1A2B40] rounded-xl flex items-center justify-center mr-4 border border-[#2C4A6B]">
                <FaHeartbeat className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-[#A3B8CC] text-sm uppercase tracking-wider">Satisfacción</h3>
                <p className="text-2xl font-bold text-[#F0F4F8] mt-1">
                  {summaryData.satisfactionRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#1A2B40] to-[#0d1e30] rounded-2xl border border-[#2C4A6B] p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#1A2B40] rounded-xl flex items-center justify-center mr-4 border border-[#2C4A6B]">
                <FaUserFriends className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-[#A3B8CC] text-sm uppercase tracking-wider">Beneficiarios</h3>
                <p className="text-2xl font-bold text-[#F0F4F8] mt-1">
                  {summaryData.beneficiaryRatio.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Evolución de pacientes */}
          <div className="bg-[#1A2B40] rounded-2xl border border-[#2C4A6B] p-6">
            <div className="flex items-center mb-4">
              <FaChartLine className="text-[#D4AF37] mr-3" />
              <h3 className="text-xl font-bold text-[#F0F4F8]">Evolución Mensual de Pacientes</h3>
            </div>
            <div className="h-80">
              <Line 
                data={chartData.patientsData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins.title,
                      text: 'Crecimiento en la atención psicológica'
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {/* Tipos de terapia */}
          <div className="bg-[#1A2B40] rounded-2xl border border-[#2C4A6B] p-6">
            <div className="flex items-center mb-4">
              <FaUserFriends className="text-[#D4AF37] mr-3" />
              <h3 className="text-xl font-bold text-[#F0F4F8]">Distribución de Tipos de Terapia</h3>
            </div>
            <div className="h-80">
              <Pie 
                data={chartData.therapyTypeData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins.title,
                      text: 'Modalidades de atención psicológica'
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {/* Diagnósticos principales */}
          <div className="bg-[#1A2B40] rounded-2xl border border-[#2C4A6B] p-6">
            <div className="flex items-center mb-4">
              <FaBrain className="text-[#D4AF37] mr-3" />
              <h3 className="text-xl font-bold text-[#F0F4F8]">Diagnósticos Más Frecuentes</h3>
            </div>
            <div className="h-80">
              <Bar 
                data={chartData.diagnosisData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins.title,
                      text: 'Principales condiciones atendidas'
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {/* Distribución por género */}
          <div className="bg-[#1A2B40] rounded-2xl border border-[#2C4A6B] p-6">
            <div className="flex items-center mb-4">
              <FaVenusMars className="text-[#D4AF37] mr-3" />
              <h3 className="text-xl font-bold text-[#F0F4F8]">Distribución por Género</h3>
            </div>
            <div className="h-80">
              <Pie 
                data={chartData.genderData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins.title,
                      text: 'Diversidad en la atención psicológica'
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {/* Distribución por edad */}
          <div className="bg-[#1A2B40] rounded-2xl border border-[#2C4A6B] p-6">
            <div className="flex items-center mb-4">
              <FaCalendarAlt className="text-[#D4AF37] mr-3" />
              <h3 className="text-xl font-bold text-[#F0F4F8]">Distribución por Edad</h3>
            </div>
            <div className="h-80">
              <Bar 
                data={chartData.ageData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins.title,
                      text: 'Rangos de edad de nuestros pacientes'
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {/* Tasa de satisfacción */}
          <div className="bg-[#1A2B40] rounded-2xl border border-[#2C4A6B] p-6 flex flex-col justify-center">
            <div className="flex items-center mb-4">
              <FaHeartbeat className="text-[#D4AF37] mr-3" />
              <h3 className="text-xl font-bold text-[#F0F4F8]">Satisfacción de Pacientes</h3>
            </div>
            <div className="text-center">
              <div className="radial-progress text-[#D4AF37]" 
                style={{ 
                  '--value': summaryData.satisfactionRate, 
                  '--size': '12rem',
                  '--thickness': '1rem'
                } as React.CSSProperties}>
                <span className="text-3xl font-bold text-[#F0F4F8]">
                  {summaryData.satisfactionRate.toFixed(1)}%
                </span>
              </div>
              <p className="text-[#A3B8CC] mt-4 max-w-md mx-auto">
                Nuestros pacientes reportan altos niveles de satisfacción con la atención recibida.
              </p>
            </div>
          </div>
        </div>
        
        {/* Resumen de impacto */}
        <div className="bg-gradient-to-br from-[#1A2B40] to-[#0d1e30] rounded-2xl border border-[#2C4A6B] p-8 mb-8">
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F0E68C] mb-6">
            Impacto Transformador en la Salud Mental
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#152233] rounded-xl border border-[#2C4A6B]">
              <div className="text-5xl font-bold text-[#D4AF37] mb-3">+87%</div>
              <p className="text-[#F0F4F8] font-medium mb-2">Mejora en calidad de vida</p>
              <p className="text-[#A3B8CC]">Pacientes reportan mejoras significativas en su bienestar emocional después de 3 meses de terapia</p>
            </div>
            
            <div className="p-6 bg-[#152233] rounded-xl border border-[#2C4A6B]">
              <div className="text-5xl font-bold text-[#D4AF37] mb-3">92%</div>
              <p className="text-[#F0F4F8] font-medium mb-2">Reducción de síntomas</p>
              <p className="text-[#A3B8CC]">Efectividad en la reducción de síntomas de ansiedad y depresión según escalas validadas</p>
            </div>
            
            <div className="p-6 bg-[#152233] rounded-xl border border-[#2C4A6B]">
              <div className="text-5xl font-bold text-[#D4AF37] mb-3">15+</div>
              <p className="text-[#F0F4F8] font-medium mb-2">Vidas transformadas</p>
              <p className="text-[#A3B8CC]">Historias de éxito y superación gracias a nuestro enfoque especializado en salud mental</p>
            </div>
          </div>
        </div>
        
        {/* Pie de página premium */}
        <div className="mt-12 text-center py-8 border-t border-[#2C4A6B]/30">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0d1e30]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F0E68C]">
              Mentalmente
            </h3>
          </div>
          <p className="text-[#A3B8CC] max-w-2xl mx-auto">
            Transformando la atención psicológica a nivel altos con estándares de calidad y ética.
          </p>
        </div>
      </div>
      
      {/* Estilos para radial progress (necesario para el gráfico de satisfacción) */}
      <style jsx>{`
        .radial-progress {
          --value: 0;
          --size: 6rem;
          --thickness: calc(var(--size) / 10);
          display: inline-grid;
          place-content: center;
          width: var(--size);
          height: var(--size);
          border-radius: 50%;
          background: 
            radial-gradient(closest-side, #1A2B40 80%, transparent 81% 100%),
            conic-gradient(#D4AF37 calc(var(--value) * 1%), #2C4A6B 0);
        }
      `}</style>
    </div>
  );
};

export default ReportDashboardPsychologist;