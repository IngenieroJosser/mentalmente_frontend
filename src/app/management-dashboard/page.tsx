'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Search, 
  PlusCircle,
  ChevronDown,
  Edit,
  LayoutGrid,
  List,
  Filter,
  Download,
  Printer,
  Calendar,
  Settings,
  LogOut,
  Bell,
  Menu,
  Trash2,
  Home,
  Brain,
} from 'lucide-react';
import { templates, filters } from '@/lib/constants';
import { MedicalRecordWithUser } from '@/lib/type';
import HistoryForm from '@/components/HistoryForm';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import MedicalRecordDetailsModal from '@/components/MedicalRecordDetailsModal';
import Link from 'next/link';

const DashboardManagementMentalmentePage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clinicalHistories, setClinicalHistories] = useState<MedicalRecordWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingHistory, setEditingHistory] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecordWithUser | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const limit = 9;

  // Obtener datos de autenticación
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Función para traducir roles
  const translateRole = useCallback((role: string) => {
    if (!role) return 'Usuario';
    switch(role.toUpperCase()) {
      case 'MANAGEMENT':
        return 'Gestión/Administración';
      case 'PSYCHOLOGIST':
        return 'Psicólogo/a';
      case 'USER':
        return 'Recepción';
      default:
        return role;
    }
  }, []);

  const fetchHistories = async (
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Promise<{
    data: MedicalRecordWithUser[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    try {
      const response = await fetch(
        `/api/medical-records?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&fields=patientName,cedula,user.usuario`
      );

      if (!response.ok) {
        throw new Error('Error al cargar historias clínicas');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en fetchHistories:', error);
      throw error;
    }
  };

  const loadHistories = useCallback(async () => {
    if (!authChecked && !isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const result = await fetchHistories(currentPage, limit, searchTerm);
      setClinicalHistories(result.data);
      setTotalRecords(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error cargando historias:', error);
      setClinicalHistories([]);
      
      // Definir un tipo para errores con mensaje
      interface ErrorWithMessage {
        message: string;
      }
      
      const err = error as ErrorWithMessage;
      
      // Si hay error de autenticación, redirigir al login
      if (err.message && (err.message.includes('401') || err.message.includes('403'))) { 
        router.push('/login'); 
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, searchTerm, authChecked, isAuthenticated, router]);

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('sanatu_token') || sessionStorage.getItem('sanatu_token');
      const userData = localStorage.getItem('sanatu_user') || sessionStorage.getItem('sanatu_user');
      
      console.log('Auth check - Token:', token ? 'Presente' : 'Ausente');
      console.log('Auth check - User data:', userData ? 'Presente' : 'Ausente');
      
      if (!token || !userData) {
        console.log('No autenticado, redirigiendo a /login');
        router.push('/login');
        return false;
      }
      
      setAuthChecked(true);
      return true;
    };

    if (!authChecked) {
      const isAuthValid = checkAuth();
      if (!isAuthValid) {
        return;
      }
    }

    // Si está autenticado, cargar historias
    if (authChecked || isAuthenticated) {
      loadHistories();
    }
  }, [authChecked, isAuthenticated, router, loadHistories]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta historia clínica?')) {
      try {
        const token = localStorage.getItem('sanatu_token') || sessionStorage.getItem('sanatu_token');
        
        const response = await fetch(`/api/medical-records?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al eliminar la historia');
        }

        loadHistories(); // Actualiza la lista después de eliminar
      } catch (error) {
        console.error('Error eliminando historia:', error);
        alert('No se pudo eliminar la historia clínica. Inténtalo de nuevo más tarde.');
      }
    }
  };

  const handleViewDetails = (record: MedicalRecordWithUser) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const formatDate = useCallback((dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Verificar autenticación antes de renderizar
  if (!authChecked && !isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bec5a4]"></div>
      </div>
    );
  }

  // Si no está autenticado después de verificar, mostrar mensaje
  if (!isAuthenticated && authChecked) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-700 mb-4">No tienes acceso a esta página</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-[#bec5a4] text-white px-4 py-2 rounded-lg"
          >
            Ir al login
          </button>
        </div>
      </div>
    );
  }

  // Obtener usuario de localStorage como fallback
  const getUserData = () => {
    if (authUser) return authUser;
    
    try {
      const userData = localStorage.getItem('sanatu_user') || sessionStorage.getItem('sanatu_user');
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    
    return null;
  };

  const user = getUserData();

  // Definir rutas para cada módulo
  const menuItems = [
    { id: 'dashboard', icon: <Home size={18} />, label: 'Dashboard', path: '/management-dashboard' },
    { id: 'calendar', icon: <Calendar size={18} />, label: 'Calendario', path: '/management-dashboard/calendar' },
  ];

  return (
    <div className="flex h-screen bg-gray-50" role="application">
      {/* Sidebar - Mobile */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[rgba(0,0,0,0.2)] backdrop-blur-md" onClick={() => setIsMenuOpen(false)}>
          <div className="w-64 h-full bg-gradient-to-b from-[#bec5a4] to-[#a0a78c] text-white" onClick={e => e.stopPropagation()}>
            <div className="p-5 flex items-center justify-between border-b border-white/20">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold">SanaTú</h1>
                  <p className="text-xs text-white/80">Quingar</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="text-white text-xl"
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>
            
            <nav className="py-5">
              <ul>
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.path}
                      className={`w-full flex items-center space-x-3 px-5 py-3 transition-colors ${
                        pathname === item.path
                          ? 'bg-white/10 border-l-4 border-white'
                          : 'hover:bg-white/5'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-gradient-to-b from-[#bec5a4] to-[#a0a78c] text-white flex-col">
        <div className="p-5 flex items-center space-x-3 border-b border-white/20">
          <div className="flex items-center justify-center">
            <div className="bg-white/20 p-3 rounded-xl flex items-center justify-center border border-white/30">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-lg">SanaTú</h1>
            <p className="text-sm text-white/80">Quingar</p>
          </div>
        </div>
        
        <nav className="flex-1 py-5">
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.path}
                  className={`w-full flex items-center space-x-3 px-5 py-3 transition-colors ${
                    pathname === item.path
                      ? 'bg-white/10 border-l-4 border-white'
                      : 'hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span className="text-white">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-5 border-t border-white/20">
          <div className="flex items-center space-x-3 w-full text-left p-3 bg-white/10 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <span className="text-[#bec5a4] font-bold">
                {user?.usuario?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-white">{user?.usuario || 'Usuario'}</p>
              <p className="text-xs text-white/80">
                {translateRole(user?.role || '')}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden mr-3 text-gray-700"
              aria-label='Menú'
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800 hidden md:inline-block">
              Panel de Administración - SanaTú Quingar
            </h1>
          </div>
          
          <div className="relative flex-1 max-w-xl mx-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Buscar historias, pacientes, plantillas..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bec5a4]/50 focus:border-[#bec5a4] outline-none transition-all text-gray-800 bg-white"
              value={searchTerm}
              onChange={handleSearch}
              aria-label="Buscar historias clínicas"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 rounded-full hover:bg-gray-100 relative"
              aria-label="Notificaciones"
            >
              <Bell size={20} className="text-gray-700" />
              <span className="absolute top-1 right-1 bg-[#bec5a4] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2"
                aria-label="Perfil de usuario"
              >
                <div className="w-8 h-8 rounded-full bg-[#bec5a4] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.usuario?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="hidden md:inline text-sm font-medium text-gray-800">
                  {user?.usuario ? user.usuario.split(' ')[0] : 'Usuario'}
                </span>
                <ChevronDown size={16} className="text-gray-600" />
              </button>
              
              {/* Profile Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 top-12 mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-semibold text-gray-800">{user?.usuario || 'Usuario'}</p>
                    <p className="text-sm text-gray-700">
                      {translateRole(user?.role || '')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{user?.correo}</p>
                  </div>
                  <div className="py-2">
                    <button 
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-gray-800"
                      onClick={() => router.push('/management-dashboard/settings')}
                    >
                      <Settings size={16} className="mr-2 text-gray-700" /> Configuración
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-gray-800"
                    >
                      <LogOut size={16} className="mr-2 text-gray-700" /> Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content - Clinical History Dashboard */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f8fafc]">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#bec5a4] to-[#a0a78c] rounded-2xl text-white p-8 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  ¡Bienvenido, {user?.usuario || 'Administrador'}! 👋
                </h2>
                <p className="text-white/90 max-w-2xl">
                  Panel de administración del sistema SanaTú Quingar. 
                  Gestiona usuarios, historias clínicas y configuraciones del sistema.
                </p>
              </div>
            </div>
          </div>

          {/* Header and Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Gestión de Historias Clínicas</h1>
              <p className="text-gray-700">Optimiza tu tiempo con nuestro sistema digital</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center hover:border-[#bec5a4] hover:text-[#bec5a4] transition-colors"
                aria-label="Filtros"
              >
                <Filter size={16} className="mr-2" />
                Filtros
              </button>
              <button 
                className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center hover:border-[#bec5a4] hover:text-[#bec5a4] transition-colors"
                aria-label="Exportar datos"
              >
                <Download size={16} className="mr-2" />
                Exportar
              </button>
              <button 
                onClick={() => {
                  setEditingHistory(null);
                  setShowForm(true);
                }}
                className="bg-[#bec5a4] hover:bg-[#a0a78c] text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                aria-label="Crear nueva historia clínica"
              >
                <PlusCircle size={16} className="mr-2" />
                Nueva Historia
              </button>
            </div>
          </div>

          {/* Filters and View Controls */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {filters.map(filter => (
                  <button
                    key={filter.id}
                    className={`px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-[#bec5a4]/20 hover:text-[#bec5a4] transition-colors`}
                    aria-label={`Filtro: ${filter.name}`}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">Vista:</span>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#bec5a4] text-white' : 'bg-gray-100 text-gray-700 hover:bg-[#bec5a4]/20 hover:text-[#bec5a4]'}`}
                  aria-label="Vista de cuadrícula"
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#bec5a4] text-white' : 'bg-gray-100 text-gray-700 hover:bg-[#bec5a4]/20 hover:text-[#bec5a4]'}`}
                  aria-label="Vista de lista"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Clinical Histories List */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bec5a4]"></div>
            </div>
          ) : clinicalHistories.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-700">No se encontraron historias clínicas</p>
              <button 
                onClick={() => setShowForm(true)}
                className="mt-4 bg-[#bec5a4] hover:bg-[#a0a78c] text-white px-4 py-2 rounded-lg flex items-center mx-auto"
              >
                <PlusCircle size={16} className="mr-2" />
                Crear primera historia
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {clinicalHistories.map(history => (
                <div key={history.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{history.patientName}</h3>
                        <div className="mt-2 text-sm text-gray-700">
                          <span className="font-medium">Atendido por:</span> {history.user?.usuario || 'Sin asignar'}
                        </div>
                      </div>
                      <div className="relative">
                        <button 
                          className="text-gray-500 hover:text-[#bec5a4]"
                          aria-label="Opciones"
                        >
                          <ChevronDown size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Última actualización:</span>
                      <span className="font-medium text-gray-800">{formatDate(history.updatedAt.toString())}</span>
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <button 
                        onClick={() => handleViewDetails(history)}
                        className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg"
                        aria-label="Ver detalles"
                      >
                        Ver detalles
                      </button>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setEditingHistory(history.id);
                            setShowForm(true);
                          }}
                          className="text-sm bg-[#bec5a4] hover:bg-[#a0a78c] text-white px-3 py-1.5 rounded-lg flex items-center"
                          aria-label="Editar historia"
                        >
                          <Edit size={14} className="mr-1" /> Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(history.id)}
                          className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg flex items-center"
                          aria-label="Eliminar historia"
                        >
                          <Trash2 size={14} className="mr-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800">Paciente</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800">Terapeuta</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800">Última Actualización</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clinicalHistories.map(history => (
                    <tr key={history.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{history.patientName}</div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-800">
                        {history.user?.usuario || 'Sin asignar'}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-800">{formatDate(history.updatedAt.toString())}</td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewDetails(history)}
                            className="p-1.5 text-gray-600 hover:text-[#bec5a4]" 
                            aria-label="Ver detalles"
                          >
                            <FileText size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              setEditingHistory(history.id);
                              setShowForm(true);
                            }}
                            className="p-1.5 text-gray-600 hover:text-[#bec5a4]" 
                            aria-label="Editar historia"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(history.id)}
                            className="p-1.5 text-gray-600 hover:text-red-600" 
                            aria-label="Eliminar historia"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button 
                            className="p-1.5 text-gray-600 hover:text-[#bec5a4]" 
                            aria-label="Imprimir historia"
                          >
                            <Printer size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {clinicalHistories.length > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-700">
                Mostrando {(currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, totalRecords)} de {totalRecords} registros
              </div>
              <div className="flex space-x-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-[#bec5a4] text-white hover:bg-[#a0a78c]'}`}
                  aria-label="Página anterior"
                >
                  Anterior
                </button>
                <span className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-800">
                  Página {currentPage} de {totalPages}
                </span>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-[#bec5a4] text-white hover:bg-[#a0a78c]'}`}
                  aria-label="Página siguiente"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {/* Templates Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-semibold text-lg text-gray-800">Plantillas de Historias Clínicas</h2>
              <button 
                className="text-sm text-[#bec5a4] hover:text-[#a0a78c] font-medium transition-colors"
                aria-label="Ver todas las plantillas"
              >
                Ver todas
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {templates.map(template => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#bec5a4] transition-colors">
                  <div className="bg-[#bec5a4]/10 p-3 rounded-lg mb-3 inline-block">
                    <FileText size={24} className="text-[#bec5a4]" />
                  </div>
                  <h3 className="font-bold mb-1 text-lg text-gray-800">{template.name}</h3>
                  <p className="text-sm text-gray-700">{template.category}</p>
                  <button 
                    className="mt-3 text-sm w-full bg-[#bec5a4] hover:bg-[#a0a78c] text-white py-1.5 rounded-lg transition-colors"
                    aria-label={`Usar plantilla ${template.name}`}
                  >
                    Usar plantilla
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Form Modal */}
      {showForm && (
        <HistoryForm
          historyId={editingHistory || undefined}
          onSuccess={() => {
            setShowForm(false);
            loadHistories();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedRecord && (
        <MedicalRecordDetailsModal 
          record={selectedRecord} 
          onClose={() => setShowDetailsModal(false)} 
        />
      )}
    </div>
  );
};

export default DashboardManagementMentalmentePage;