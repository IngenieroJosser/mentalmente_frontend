'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  User, 
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
  BarChart2,
  Settings,
  LogOut,
  Bell,
  Menu,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import Image from 'next/image';
import { templates, filters } from '@/lib/constants';
import { MedicalRecordWithUser } from '@/lib/type';
import HistoryForm from '@/components/HistoryForm';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import MedicalRecordDetailsModal from '@/components/MedicalRecordDetailsModal';

const DashboardReceptionMentalmentePage = () => {
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
  const limit = 9;
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { 
      id: 'patients', 
      icon: <User size={18} />, 
      label: 'Pacientes', 
      href: '/reception-dashboard/patient' 
    },
    { 
      id: 'calendar', 
      icon: <Calendar size={18} />, 
      label: 'Calendario', 
      href: '/reception-dashboard/calendar' 
    },
    { 
      id: 'reports', 
      icon: <BarChart2 size={18} />, 
      label: 'Reportes', 
      href: '/reception-dashboard/report' 
    },
    { 
      id: 'consents', 
      icon: <FileText size={18} />, 
      label: 'Consentimientos', 
      href: '/reception-dashboard/consent' 
    },
  ];

  const activeSection = menuItems.find(item => pathname.includes(item.id))?.id || '';

  const translateRole = (role: string) => {
    switch(role.toUpperCase()) {
      case 'MANAGEMENT':
        return 'Gestión';
      case 'PSYCHOLOGIST':
        return 'Psicólogo';
      case 'USER':
        return 'Recepción';
      default:
        return role;
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const fetchHistories = useCallback(async (
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Promise<{
    data: MedicalRecordWithUser[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await fetch(
      `/api/medical-records?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    );
    
    if (!response.ok) {
      throw new Error('Error al cargar historias clínicas');
    }
    
    return response.json();
  }, []);

  const loadHistories = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const result = await fetchHistories(currentPage, limit, searchTerm);
      setClinicalHistories(result.data);
      setTotalRecords(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error cargando historias:', error);
      setClinicalHistories([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, isAuthenticated, fetchHistories]);

  useEffect(() => {
    loadHistories();
  }, [loadHistories]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleViewDetails = (record: MedicalRecordWithUser) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#f2f2f2] to-[#e5e5e5]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#bec5a4]"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#f2f2f2] to-[#e8e8e8]">
      {/* Sidebar Mobile */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
          <div className="w-72 h-full bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10">
                  <Image
                    src="/logo-sana-tu.png"
                    alt="SanaTú Quingar"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="font-bold text-gray-800">SanaTú Quingar</h1>
                  <p className="text-xs text-gray-500">Historias Clínicas</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <nav className="py-6">
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => { 
                        router.push(item.href);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-6 py-3 transition-all ${
                        activeSection === item.id
                          ? 'bg-[#bec5a4]/10 text-[#bec5a4] border-l-4 border-[#bec5a4]'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-[#bec5a4]'
                      }`}
                    >
                      <span className={activeSection === item.id ? 'text-[#bec5a4]' : 'text-gray-400'}>{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-72 bg-white shadow-xl flex-col">
        <div className="p-8 flex flex-col items-center border-b border-gray-100">
          <div className="relative w-20 h-20 mb-4">
            <Image
              src="/logo-sana-tu.png"
              alt="SanaTú Quingar"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-xl font-bold text-gray-800">SanaTú Quingar</h1>
          <p className="text-sm text-gray-500 mt-1">Historias Clínicas Digitales</p>
        </div>
        
        <nav className="flex-1 py-8 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-[#bec5a4] to-[#aab38c] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#bec5a4]'
                  }`}
                >
                  <span className={activeSection === item.id ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-6 border-t border-gray-100">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-3 w-full p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
          >
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#bec5a4] to-[#8f9f7a] flex items-center justify-center text-white font-bold text-lg">
              {user?.usuario?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-800 group-hover:text-[#bec5a4] transition-colors">{user?.usuario || 'Usuario'}</p>
              <p className="text-xs text-gray-500">{translateRole(user?.role || '')}</p>
            </div>
            <ChevronDown size={16} className="text-gray-400 group-hover:text-[#bec5a4]" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden mr-3 text-gray-600 hover:text-[#bec5a4] transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800 hidden md:inline-block">Panel de Recepción</h1>
          </div>
          
          <div className="relative flex-1 max-w-xl mx-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar pacientes, historias..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#bec5a4]/30 focus:border-[#bec5a4] outline-none transition-all bg-white/50 backdrop-blur-sm"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 relative transition-colors"
            >
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 bg-[#bec5a4] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </button>
            
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2"
            >
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[#bec5a4] to-[#8f9f7a] flex items-center justify-center text-white font-bold">
                {user?.usuario?.charAt(0).toUpperCase() || 'U'}
              </div>
            </button>
          </div>
          
          {/* Profile Menu */}
          {isProfileOpen && (
            <div className="absolute right-4 top-16 mt-2 w-64 bg-white shadow-xl rounded-2xl border border-gray-100 z-10 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-[#f2f2f2] to-white">
                <p className="font-semibold text-gray-800">{user?.usuario || 'Usuario'}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {translateRole(user?.role || '')}
                </p>
              </div>
              <div className="py-2">
                <button 
                  className="w-full text-left px-5 py-3 hover:bg-gray-50 flex items-center text-gray-600 hover:text-[#bec5a4] transition-colors"
                >
                  <Settings size={16} className="mr-3 text-gray-400" /> Configuración
                </button>
                <button 
                  onClick={() => logout()}
                  className="w-full text-left px-5 py-3 hover:bg-gray-50 flex items-center text-gray-600 hover:text-red-500 transition-colors"
                >
                  <LogOut size={16} className="mr-3 text-gray-400" /> Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-light text-gray-800 mb-2">Historias Clínicas</h1>
                <p className="text-gray-500">Gestione los registros de sus pacientes de manera eficiente</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button 
                  className="bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl flex items-center hover:border-[#bec5a4] hover:text-[#bec5a4] transition-all shadow-sm"
                >
                  <Filter size={16} className="mr-2" />
                  Filtros
                </button>
                <button 
                  className="bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl flex items-center hover:border-[#bec5a4] hover:text-[#bec5a4] transition-all shadow-sm"
                >
                  <Download size={16} className="mr-2" />
                  Exportar
                </button>
                <button 
                  onClick={() => {
                    setEditingHistory(null);
                    setShowForm(true);
                  }}
                  className="bg-gradient-to-r from-[#bec5a4] to-[#aab38c] text-white px-5 py-2.5 rounded-xl flex items-center hover:shadow-lg hover:scale-[1.02] transition-all shadow-md"
                >
                  <PlusCircle size={16} className="mr-2" />
                  Nueva Historia
                </button>
              </div>
            </div>

            {/* Filters and View Controls */}
            <div className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-gray-200/50 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  {filters.map(filter => (
                    <button
                      key={filter.id}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        filter.id === activeSection
                          ? 'bg-[#bec5a4] text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filter.name}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center space-x-3 bg-gray-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#bec5a4]' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#bec5a4]' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Clinical Histories */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#bec5a4]"></div>
              </div>
            ) : clinicalHistories.length === 0 ? (
              <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50">
                <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                  <FileText size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No hay historias clínicas</h3>
                <p className="text-gray-500 mb-6">Comience creando la primera historia clínica</p>
                <button 
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-[#bec5a4] to-[#aab38c] text-white px-6 py-3 rounded-xl inline-flex items-center hover:shadow-lg transition-all"
                >
                  <PlusCircle size={18} className="mr-2" />
                  Crear primera historia
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {clinicalHistories.map(history => (
                    <div key={history.id} className="group bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-xl hover:border-[#bec5a4]/30 transition-all duration-300">
                      <div className="p-6 border-b border-gray-100">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#bec5a4]/20 to-[#aab38c]/20 flex items-center justify-center">
                              <User className="text-[#bec5a4]" size={24} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 text-lg">{history.patientName}</h3>
                              <p className="text-sm text-gray-500">ID: {history.identificationNumber}</p>
                            </div>
                          </div>
                          <div className="relative">
                            <button className="text-gray-400 hover:text-[#bec5a4] transition-colors">
                              <ChevronDown size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between text-sm mb-4">
                          <span className="text-gray-500">Atendido por:</span>
                          <span className="font-medium text-gray-700">{history.user?.usuario || 'Sin asignar'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Última actualización:</span>
                          <span className="font-medium text-gray-700">{formatDate(history.updatedAt.toString())}</span>
                        </div>
                        
                        <div className="mt-6 flex justify-between items-center">
                          <button 
                            onClick={() => handleViewDetails(history)}
                            className="text-sm text-[#bec5a4] hover:text-[#8f9f7a] font-medium transition-colors"
                          >
                            Ver detalles
                          </button>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setEditingHistory(history.id);
                                setShowForm(true);
                              }}
                              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-[#bec5a4] hover:text-white transition-colors"
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-[#bec5a4] hover:text-white transition-colors"
                              title="Imprimir"
                            >
                              <Printer size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden mb-8">
                <table className="w-full">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Paciente</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Terapeuta</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Última Actualización</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clinicalHistories.map(history => (
                      <tr key={history.id} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#bec5a4]/20 to-[#aab38c]/20 flex items-center justify-center">
                              <User className="text-[#bec5a4]" size={16} />
                            </div>
                            <span className="font-medium text-gray-800">{history.patientName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">{history.user?.usuario || 'Sin asignar'}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">{formatDate(history.updatedAt.toString())}</td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewDetails(history)}
                              className="p-1.5 text-gray-500 hover:text-[#bec5a4] transition-colors" 
                              title="Ver detalles"
                            >
                              <FileText size={16} />
                            </button>
                            <button 
                              onClick={() => {
                                setEditingHistory(history.id);
                                setShowForm(true);
                              }}
                              className="p-1.5 text-gray-500 hover:text-[#bec5a4] transition-colors" 
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="p-1.5 text-gray-500 hover:text-[#bec5a4] transition-colors" 
                              title="Imprimir"
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
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                <div className="text-sm text-gray-500">
                  Mostrando {(currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, totalRecords)} de {totalRecords} registros
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className={`p-2 rounded-lg transition-all ${
                      currentPage === 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-[#bec5a4] hover:text-white'
                    }`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className={`p-2 rounded-lg transition-all ${
                      currentPage === totalPages 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-[#bec5a4] hover:text-white'
                    }`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Templates Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Plantillas de Historias Clínicas</h2>
                <button className="text-sm text-[#bec5a4] hover:text-[#8f9f7a] font-medium transition-colors">
                  Ver todas
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map(template => (
                  <div key={template.id} className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-[#bec5a4] hover:shadow-md transition-all">
                    <div className="bg-[#bec5a4]/10 p-3 rounded-lg mb-4 inline-block group-hover:bg-[#bec5a4] group-hover:text-white transition-colors">
                      <FileText size={24} className="text-[#bec5a4] group-hover:text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{template.category}</p>
                    <button className="w-full py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-[#bec5a4] hover:text-white transition-all">
                      Usar plantilla
                    </button>
                  </div>
                ))}
              </div>
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

export default DashboardReceptionMentalmentePage;