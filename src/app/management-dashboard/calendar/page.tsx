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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0d1e30] to-[#1a3657] p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D4AF37] mb-6"></div>
        <div className="text-center">
          <h2 className="text-2xl font-light text-[#F0F4F8] mb-2">Cargando calendario</h2>
          <p className="text-[#A3B8CC]">Obteniendo los registros clínicos...</p>
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
            onClick={fetchMedicalRecords}
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
      {/* Encabezado premium */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 p-6 bg-[#1A2B40] rounded-2xl border border-[#2C4A6B] shadow-xl backdrop-blur-sm">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F0E68C]">
              Calendario de Historias Clínicas
            </h1>
            <p className="text-[#A3B8CC] mt-2 max-w-2xl">
              Visualización avanzada de pacientes con tecnología Mentalmente. 
              Cada día muestra los pacientes atendidos con historias clínicas completadas.
            </p>
          </div>
          
          <div className="mt-6 md:mt-0 flex items-center space-x-6">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-[#D4AF37] rounded-full mr-2 shadow-sm shadow-[#D4AF37]/50"></div>
              <span className="text-[#F0F4F8] text-sm">Paciente</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 bg-[#2C4A6B] rounded-full mr-2 border-2 border-[#D4AF37]"></div>
              <span className="text-[#F0F4F8] text-sm">Hoy</span>
            </div>
          </div>
        </div>
        
        {/* Panel principal */}
        <div className="bg-[#1A2B40] rounded-2xl border border-[#2C4A6B] shadow-2xl overflow-hidden">
          {/* Controles del calendario */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#0d1e30] to-[#1a3657]">
            <button 
              onClick={goToPreviousMonth}
              className="flex items-center text-[#F0F4F8] hover:text-[#D4AF37] transition-colors group"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-[#1A2B40] rounded-full mr-3 group-hover:bg-[#D4AF37]/10 transition-colors border border-[#2C4A6B]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="font-medium">Mes anterior</span>
            </button>
            
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F0E68C]">
              {capitalizedMonthTitle}
            </h2>
            
            <button 
              onClick={goToNextMonth}
              className="flex items-center text-[#F0F4F8] hover:text-[#D4AF37] transition-colors group"
            >
              <span className="font-medium">Siguiente mes</span>
              <div className="w-10 h-10 flex items-center justify-center bg-[#1A2B40] rounded-full ml-3 group-hover:bg-[#D4AF37]/10 transition-colors border border-[#2C4A6B]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
          
          {/* Encabezados de días */}
          <div className="grid grid-cols-7 gap-1 px-4 pt-4">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
              <div 
                key={day} 
                className="p-3 text-center font-bold text-[#D4AF37] bg-[#1A2B40] rounded-lg border border-[#2C4A6B]"
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Días del calendario */}
          <div className="grid grid-cols-7 gap-1 p-4">
            {generateCalendarDays().map((day, index) => {
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());
              const dayEvents = getEventsForDate(day);
              
              return (
                <div 
                  key={index}
                  className={`min-h-32 p-3 rounded-xl flex flex-col transition-all duration-300
                    ${isCurrentMonth 
                      ? 'bg-[#1A2B40] border border-[#2C4A6B] hover:border-[#D4AF37] hover:bg-[#1f344c] hover:shadow-lg hover:shadow-[#D4AF37]/10' 
                      : 'bg-[#152233] border border-[#243b55] text-[#5a7a9a]'} 
                    ${isToday ? 'bg-gradient-to-br from-[#1A2B40] to-[#2a4b6c] border-2 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20' : ''}`}
                >
                  <div className={`text-right font-bold text-lg ${isToday ? 'text-[#D4AF37]' : 'text-[#A3B8CC]'}`}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="mt-2 flex-grow overflow-y-auto max-h-28 custom-scrollbar">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id} 
                        className="text-xs p-2 mb-2 rounded-lg bg-gradient-to-r from-[#2a4b6c] to-[#1a3657] text-[#F0F4F8] truncate hover:from-[#D4AF37] hover:to-[#B8860B] transition-all duration-300 transform hover:scale-[1.02] group"
                        title={event.patientName}
                      >
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-[#D4AF37] rounded-full mr-2 group-hover:bg-[#1A2B40] transition-colors"></div>
                          <span className="font-medium">{event.patientName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Estadísticas premium */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#1A2B40] to-[#0d1e30] rounded-2xl border border-[#2C4A6B] p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#1A2B40] rounded-xl flex items-center justify-center mr-4 border border-[#2C4A6B]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[#A3B8CC] text-sm uppercase tracking-wider">Total de registros</h3>
                <p className="text-3xl font-bold text-[#F0F4F8] mt-1">{events.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#1A2B40] to-[#0d1e30] rounded-2xl border border-[#2C4A6B] p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#1A2B40] rounded-xl flex items-center justify-center mr-4 border border-[#2C4A6B]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[#A3B8CC] text-sm uppercase tracking-wider">Pacientes únicos</h3>
                <p className="text-3xl font-bold text-[#F0F4F8] mt-1">
                  {new Set(events.map(e => e.patientName)).size}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#1A2B40] to-[#0d1e30] rounded-2xl border border-[#2C4A6B] p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#1A2B40] rounded-xl flex items-center justify-center mr-4 border border-[#2C4A6B]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[#A3B8CC] text-sm uppercase tracking-wider">Registros hoy</h3>
                <p className="text-3xl font-bold text-[#F0F4F8] mt-1">
                  {getEventsForDate(new Date()).length}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pie de página premium */}
        <div className="mt-10 text-center py-6 border-t border-[#2C4A6B]/30">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0d1e30]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F0E68C]">
              Mentalmente - Transformando la atención psicológica.
            </h3>
          </div>
          <p className="text-[#A3B8CC] max-w-2xl mx-auto">
            Plataforma de gestión clínica premium para profesionales de la salud mental. 
          </p>
        </div>
      </div>
      
      {/* Estilos personalizados para la barra de desplazamiento */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1A2B40;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2C4A6B;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D4AF37;
        }
      `}</style>
    </div>
  );
};

export default CalendarDashboardPsychologist;