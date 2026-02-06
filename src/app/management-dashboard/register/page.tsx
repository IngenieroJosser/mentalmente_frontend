'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  FaUserPlus, FaEdit, FaTrash, FaSearch, FaUser, 
  FaUserTag, FaTimes, FaEye
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { User_ } from '@/lib/type';

const RegisterDashboardPsychologist = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User_[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User_ | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User_ | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewedUser, setViewedUser] = useState<User_ | null>(null);
  const [formData, setFormData] = useState({
    usuario: '',
    correo: '',
    genero: 'Masculino',
    role: 'PSYCHOLOGIST',
    contrasena: ''
  });

  // Traducción de roles
  const roleTranslations: Record<string, string> = {
    'PSYCHOLOGIST': 'Psicólogo',
    'MANAGEMENT': 'Administrativo',
    'USER': 'Recepcionista'
  };

  // Cargar usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/auth/register');
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data.data);
      } catch (err) {
        console.error('Error al obtener los usuarios:', err);
        setError('No se pudieron cargar los usuarios. Por favor, inténtelo de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.usuario.toLowerCase().includes(searchLower) ||
      user.correo.toLowerCase().includes(searchLower) ||
      roleTranslations[user.role].toLowerCase().includes(searchLower)
    );
  });

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Abrir modal para crear nuevo usuario
  const openCreateModal = () => {
    setFormData({
      usuario: '',
      correo: '',
      genero: 'Masculino',
      role: 'PSYCHOLOGIST',
      contrasena: ''
    });
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  // Abrir modal para ver usuario
  const openViewModal = (user: User_) => {
    setViewedUser(user);
    setIsViewModalOpen(true);
  };

  // Abrir modal para editar usuario
  const openEditModal = (user: User_) => {
    setCurrentUser(user);
    setFormData({
      usuario: user.usuario,
      correo: user.correo,
      genero: user.genero,
      role: user.role,
      contrasena: '' // Contraseña no se muestra por seguridad
    });
    setIsModalOpen(true);
  };

  // Abrir modal de confirmación para eliminar
  const openDeleteModal = (user: User_) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  // Cerrar modales
  const closeModals = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsViewModalOpen(false);
    setCurrentUser(null);
    setUserToDelete(null);
    setViewedUser(null);
  };

  // Enviar formulario (crear o actualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const endpoint = currentUser 
        ? `/api/auth/register?id=${currentUser.id}` 
        : '/api/auth/register';
        
      const method = currentUser ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al procesar la solicitud');
      }
      
      const result = await response.json();
      
      // Actualizar lista de usuarios
      if (method === 'POST') {
        setUsers([...users, result.user]);
        toast.success('Usuario creado exitosamente');
      } else {
        const updatedUsers = users.map(u => 
          u.id === currentUser!.id ? { ...u, ...result.user } : u
        );
        setUsers(updatedUsers);
        toast.success('Usuario actualizado exitosamente');
      }
      
      closeModals();
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error al procesar la solicitud';
      toast.error(errorMessage);
      console.error('Error al enviar el formulario:', err);
    }
  };

  // Eliminar usuario
  const handleDelete = async () => {
    if (!userToDelete) return;
    
    try {
      const response = await fetch(`/api/auth/register?id=${userToDelete.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el usuario');
      }
      
      // Actualizar lista de usuarios
      const updatedUsers = users.filter(u => u.id !== userToDelete.id);
      setUsers(updatedUsers);
      toast.success('Usuario eliminado exitosamente');
      closeModals();
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error al eliminar el usuario';
      toast.error(errorMessage);
      console.error('Error al eliminar:', err);
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0d1e30] to-[#1a3657] p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D4AF37] mb-6"></div>
        <div className="text-center">
          <h2 className="text-2xl font-light text-[#F0F4F8] mb-2">Cargando usuarios</h2>
          <p className="text-[#A3B8CC]">Obteniendo los registros de usuarios...</p>
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
              Gestión de Usuarios
            </h1>
            <p className="text-[#A3B8CC] mt-2 max-w-2xl">
              Administra los usuarios registrados en Mentalmente Global con altos estándares de seguridad y ética.
            </p>
          </div>
          
          <button 
            onClick={openCreateModal}
            className="mt-6 md:mt-0 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0d1e30] font-bold rounded-xl hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300 flex items-center"
          >
            <FaUserPlus className="mr-2" />
            Nuevo Usuario
          </button>
        </div>
        
        {/* Controles de búsqueda */}
        <div className="mb-6 p-6 bg-[#1A2B40] rounded-2xl border border-[#2C4A6B] shadow-xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-[#A3B8CC]" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 bg-[#152233] border border-[#2C4A6B] rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-[#F0F4F8] placeholder-[#5a7a9a]"
              placeholder="Buscar por nombre, correo o rol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Tabla de usuarios */}
        <div className="bg-[#1A2B40] rounded-2xl border border-[#2C4A6B] shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-[#0d1e30] to-[#1a3657]">
                <tr>
                  <th className="py-4 px-6 text-left text-[#D4AF37] font-bold">Usuario</th>
                  <th className="py-4 px-6 text-left text-[#D4AF37] font-bold">Correo</th>
                  <th className="py-4 px-6 text-left text-[#D4AF37] font-bold">Género</th>
                  <th className="py-4 px-6 text-left text-[#D4AF37] font-bold">Rol</th>
                  <th className="py-4 px-6 text-left text-[#D4AF37] font-bold">Registro</th>
                  <th className="py-4 px-6 text-center text-[#D4AF37] font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2C4A6B]">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#152233] transition-colors">
                      <td className="py-4 px-6 text-[#F0F4F8]">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full flex items-center justify-center text-[#0d1e30] font-bold mr-3">
                            {user.usuario.charAt(0)}
                          </div>
                          {user.usuario}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[#A3B8CC]">{user.correo}</td>
                      <td className="py-4 px-6 text-[#F0F4F8]">{user.genero}</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#2a4b6c] text-[#F0F4F8]">
                          {roleTranslations[user.role]}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[#A3B8CC]">{formatDate(user.createdAt)}</td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center space-x-2">
                          <button 
                            onClick={() => openViewModal(user)}
                            className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#2a4b6c] to-[#1a3657] text-white rounded-xl hover:from-[#1a2b40] hover:to-[#0d1e30] transition-all"
                            title="Ver detalles"
                          >
                            <FaEye className="text-sm" />
                          </button>
                          
                          <button 
                            onClick={() => openEditModal(user)}
                            className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#2a4b6c] to-[#1a3657] text-white rounded-xl hover:from-[#D4AF37] hover:to-[#B8860B] transition-all"
                            title="Editar usuario"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                          
                          <button 
                            onClick={() => openDeleteModal(user)}
                            className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#2a4b6c] to-[#1a3657] text-white rounded-xl hover:from-[#ff6b6b] hover:to-[#ff5252] transition-all"
                            title="Eliminar usuario"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FaUser className="text-5xl text-[#A3B8CC] mb-4" />
                        <h3 className="text-xl font-bold text-[#F0F4F8] mb-2">No se encontraron usuarios</h3>
                        <p className="text-[#A3B8CC] max-w-md">
                          {searchTerm 
                            ? `No hay usuarios que coincidan con "${searchTerm}"`
                            : 'No hay usuarios registrados en este momento'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Estadísticas de usuarios */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#1A2B40] to-[#0d1e30] rounded-2xl border border-[#2C4A6B] p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#1A2B40] rounded-xl flex items-center justify-center mr-4 border border-[#2C4A6B]">
                <FaUser className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-[#A3B8CC] text-sm uppercase tracking-wider">Total de usuarios</h3>
                <p className="text-3xl font-bold text-[#F0F4F8] mt-1">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#1A2B40] to-[#0d1e30] rounded-2xl border border-[#2C4A6B] p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#1A2B40] rounded-xl flex items-center justify-center mr-4 border border-[#2C4A6B]">
                <FaUserTag className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-[#A3B8CC] text-sm uppercase tracking-wider">Psicólogos</h3>
                <p className="text-3xl font-bold text-[#F0F4F8] mt-1">
                  {users.filter(u => u.role === 'PSYCHOLOGIST').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#1A2B40] to-[#0d1e30] rounded-2xl border border-[#2C4A6B] p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#1A2B40] rounded-xl flex items-center justify-center mr-4 border border-[#2C4A6B]">
                <FaUserTag className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-[#A3B8CC] text-sm uppercase tracking-wider">Administrativos</h3>
                <p className="text-3xl font-bold text-[#F0F4F8] mt-1">
                  {users.filter(u => u.role === 'MANAGEMENT').length}
                </p>
              </div>
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
              Mentalmente Global
            </h3>
          </div>
          <p className="text-[#A3B8CC] max-w-2xl mx-auto">
            Transformando la atención psicológica a nivel mundial con tecnología de vanguardia y altos estándares de calidad y ética.
          </p>
        </div>
      </div>
      
      {/* Modal para crear/editar usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0d1e30]/90 flex items-center justify-center z-50 p-4 backdrop-blur-md">
          <div className="bg-gradient-to-br from-[#1A2B40] to-[#0d1e30] rounded-2xl border border-[#2C4A6B] shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-[#F0F4F8]">
                  {currentUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                </h3>
                <button 
                  onClick={closeModals}
                  className="text-[#A3B8CC] hover:text-[#D4AF37] transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#A3B8CC] mb-2">Nombre de usuario</label>
                    <input
                      type="text"
                      name="usuario"
                      value={formData.usuario}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#152233] border border-[#2C4A6B] rounded-xl text-[#F0F4F8] placeholder-[#5a7a9a]"
                      placeholder="Nombre de usuario"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[#A3B8CC] mb-2">Correo electrónico</label>
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#152233] border border-[#2C4A6B] rounded-xl text-[#F0F4F8] placeholder-[#5a7a9a]"
                      placeholder="correo@ejemplo.com"
                      required
                    />
                  </div>
                  
                  {!currentUser && (
                    <div>
                      <label className="block text-[#A3B8CC] mb-2">Contraseña</label>
                      <input
                        type="password"
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#152233] border border-[#2C4A6B] rounded-xl text-[#F0F4F8] placeholder-[#5a7a9a]"
                        placeholder="Mínimo 6 caracteres"
                        minLength={6}
                        required={!currentUser}
                      />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#A3B8CC] mb-2">Género</label>
                      <select
                        name="genero"
                        value={formData.genero}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#152233] border border-[#2C4A6B] rounded-xl text-[#F0F4F8]"
                        required
                      >
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-[#A3B8CC] mb-2">Rol</label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#152233] border border-[#2C4A6B] rounded-xl text-[#F0F4F8]"
                        required
                      >
                        <option value="PSYCHOLOGIST">Psicólogo</option>
                        <option value="MANAGEMENT">Administrativo</option>
                        <option value="USER">Recepcionista</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-6 py-3 bg-gradient-to-r from-[#2a4b6c] to-[#1a3657] text-[#F0F4F8] font-medium rounded-xl hover:from-[#1a2b40] hover:to-[#0d1e30] transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0d1e30] font-bold rounded-xl hover:from-[#B8860B] hover:to-[#D4AF37] transition-all shadow-lg"
                  >
                    {currentUser ? 'Actualizar' : 'Crear Usuario'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de visualización de usuario */}
      {isViewModalOpen && viewedUser && (
        <div className="fixed inset-0 bg-[#0d1e30]/90 flex items-center justify-center z-50 p-4 backdrop-blur-md">
          <div className="bg-gradient-to-br from-[#1A2B40] to-[#0d1e30] rounded-2xl border border-[#2C4A6B] shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-[#F0F4F8]">Detalles del Usuario</h3>
                <button 
                  onClick={closeModals}
                  className="text-[#A3B8CC] hover:text-[#D4AF37] transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              
              <div className="space-y-5">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full flex items-center justify-center text-3xl text-[#0d1e30] font-bold mb-4">
                    {viewedUser.usuario.charAt(0)}
                  </div>
                  <h4 className="text-xl font-bold text-[#F0F4F8]">{viewedUser.usuario}</h4>
                  <p className="text-[#A3B8CC]">{viewedUser.correo}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#152233] p-4 rounded-xl border border-[#2C4A6B]">
                    <p className="text-[#A3B8CC] text-sm">Rol</p>
                    <p className="text-[#F0F4F8] font-medium">
                      {roleTranslations[viewedUser.role]}
                    </p>
                  </div>
                  
                  <div className="bg-[#152233] p-4 rounded-xl border border-[#2C4A6B]">
                    <p className="text-[#A3B8CC] text-sm">Género</p>
                    <p className="text-[#F0F4F8] font-medium">{viewedUser.genero}</p>
                  </div>
                  
                  <div className="bg-[#152233] p-4 rounded-xl border border-[#2C4A6B] col-span-2">
                    <p className="text-[#A3B8CC] text-sm">Fecha de Registro</p>
                    <p className="text-[#F0F4F8] font-medium">{formatDate(viewedUser.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <button
                  onClick={closeModals}
                  className="px-6 py-3 bg-gradient-to-r from-[#2a4b6c] to-[#1a3657] text-[#F0F4F8] font-medium rounded-xl hover:from-[#1a2b40] hover:to-[#0d1e30] transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-[#0d1e30]/90 flex items-center justify-center z-50 p-4 backdrop-blur-md">
          <div className="bg-gradient-to-br from-[#1A2B40] to-[#0d1e30] rounded-2xl border border-[#2C4A6B] shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#ff6b6b]/20 to-[#ff5252]/20 rounded-full flex items-center justify-center mb-4">
                  <FaTrash className="text-[#ff6b6b] text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-[#F0F4F8] mb-2">Confirmar Eliminación</h3>
                <p className="text-[#A3B8CC]">
                  ¿Estás seguro de que deseas eliminar al usuario <span className="font-bold text-[#F0F4F8]">{userToDelete.usuario}</span>? Esta acción no se puede deshacer.
                </p>
              </div>
              
              <div className="mt-8 flex justify-center space-x-4">
                <button
                  onClick={closeModals}
                  className="px-6 py-3 bg-gradient-to-r from-[#2a4b6c] to-[#1a3657] text-[#F0F4F8] font-medium rounded-xl hover:from-[#1a2b40] hover:to-[#0d1e30] transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#ff5252] text-white font-bold rounded-xl hover:from-[#ff5252] hover:to-[#ff6b6b] transition-all shadow-lg"
                >
                  Eliminar Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterDashboardPsychologist;