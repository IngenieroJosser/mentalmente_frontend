'use client';
import React, { useState } from 'react';
import { 
  FileText, 
  User, 
  Search, 
  PlusCircle,
  ChevronDown,
  Edit,
  FilePlus,
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
  Menu
} from 'lucide-react';
import Image from 'next/image';
import { clinicalHistories, templates, filters } from '@/lib/constants';

const DashboardMentalmentePage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Versión móvil */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[rgba(0,0,0,0.2)] backdrop-blur-md" onClick={() => setIsMenuOpen(false)}>
          <div className="w-64 h-full bg-[#19334c] text-white" onClick={e => e.stopPropagation()}>
            <div className="p-5 flex items-center justify-between border-b border-[#2a4b6c]">
              <div className="flex items-center space-x-3">
                <div className="bg-[#c77914] p-2 rounded-lg">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                </div>
                <div>
                  <h1 className="font-bold">Mentalmente</h1>
                </div>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="text-white"
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>
            
            <nav className="py-5">
              <ul>
                {[
                  { id: 'dashboard', icon: <LayoutGrid size={18} />, label: 'Dashboard' },
                  { id: 'histories', icon: <FileText size={18} />, label: 'Historias Clínicas' },
                  { id: 'templates', icon: <FilePlus size={18} />, label: 'Plantillas' },
                  { id: 'patients', icon: <User size={18} />, label: 'Pacientes' },
                  { id: 'calendar', icon: <Calendar size={18} />, label: 'Calendario' },
                  { id: 'reports', icon: <BarChart2 size={18} />, label: 'Reportes' },
                  { id: 'settings', icon: <Settings size={18} />, label: 'Configuración' },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => { setActiveTab(item.id); setIsMenuOpen(false); }}
                      className={`w-full flex items-center space-x-3 px-5 py-3 transition-colors ${
                        activeTab === item.id
                          ? 'bg-[#0f2439] border-l-4 border-[#c77914]'
                          : 'hover:bg-[#152a40]'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Sidebar - Versión desktop */}
      <aside className="hidden md:flex w-64 bg-[#19334c] text-white flex-col">
        <div className="p-5 flex items-center space-x-3 border-b border-[#2a4b6c]">
          <div className="flex items-center justify-center mb-8">
          <div className="bg-[#19334c] p-3 rounded-xl flex items-center justify-center border border-[#c77914]/30">
            <div className="relative w-14 h-14">
              <Image
                src="/img/logo.png"
                alt="Logo de Mentalmente"
                layout="fill"
                objectFit="contain"
                quality={100}
                priority
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
          <div>
            <h1 className="font-bold mt-[-2em]">Mentalmente</h1>
            <p className="text-xs text-[#a0b1c5]">Historias Clínicas Digitales</p>
          </div>
        </div>
        
        <nav className="flex-1 py-5">
          <ul>
            {[
              { id: 'dashboard', icon: <LayoutGrid size={18} />, label: 'Dashboard' },
              { id: 'histories', icon: <FileText size={18} />, label: 'Historias Clínicas' },
              { id: 'templates', icon: <FilePlus size={18} />, label: 'Plantillas' },
              { id: 'patients', icon: <User size={18} />, label: 'Pacientes' },
              { id: 'calendar', icon: <Calendar size={18} />, label: 'Calendario' },
              { id: 'reports', icon: <BarChart2 size={18} />, label: 'Reportes' },
              { id: 'settings', icon: <Settings size={18} />, label: 'Configuración' },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-5 py-3 transition-colors ${
                    activeTab === item.id
                      ? 'bg-[#0f2439] border-l-4 border-[#c77914]'
                      : 'hover:bg-[#152a40]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-5 border-t border-[#2a4b6c]">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-3 w-full text-left p-3 bg-[#0f2439] rounded-lg"
          >
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
            <div className="flex-1">
              <p className="font-medium text-sm">Dra. Laura Méndez</p>
              <p className="text-xs text-[#a0b1c5]">Psicóloga Clínica</p>
            </div>
            <ChevronDown size={16} />
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden mr-3 text-gray-600"
              aria-label='Menú'
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-[#19334c] hidden md:inline-block">Sistema de Historias Clínicas</h1>
          </div>
          
          <div className="relative flex-1 max-w-xl mx-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar historias, pacientes, plantillas..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c77914]/50 focus:border-[#c77914] outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 rounded-full hover:bg-gray-100 relative"
              aria-label="Notifications"
            >
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 bg-[#c77914] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </button>
            
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2"
            >
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
              <span className="hidden md:inline text-sm font-medium">Dra. Méndez</span>
            </button>
          </div>
          
          {/* Menú de perfil */}
          {isProfileOpen && (
            <div className="absolute right-4 top-16 mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
              <div className="p-4 border-b border-gray-200">
                <p className="font-semibold">Dra. Laura Méndez</p>
                <p className="text-sm text-gray-600">laura@mentalmente.com</p>
              </div>
              <div className="py-2">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center">
                  <Settings size={16} className="mr-2 text-gray-600" /> Configuración
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center">
                  <LogOut size={16} className="mr-2 text-gray-600" /> Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Contenido - Dashboard de Historias Clínicas */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f8fafc]">
          {/* Encabezado y acciones */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#19334c]">Gestión de Historias Clínicas</h1>
              <p className="text-gray-600">Optimiza tu tiempo con nuestro sistema digital</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center">
                <Filter size={16} className="mr-2" />
                Filtros
              </button>
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center">
                <Download size={16} className="mr-2" />
                Exportar
              </button>
              <button className="bg-[#c77914] hover:bg-[#b16d12] text-white px-4 py-2 rounded-lg flex items-center">
                <PlusCircle size={16} className="mr-2" />
                Nueva Historia
              </button>
            </div>
          </div>

          {/* Filtros y controles de vista */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {filters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveTab(filter.id)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      activeTab === filter.id
                        ? 'bg-[#19334c] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Vista:</span>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#19334c] text-white' : 'bg-gray-100 text-gray-700'}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#19334c] text-white' : 'bg-gray-100 text-gray-700'}`}
                  aria-label="List view"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Listado de historias clínicas */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {clinicalHistories.map(history => (
                <div key={history.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-[#19334c]">{history.patient}</h3>
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Terapeuta:</span> {history.therapist}
                        </div>
                      </div>
                      <button 
                        className="text-gray-400 hover:text-[#c77914]"
                        aria-label="More options"
                      >
                        <ChevronDown size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Última actualización:</span>
                      <span className="font-medium">{history.lastUpdate}</span>
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <button className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg">
                        Ver detalles
                      </button>
                      <button className="text-sm bg-[#19334c] hover:bg-[#0f2439] text-white px-3 py-1.5 rounded-lg flex items-center">
                        <Edit size={14} className="mr-1" /> Editar
                      </button>
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
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Paciente</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Terapeuta</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Última Actualización</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clinicalHistories.map(history => (
                    <tr key={history.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-[#19334c]">{history.patient}</div>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {history.therapist}
                      </td>
                      <td className="py-4 px-4 text-sm">{history.lastUpdate}</td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button className="p-1.5 text-gray-500 hover:text-[#c77914]" aria-label="Edit">
                            <Edit size={16} />
                          </button>
                          <button className="p-1.5 text-gray-500 hover:text-[#19334c]" aria-label="Print">
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

          {/* Plantillas de historias clínicas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-semibold text-lg text-[#19334c]">Plantillas de Historias Clínicas</h2>
              <button className="text-sm text-[#19334c] hover:text-[#c77914] font-medium">
                Ver todas
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {templates.map(template => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#c77914] transition-colors">
                  <div className="bg-[#19334c]/10 p-3 rounded-lg mb-3 inline-block">
                    <FileText size={24} className="text-[#19334c]" />
                  </div>
                  <h3 className="font-medium mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.category}</p>
                  <button className="mt-3 text-sm w-full bg-[#19334c] hover:bg-[#0f2439] text-white py-1.5 rounded-lg">
                    Usar plantilla
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardMentalmentePage;