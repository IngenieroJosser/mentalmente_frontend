'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  FaChartLine, FaUserFriends, FaUsers, FaCalendarAlt, FaHeartbeat, 
  FaBrain, FaVenusMars, FaFileMedical
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
            borderColor: '#bec5a4',
            backgroundColor: 'rgba(190, 197, 164, 0.1)',
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#bec5a4',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
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
              'rgba(190, 197, 164, 0.8)',
              'rgba(160, 170, 140, 0.8)',
              'rgba(140, 150, 120, 0.8)',
              'rgba(120, 130, 100, 0.8)'
            ],
            borderColor: [
              '#ffffff',
              '#ffffff',
              '#ffffff',
              '#ffffff'
            ],
            borderWidth: 2,
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
              'rgba(190, 197, 164, 0.8)',
              'rgba(160, 170, 140, 0.8)',
              'rgba(140, 150, 120, 0.8)',
              'rgba(120, 130, 100, 0.8)',
              'rgba(100, 110, 90, 0.8)'
            ],
            borderColor: [
              '#ffffff',
              '#ffffff',
              '#ffffff',
              '#ffffff',
              '#ffffff'
            ],
            borderWidth: 2,
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
              'rgba(160, 170, 140, 0.8)',
              'rgba(190, 197, 164, 0.8)',
              'rgba(120, 130, 100, 0.8)'
            ],
            borderColor: [
              '#ffffff',
              '#ffffff',
              '#ffffff'
            ],
            borderWidth: 2,
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
            backgroundColor: 'rgba(190, 197, 164, 0.8)',
            borderColor: '#ffffff',
            borderWidth: 2,
          }
        ]
      }
    };
  };

  const chartData = prepareChartData();

  // CORREGIDO: let -> const
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#4a5568',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          }
        }
      },
      title: {
        display: true,
        color: '#2d3748',
        font: {
          family: 'Inter, sans-serif',
          size: 14,
          // CORREGIDO: weight: 500 (sin aserción)
          weight: 500,
        },
        padding: {
          bottom: 20,
        }
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#2d3748',
        bodyColor: '#4a5568',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#718096',
          font: {
            family: 'Inter, sans-serif',
            size: 11,
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      y: {
        ticks: {
          color: '#718096',
          font: {
            family: 'Inter, sans-serif',
            size: 11,
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fafafa] to-[#f0f0f0] flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#bec5a4] border-t-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-[#bec5a4] rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
          <h2 className="mt-4 text-xl font-light text-[#2d3748]">Generando reportes</h2>
          <p className="text-sm text-[#718096]">Analizando los datos para transformar vidas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fafafa] to-[#f0f0f0] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-[#bec5a4]/20">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#bec5a4] to-[#aab38c] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#2d3748] mb-2">Error de conexión</h2>
            <p className="text-[#718096] mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-gradient-to-r from-[#bec5a4] to-[#aab38c] text-white rounded-xl hover:from-[#aab38c] hover:to-[#bec5a4] transition-all shadow-md shadow-[#bec5a4]/30"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] to-[#f0f0f0] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#2d3748] tracking-tight">
              Reportes Clínicos
            </h1>
            <p className="text-[#718096] mt-2 max-w-2xl">
              Estadísticas avanzadas para medir nuestro impacto en la transformación de vidas.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-white p-1 rounded-xl shadow-sm border border-[#bec5a4]/20">
            <button 
              onClick={() => setTimeRange('3m')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === '3m' 
                  ? 'bg-[#bec5a4] text-white shadow-sm' 
                  : 'text-[#718096] hover:text-[#2d3748] hover:bg-[#f2f2f2]'
              }`}
            >
              3 meses
            </button>
            <button 
              onClick={() => setTimeRange('6m')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === '6m' 
                  ? 'bg-[#bec5a4] text-white shadow-sm' 
                  : 'text-[#718096] hover:text-[#2d3748] hover:bg-[#f2f2f2]'
              }`}
            >
              6 meses
            </button>
            <button 
              onClick={() => setTimeRange('1y')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === '1y' 
                  ? 'bg-[#bec5a4] text-white shadow-sm' 
                  : 'text-[#718096] hover:text-[#2d3748] hover:bg-[#f2f2f2]'
              }`}
            >
              1 año
            </button>
          </div>
        </div>
        
        {/* Tarjetas de estadísticas resumidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-[#bec5a4]/20 p-5 flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#bec5a4]/10 to-[#aab38c]/10 rounded-xl flex items-center justify-center mr-4">
              <FaUsers className="text-xl text-[#bec5a4]" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[#a0aec0]">Pacientes atendidos</div>
              <div className="text-2xl font-light text-[#2d3748]">{summaryData.totalPatients}</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-[#bec5a4]/20 p-5 flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#bec5a4]/10 to-[#aab38c]/10 rounded-xl flex items-center justify-center mr-4">
              <FaFileMedical className="text-xl text-[#bec5a4]" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[#a0aec0]">Sesiones realizadas</div>
              <div className="text-2xl font-light text-[#2d3748]">{summaryData.totalSessions}</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-[#bec5a4]/20 p-5 flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#bec5a4]/10 to-[#aab38c]/10 rounded-xl flex items-center justify-center mr-4">
              <FaHeartbeat className="text-xl text-[#bec5a4]" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[#a0aec0]">Satisfacción</div>
              <div className="text-2xl font-light text-[#2d3748]">{summaryData.satisfactionRate.toFixed(1)}%</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-[#bec5a4]/20 p-5 flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#bec5a4]/10 to-[#aab38c]/10 rounded-xl flex items-center justify-center mr-4">
              <FaUserFriends className="text-xl text-[#bec5a4]" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[#a0aec0]">Beneficiarios</div>
              <div className="text-2xl font-light text-[#2d3748]">{summaryData.beneficiaryRatio.toFixed(1)}%</div>
            </div>
          </div>
        </div>
        
        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Evolución de pacientes */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#bec5a4]/20 p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#bec5a4]/10 to-[#aab38c]/10 rounded-lg flex items-center justify-center mr-3">
                <FaChartLine className="text-[#bec5a4]" />
              </div>
              <h3 className="text-lg font-medium text-[#2d3748]">Evolución Mensual de Pacientes</h3>
            </div>
            <div className="h-72">
              <Line data={chartData.patientsData} options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: 'Crecimiento en la atención psicológica'
                  }
                }
              }} />
            </div>
          </div>
          
          {/* Tipos de terapia */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#bec5a4]/20 p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#bec5a4]/10 to-[#aab38c]/10 rounded-lg flex items-center justify-center mr-3">
                <FaUserFriends className="text-[#bec5a4]" />
              </div>
              <h3 className="text-lg font-medium text-[#2d3748]">Tipos de Terapia</h3>
            </div>
            <div className="h-72">
              <Pie data={chartData.therapyTypeData} options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: 'Modalidades de atención'
                  }
                }
              }} />
            </div>
          </div>
          
          {/* Diagnósticos principales */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#bec5a4]/20 p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#bec5a4]/10 to-[#aab38c]/10 rounded-lg flex items-center justify-center mr-3">
                <FaBrain className="text-[#bec5a4]" />
              </div>
              <h3 className="text-lg font-medium text-[#2d3748]">Diagnósticos Frecuentes</h3>
            </div>
            <div className="h-72">
              <Bar data={chartData.diagnosisData} options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: 'Principales condiciones atendidas'
                  }
                }
              }} />
            </div>
          </div>
          
          {/* Distribución por género */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#bec5a4]/20 p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#bec5a4]/10 to-[#aab38c]/10 rounded-lg flex items-center justify-center mr-3">
                <FaVenusMars className="text-[#bec5a4]" />
              </div>
              <h3 className="text-lg font-medium text-[#2d3748]">Distribución por Género</h3>
            </div>
            <div className="h-72">
              <Pie data={chartData.genderData} options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: 'Diversidad en la atención'
                  }
                }
              }} />
            </div>
          </div>
          
          {/* Distribución por edad */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#bec5a4]/20 p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#bec5a4]/10 to-[#aab38c]/10 rounded-lg flex items-center justify-center mr-3">
                <FaCalendarAlt className="text-[#bec5a4]" />
              </div>
              <h3 className="text-lg font-medium text-[#2d3748]">Rangos de Edad</h3>
            </div>
            <div className="h-72">
              <Bar data={chartData.ageData} options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: 'Pacientes por grupo etario'
                  }
                }
              }} />
            </div>
          </div>
          
          {/* Tasa de satisfacción */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#bec5a4]/20 p-6 flex flex-col justify-center">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#bec5a4]/10 to-[#aab38c]/10 rounded-lg flex items-center justify-center mr-3">
                <FaHeartbeat className="text-[#bec5a4]" />
              </div>
              <h3 className="text-lg font-medium text-[#2d3748]">Satisfacción de Pacientes</h3>
            </div>
            <div className="text-center">
              <div className="radial-progress text-[#bec5a4] mx-auto" 
                style={{ 
                  '--value': summaryData.satisfactionRate, 
                  '--size': '10rem',
                  '--thickness': '0.8rem'
                } as React.CSSProperties}>
                <span className="text-2xl font-light text-[#2d3748]">
                  {summaryData.satisfactionRate.toFixed(1)}%
                </span>
              </div>
              <p className="text-sm text-[#718096] mt-4 max-w-xs mx-auto">
                Nuestros pacientes reportan altos niveles de satisfacción con la atención recibida.
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center py-6 border-t border-[#bec5a4]/20">
          <div className="flex items-center justify-center mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#bec5a4] to-[#aab38c] rounded-lg flex items-center justify-center mr-2 shadow-sm">
              <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-lg font-serif text-[#2d3748]">SanaTú Guingar</span>
          </div>
          <p className="text-xs text-[#a0aec0]">Transformando la atención psicológica con estándares de calidad y ética.</p>
          <p className="text-xs text-[#a0aec0] mt-1">© {new Date().getFullYear()} SanaTú Quingar. Todos los derechos reservados.</p>
        </div>
      </div>
      
      {/* Estilos para el radial progress */}
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
            radial-gradient(closest-side, white 80%, transparent 81% 100%),
            conic-gradient(#bec5a4 calc(var(--value) * 1%), #eaeef2 0);
        }
      `}</style>
    </div>
  );
};

export default ReportDashboardPsychologist;