'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Calendar, FileText, BarChart3, 
  Settings, LogOut, Bell, Search,
  Users, Clock, Activity, TrendingUp
} from 'lucide-react';

export default function PsychologistDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Obtener datos del usuario de ambos almacenamientos
    const userData = localStorage.getItem('sanatu_user') || sessionStorage.getItem('sanatu_user');
    const token = localStorage.getItem('sanatu_token') || sessionStorage.getItem('sanatu_token');
    
    console.log('Dashboard - Token encontrado:', !!token);
    console.log('Dashboard - UserData encontrado:', !!userData);
    
    if (!token || !userData) {
      console.log('Dashboard - Sin token o userData, redirigiendo a login');
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      console.log('Dashboard - Usuario parseado:', parsedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('sanatu_token');
    localStorage.removeItem('sanatu_user');
    sessionStorage.removeItem('sanatu_token');
    sessionStorage.removeItem('sanatu_user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bec5a4]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#bec5a4] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">ST</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">SanaTú Quingar</h1>
                  <p className="text-sm text-gray-500">Panel del Psicólogo</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar pacientes..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#bec5a4] focus:border-transparent"
                />
              </div>
              
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell size={20} className="text-gray-600" />
              </button>
              
              <div className="relative group">
                <button className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#bec5a4] rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="hidden md:inline text-sm font-medium text-gray-700">
                    {user?.usuario || 'Usuario'}
                  </span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border hidden group-hover:block z-10">
                  <div className="py-2">
                    <button 
                      onClick={() => router.push('/psychologist-dashboard/profile')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      Mi Perfil
                    </button>
                    <button 
                      onClick={() => router.push('/psychologist-dashboard/settings')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      Configuración
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#bec5a4] to-[#a0a78c] rounded-2xl p-6 text-white mb-8">
            <h2 className="text-2xl font-bold mb-2">
              ¡Bienvenido/a, {user?.usuario || 'Psicólogo'}!
            </h2>
            <p className="opacity-90">
              Hoy es {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Pacientes Activos</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
                <Users className="text-[#bec5a4]" size={24} />
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp size={16} className="mr-1" />
                  <span>+12% este mes</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Citas Hoy</p>
                  <p className="text-2xl font-bold text-gray-900">6</p>
                </div>
                <Calendar className="text-[#bec5a4]" size={24} />
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Próxima: 10:30 AM</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Horas de Terapia</p>
                  <p className="text-2xl font-bold text-gray-900">42</p>
                </div>
                <Clock className="text-[#bec5a4]" size={24} />
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-blue-600">
                  <Activity size={16} className="mr-1" />
                  <span>Este mes</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Evaluaciones Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <FileText className="text-[#bec5a4]" size={24} />
              </div>
              <div className="mt-4">
                <p className="text-sm text-amber-600">Necesitan atención</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => router.push('/psychologist-dashboard/patients')}
                    className="p-4 border rounded-lg hover:border-[#bec5a4] hover:bg-[#bec5a4]/10 transition-colors text-left"
                  >
                    <Users size={20} className="text-[#bec5a4] mb-2" />
                    <p className="font-medium text-gray-900">Gestionar Pacientes</p>
                    <p className="text-sm text-gray-500">Ver y editar pacientes</p>
                  </button>
                  
                  <button 
                    onClick={() => router.push('/psychologist-dashboard/calendar')}
                    className="p-4 border rounded-lg hover:border-[#bec5a4] hover:bg-[#bec5a4]/10 transition-colors text-left"
                  >
                    <Calendar size={20} className="text-[#bec5a4] mb-2" />
                    <p className="font-medium text-gray-900">Calendario</p>
                    <p className="text-sm text-gray-500">Gestionar citas</p>
                  </button>
                  
                  <button 
                    onClick={() => router.push('/psychologist-dashboard/records')}
                    className="p-4 border rounded-lg hover:border-[#bec5a4] hover:bg-[#bec5a4]/10 transition-colors text-left"
                  >
                    <FileText size={20} className="text-[#bec5a4] mb-2" />
                    <p className="font-medium text-gray-900">Historias Clínicas</p>
                    <p className="text-sm text-gray-500">Ver todas las historias</p>
                  </button>
                  
                  <button 
                    onClick={() => router.push('/psychologist-dashboard/reports')}
                    className="p-4 border rounded-lg hover:border-[#bec5a4] hover:bg-[#bec5a4]/10 transition-colors text-left"
                  >
                    <BarChart3 size={20} className="text-[#bec5a4] mb-2" />
                    <p className="font-medium text-gray-900">Reportes</p>
                    <p className="text-sm text-gray-500">Generar reportes</p>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Citas</h3>
              <div className="space-y-4">
                {[
                  { time: '09:00 AM', name: 'María González', type: 'Evaluación' },
                  { time: '10:30 AM', name: 'Carlos Rodríguez', type: 'Seguimiento' },
                  { time: '02:00 PM', name: 'Ana Martínez', type: 'Terapia' },
                  { time: '04:30 PM', name: 'José López', type: 'Consulta' }
                ].map((appointment, index) => (
                  <div key={index} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0 w-12 text-center">
                      <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-medium text-gray-900">{appointment.name}</p>
                      <p className="text-sm text-gray-500">{appointment.type}</p>
                    </div>
                    <button className="text-[#bec5a4] hover:text-[#a0a78c] text-sm font-medium">
                      Ver
                    </button>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => router.push('/psychologist-dashboard/calendar')}
                className="w-full mt-4 py-2 border border-[#bec5a4] text-[#bec5a4] rounded-lg hover:bg-[#bec5a4]/10 transition-colors"
              >
                Ver Calendario Completo
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
              <button className="text-[#bec5a4] hover:text-[#a0a78c] text-sm font-medium">
                Ver todo
              </button>
            </div>
            <div className="space-y-4">
              {[
                { action: 'Completó evaluación psicológica', patient: 'Laura Sánchez', time: 'Hace 2 horas' },
                { action: 'Agendó nueva cita', patient: 'Pedro Ramírez', time: 'Hace 4 horas' },
                { action: 'Actualizó historia clínica', patient: 'Sofía Vargas', time: 'Ayer' },
                { action: 'Envió reporte de progreso', patient: 'Diego Mendoza', time: 'Hace 2 días' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#bec5a4]/10 rounded-full flex items-center justify-center">
                    <Activity size={18} className="text-[#bec5a4]" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-gray-900">
                      <span className="font-medium">{activity.action}</span>
                      {' para '}
                      <span className="font-medium">{activity.patient}</span>
                    </p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} SanaTú Quingar - Panel del Psicólogo
          </p>
        </div>
      </footer>
    </div>
  );
}