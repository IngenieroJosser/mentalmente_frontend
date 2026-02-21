'use client';

import React, { useEffect, useState, useCallback } from 'react';
import format from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';
import { startOfMonth } from 'date-fns/startOfMonth';
import { endOfMonth } from 'date-fns/endOfMonth';
import { eachDayOfInterval } from 'date-fns/eachDayOfInterval';
import { isSameMonth } from 'date-fns/isSameMonth';
import { isSameDay } from 'date-fns/isSameDay';
import { useAuth } from '@/context/AuthContext';
import { MedicalRecordEvent } from '@/lib/type';
import { FaCalendarAlt, FaUsers, FaUserMd, FaChartLine } from 'react-icons/fa';

const CalendarDashboardPsychologist = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<MedicalRecordEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedicalRecords = useCallback(async () => {
    if (!user || !user.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `/api/psychologist-dash?userId=${user.id}&limit=1000`
      );
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setEvents(data.data);
    } catch (err) {
      console.error('Error al obtener registros médicos:', err);
      setError('No se pudieron cargar los registros médicos. Por favor, inténtelo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMedicalRecords();
  }, [fetchMedicalRecords]);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.createdAt);
      return isSameDay(eventDate, date);
    });
  };

  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarDays = eachDayOfInterval({
      start: monthStart,
      end: monthEnd
    });
    
    // Completar con días del mes anterior para la primera semana
    const startDayIndex = monthStart.getDay();
    const prevMonthDays = [];
    for (let i = 1; i <= startDayIndex; i++) {
      const day = new Date(monthStart);
      day.setDate(day.getDate() - i);
      prevMonthDays.unshift(day);
    }
    
    // Completar con días del siguiente mes para la última semana
    const endDayIndex = monthEnd.getDay();
    const nextMonthDays = [];
    for (let i = 1; i < (7 - endDayIndex); i++) {
      const day = new Date(monthEnd);
      day.setDate(day.getDate() + i);
      nextMonthDays.push(day);
    }
    
    return [...prevMonthDays, ...calendarDays, ...nextMonthDays];
  };

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Formatear fecha para título del mes
  const monthTitle = currentDate.toLocaleString('es-ES', { 
    month: 'long', 
    year: 'numeric'
  }).replace(' de ', ' ');
  
  const capitalizedMonthTitle = monthTitle.charAt(0).toUpperCase() + monthTitle.slice(1);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#fafafa] to-[#f0f0f0] p-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#bec5a4]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 bg-[#bec5a4] rounded-full opacity-20 animate-pulse"></div>
          </div>
        </div>
        <div className="text-center mt-8">
          <h2 className="text-2xl font-light text-[#2c3e50] mb-2">Cargando calendario</h2>
          <p className="text-[#7f8c8d]">Preparando vista de citas y registros...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fafafa] to-[#f0f0f0] p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-[#bec5a4]/20">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#bec5a4] to-[#aab38c] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#2c3e50]">Error de conexión</h2>
            <p className="text-[#7f8c8d] mt-2">{error}</p>
          </div>
          <button 
            onClick={fetchMedicalRecords}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#bec5a4] to-[#aab38c] text-white font-medium rounded-xl hover:from-[#aab38c] hover:to-[#bec5a4] transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-[#bec5a4]/20"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-light text-[#2c3e50] tracking-tight">
              Calendario Clínico
            </h1>
            <p className="text-[#7f8c8d] mt-2 max-w-2xl text-sm">
              Visualiza tus sesiones y pacientes por día. Cada día muestra los pacientes atendidos con historias clínicas completadas.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="bg-white rounded-2xl px-6 py-3 shadow-sm border border-[#bec5a4]/20">
              <div className="text-xs uppercase tracking-wider text-[#7f8c8d]">Total registros</div>
              <div className="text-3xl font-light text-[#2c3e50]">{events.length}</div>
            </div>
          </div>
        </div>

        {/* Panel principal del calendario */}
        <div className="bg-white rounded-3xl shadow-xl border border-[#bec5a4]/20 overflow-hidden mb-8">
          {/* Controles del calendario */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#f9f9f9] to-[#f5f5f5] border-b border-[#bec5a4]/20">
            <button 
              onClick={goToPreviousMonth}
              className="flex items-center text-[#2c3e50] hover:text-[#bec5a4] transition-colors group"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl mr-3 group-hover:bg-[#bec5a4]/10 transition-colors border border-[#e0e0e0] group-hover:border-[#bec5a4] shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="font-medium hidden sm:inline">Mes anterior</span>
            </button>
            
            <h2 className="text-2xl md:text-3xl font-serif text-[#2c3e50]">
              {capitalizedMonthTitle}
            </h2>
            
            <button 
              onClick={goToNextMonth}
              className="flex items-center text-[#2c3e50] hover:text-[#bec5a4] transition-colors group"
            >
              <span className="font-medium hidden sm:inline">Siguiente mes</span>
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl ml-3 group-hover:bg-[#bec5a4]/10 transition-colors border border-[#e0e0e0] group-hover:border-[#bec5a4] shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          {/* Leyenda */}
          <div className="px-6 pt-4 flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#bec5a4] rounded-full mr-2"></div>
              <span className="text-[#2c3e50]">Día con pacientes</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#e0e0e0] rounded-full mr-2 border border-[#bec5a4]"></div>
              <span className="text-[#2c3e50]">Hoy</span>
            </div>
          </div>

          {/* Encabezados de días */}
          <div className="grid grid-cols-7 gap-1 px-6 pt-4">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
              <div 
                key={day} 
                className="py-2 text-center text-sm font-medium text-[#bec5a4] bg-[#f9f9f9] rounded-lg border border-[#bec5a4]/30"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Días del calendario */}
          <div className="grid grid-cols-7 gap-1 p-6">
            {generateCalendarDays().map((day, index) => {
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());
              const dayEvents = getEventsForDate(day);
              
              return (
                <div 
                  key={index}
                  className={`min-h-24 p-2 rounded-xl flex flex-col transition-all duration-200
                    ${isCurrentMonth 
                      ? 'bg-white border border-[#e0e0e0] hover:border-[#bec5a4] hover:shadow-md' 
                      : 'bg-[#f9f9f9] border border-[#eaeaea] text-[#b0b0b0]'} 
                    ${isToday ? 'border-2 border-[#bec5a4] shadow-sm' : ''}`}
                >
                  <div className={`text-right text-sm font-medium ${isToday ? 'text-[#bec5a4]' : isCurrentMonth ? 'text-[#2c3e50]' : 'text-[#b0b0b0]'}`}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="mt-1 flex-grow overflow-y-auto max-h-16 custom-scrollbar">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id} 
                        className="text-xs p-1 mb-1 rounded-md bg-[#f2f2f2] text-[#2c3e50] truncate hover:bg-[#bec5a4] hover:text-white transition-colors cursor-default"
                        title={event.patientName}
                      >
                        <div className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-[#bec5a4] rounded-full mr-1 flex-shrink-0"></div>
                          <span className="truncate">{event.patientName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-3xl shadow-sm border border-[#bec5a4]/20 p-6 flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#bec5a4]/10 to-[#aab38c]/10 rounded-xl flex items-center justify-center mr-4">
              <FaCalendarAlt className="text-xl text-[#bec5a4]" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[#95a5a6]">Total registros</div>
              <div className="text-2xl font-light text-[#2c3e50]">{events.length}</div>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-[#bec5a4]/20 p-6 flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#bec5a4]/10 to-[#aab38c]/10 rounded-xl flex items-center justify-center mr-4">
              <FaUsers className="text-xl text-[#bec5a4]" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[#95a5a6]">Pacientes únicos</div>
              <div className="text-2xl font-light text-[#2c3e50]">
                {new Set(events.map(e => e.patientName)).size}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-[#bec5a4]/20 p-6 flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#bec5a4]/10 to-[#aab38c]/10 rounded-xl flex items-center justify-center mr-4">
              <FaChartLine className="text-xl text-[#bec5a4]" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[#95a5a6]">Registros hoy</div>
              <div className="text-2xl font-light text-[#2c3e50]">
                {getEventsForDate(new Date()).length}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#bec5a4] to-[#aab38c] rounded-lg flex items-center justify-center mr-2 shadow-md">
              <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-serif text-[#2c3e50]">Mentalmente</h3>
          </div>
          <p className="text-xs text-[#95a5a6] max-w-2xl mx-auto">
            Plataforma de gestión clínica premium para profesionales de la salud mental.
          </p>
        </div>
      </div>

      {/* Estilos personalizados para scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f0f0f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #bec5a4;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #aab38c;
        }
      `}</style>
    </div>
  );
};

export default CalendarDashboardPsychologist;