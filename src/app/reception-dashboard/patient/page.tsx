'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  FaUserInjured, FaIdCard, FaCalendarAlt, FaPhone, FaEnvelope, FaMapMarkerAlt, 
  FaHospital, FaVenusMars, FaHistory, FaEdit, FaTrash, FaTimes
} from 'react-icons/fa';
import MedicalRecordDetailsModal from '@/components/MedicalRecordDetailsModal';
import { toast } from 'react-toastify';
import { Patient, MedicalRecordWithUser } from '@/lib/type';

const PatientReceptionDashboard = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user || !user.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/reception-dash?userId=${user.id}&limit=1000`);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        setPatients(data.data);
      } catch (err) {
        console.error('Error al obtener los pacientes:', err);
        setError('No se pudieron cargar los pacientes. Por favor, inténtelo de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [user]);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.identificationNumber.includes(searchTerm);
    
    if (activeTab === 'beneficiaries') {
      return matchesSearch && patient.isBeneficiary;
    }
    return matchesSearch;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const openDetailModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDetailModalOpen(true);
  };

  const openEditModal = (patient: Patient) => {
    setEditingPatient(patient);
  };

  const openDeleteModal = (patient: Patient) => {
    setPatientToDelete(patient);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsDetailModalOpen(false);
    setEditingPatient(null);
    setIsDeleteModalOpen(false);
    setPatientToDelete(null);
  };

  const handleSavePatient = async () => {
    if (!editingPatient) return;
    
    try {
      const updateData = {
        patientName: editingPatient.patientName,
        identificationType: editingPatient.identificationType,
        identificationNumber: editingPatient.identificationNumber,
        birthDate: editingPatient.birthDate ? new Date(editingPatient.birthDate).toISOString() : null,
        age: editingPatient.age ? parseInt(editingPatient.age.toString()) : null,
        educationLevel: editingPatient.educationLevel,
        occupation: editingPatient.occupation,
        birthPlace: editingPatient.birthPlace,
        nationality: editingPatient.nationality,
        religion: editingPatient.religion,
        address: editingPatient.address,
        neighborhood: editingPatient.neighborhood,
        city: editingPatient.city,
        state: editingPatient.state,
        admissionDate: editingPatient.admissionDate ? new Date(editingPatient.admissionDate).toISOString() : null,
        phone: editingPatient.phone,
        cellPhone: editingPatient.cellPhone,
        email: editingPatient.email,
        eps: editingPatient.eps,
        isBeneficiary: editingPatient.isBeneficiary,
        referredBy: editingPatient.referredBy,
        guardian1Name: editingPatient.guardian1Name,
        guardian1Relationship: editingPatient.guardian1Relationship,
        guardian1Phone: editingPatient.guardian1Phone,
        guardian1Occupation: editingPatient.guardian1Occupation,
        guardian2Name: editingPatient.guardian2Name,
        guardian2Relationship: editingPatient.guardian2Relationship,
        guardian2Phone: editingPatient.guardian2Phone,
        guardian2Occupation: editingPatient.guardian2Occupation,
        attendedBy: editingPatient.attendedBy,
        licenseNumber: editingPatient.licenseNumber,
        personalPathological: editingPatient.personalPathological,
        personalSurgical: editingPatient.personalSurgical,
        personalPsychopathological: editingPatient.personalPsychopathological,
        traumaHistory: editingPatient.traumaHistory,
        sleepStatus: editingPatient.sleepStatus,
        substanceUse: editingPatient.substanceUse,
        personalOther: editingPatient.personalOther,
        familyPathological: editingPatient.familyPathological,
        familySurgical: editingPatient.familySurgical,
        familyPsychopathological: editingPatient.familyPsychopathological,
        familyTraumatic: editingPatient.familyTraumatic,
        familySubstanceUse: editingPatient.familySubstanceUse,
        familyOther: editingPatient.familyOther,
        pregnancyInfo: editingPatient.pregnancyInfo,
        deliveryInfo: editingPatient.deliveryInfo,
        psychomotorDevelopment: editingPatient.psychomotorDevelopment,
        familyDynamics: editingPatient.familyDynamics,
        consultationReason: editingPatient.consultationReason,
        problemHistory: editingPatient.problemHistory,
        therapyExpectations: editingPatient.therapyExpectations,
        mentalExam: editingPatient.mentalExam,
        psychologicalAssessment: editingPatient.psychologicalAssessment,
        diagnosis: editingPatient.diagnosis,
        therapeuticGoals: editingPatient.therapeuticGoals,
        treatmentPlan: editingPatient.treatmentPlan,
        referralInfo: editingPatient.referralInfo,
        recommendations: editingPatient.recommendations,
        evolution: editingPatient.evolution,
      };
  
      const response = await fetch(`/api/reception-dash/patient?userId=${editingPatient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el paciente');
      }
      
      const updatedPatients = patients.map(p => 
        p.id === editingPatient.id ? editingPatient : p
      );
      
      setPatients(updatedPatients);
      toast.success('Paciente actualizado con éxito');
      setEditingPatient(null);
    } catch (err: unknown) {
      console.error('Error al guardar:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error al actualizar el paciente';
      toast.error(errorMessage);
    }
  };

  const handleDeletePatient = async () => {
    if (!patientToDelete) return;
    
    try {
      const response = await fetch(`/api/psychologist-dash/patient?id=${patientToDelete.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el paciente');
      }
      
      const updatedPatients = patients.filter(p => p.id !== patientToDelete.id);
      setPatients(updatedPatients);
      toast.success('Paciente eliminado con éxito');
      setIsDeleteModalOpen(false);
      setPatientToDelete(null);
    } catch (err: unknown) {
      console.error('Error al eliminar:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error al eliminar el paciente';
      toast.error(errorMessage);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editingPatient) return;
    
    const { name, value, type } = e.target;
    
    setEditingPatient({
      ...editingPatient,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#f2f2f2] to-[#e0e0e0] p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#bec5a4] mb-6"></div>
        <div className="text-center">
          <h2 className="text-2xl font-light text-[#3a3a3a] mb-2">Cargando pacientes</h2>
          <p className="text-[#666666]">Obteniendo los registros médicos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f2f2f2] to-[#e0e0e0] p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#bec5a4] shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#bec5a4] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#3a3a3a]">Error de conexión</h2>
            <p className="text-[#666666] mt-2">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#bec5a4] to-[#aab38c] text-white font-bold rounded-xl hover:from-[#aab38c] hover:to-[#bec5a4] transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-[#bec5a4]/20"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2f2f2] to-[#e0e0e0] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado premium */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 p-6 bg-white rounded-2xl border border-[#bec5a4] shadow-xl">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#bec5a4] to-[#aab38c]">
              Panel de Gestión de Pacientes
            </h1>
            <p className="text-[#666666] mt-2 max-w-2xl">
              Gestión avanzada de pacientes con tecnología Mentalmente Global. 
              Visualice, edite y administre toda la información de sus pacientes.
            </p>
          </div>
          
          <div className="mt-6 md:mt-0 flex items-center space-x-4">
            <div className="bg-[#f2f2f2] rounded-xl p-3 border border-[#bec5a4]">
              <div className="text-sm text-[#666666]">Total pacientes</div>
              <div className="text-2xl font-bold text-[#3a3a3a]">{patients.length}</div>
            </div>
          </div>
        </div>
        
        {/* Controles y filtros */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 bg-white rounded-2xl border border-[#bec5a4] shadow-xl">
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-[#666666]" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 bg-[#f2f2f2] border border-[#bec5a4] rounded-xl focus:ring-2 focus:ring-[#bec5a4] focus:border-transparent text-[#3a3a3a] placeholder-[#999999]"
              placeholder="Buscar por nombre o identificación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'all' 
                  ? 'bg-gradient-to-r from-[#bec5a4] to-[#aab38c] text-white font-bold' 
                  : 'bg-[#f2f2f2] border border-[#bec5a4] text-[#3a3a3a] hover:bg-[#e8e8e8]'
              }`}
            >
              Todos
            </button>
            <button 
              onClick={() => setActiveTab('beneficiaries')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'beneficiaries' 
                  ? 'bg-gradient-to-r from-[#bec5a4] to-[#aab38c] text-white font-bold' 
                  : 'bg-[#f2f2f2] border border-[#bec5a4] text-[#3a3a3a] hover:bg-[#e8e8e8]'
              }`}
            >
              Beneficiarios
            </button>
          </div>
        </div>
        
        {/* Tarjetas de pacientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div 
              key={patient.id}
              className="bg-gradient-to-br from-white to-[#f2f2f2] rounded-2xl border border-[#bec5a4] shadow-xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
              {/* Encabezado de tarjeta */}
              <div className="bg-gradient-to-r from-[#f2f2f2] to-[#e8e8e8] p-5 border-b border-[#bec5a4]">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#bec5a4] to-[#aab38c] rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {patient.patientName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#3a3a3a]">{patient.patientName}</h3>
                    <div className="flex items-center mt-1">
                      <FaIdCard className="text-[#bec5a4] mr-2" />
                      <span className="text-[#666666]">
                        {patient.identificationType}: {patient.identificationNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Cuerpo de tarjeta */}
              <div className="p-5">
                <div className="space-y-4">
                  <div className="flex">
                    <div className="w-1/2">
                      <div className="flex items-center mb-2">
                        <FaCalendarAlt className="text-[#bec5a4] mr-2" />
                        <span className="text-[#666666] text-sm">Edad</span>
                      </div>
                      <div className="text-[#3a3a3a] font-medium">
                        {patient.age || 'N/A'} años
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="flex items-center mb-2">
                        <FaVenusMars className="text-[#bec5a4] mr-2" />
                        <span className="text-[#666666] text-sm">Admisión</span>
                      </div>
                      <div className="text-[#3a3a3a] font-medium">
                        {formatDate(patient.admissionDate)}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <FaHospital className="text-[#bec5a4] mr-2" />
                      <span className="text-[#666666] text-sm">EPS</span>
                    </div>
                    <div className="text-[#3a3a3a] font-medium">
                      {patient.eps || 'No registrada'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <FaMapMarkerAlt className="text-[#bec5a4] mr-2" />
                      <span className="text-[#666666] text-sm">Ubicación</span>
                    </div>
                    <div className="text-[#3a3a3a] font-medium">
                      {patient.city || 'N/A'}, {patient.state || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-1/2">
                      <div className="flex items-center mb-2">
                        <FaPhone className="text-[#bec5a4] mr-2" />
                        <span className="text-[#666666] text-sm">Teléfono</span>
                      </div>
                      <div className="text-[#3a3a3a] font-medium">
                        {patient.cellPhone || patient.phone || 'N/A'}
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="flex items-center mb-2">
                        <FaEnvelope className="text-[#bec5a4] mr-2" />
                        <span className="text-[#666666] text-sm">Email</span>
                      </div>
                      <div className="text-[#3a3a3a] font-medium truncate">
                        {patient.email || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Pie de tarjeta - Acciones */}
                <div className="mt-6 pt-4 border-t border-[#bec5a4]">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        patient.isBeneficiary 
                          ? 'bg-[#bec5a4]/20 text-[#3a3a3a]' 
                          : 'bg-[#e0e0e0] text-[#666666]'
                      }`}>
                        {patient.isBeneficiary ? 'Beneficiario' : 'No beneficiario'}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openDetailModal(patient)}
                        className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#e0e0e0] to-[#d0d0d0] text-[#3a3a3a] rounded-xl hover:from-[#bec5a4] hover:to-[#aab38c] hover:text-white transition-all"
                        title="Ver historial clínico"
                      >
                        <FaHistory className="text-sm" />
                      </button>
                      
                      <button 
                        onClick={() => openEditModal(patient)}
                        className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#e0e0e0] to-[#d0d0d0] text-[#3a3a3a] rounded-xl hover:from-[#bec5a4] hover:to-[#aab38c] hover:text-white transition-all"
                        title="Editar paciente"
                      >
                        <FaEdit className="text-sm" />
                      </button>
                      
                      <button 
                        onClick={() => openDeleteModal(patient)}
                        className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#e0e0e0] to-[#d0d0d0] text-[#3a3a3a] rounded-xl hover:from-[#ff6b6b] hover:to-[#ff5252] hover:text-white transition-all"
                        title="Eliminar paciente"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mensaje si no hay resultados */}
        {filteredPatients.length === 0 && (
          <div className="mt-12 text-center py-16 bg-white rounded-2xl border border-[#bec5a4]">
            <div className="w-24 h-24 bg-gradient-to-r from-[#bec5a4]/10 to-[#aab38c]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUserInjured className="h-12 w-12 text-[#bec5a4]" />
            </div>
            <h3 className="text-2xl font-bold text-[#3a3a3a] mb-2">No se encontraron pacientes</h3>
            <p className="text-[#666666] max-w-md mx-auto">
              {searchTerm 
                ? `No hay pacientes que coincidan con "${searchTerm}"`
                : 'No hay pacientes registrados en este momento'}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-6 bg-gradient-to-r from-[#bec5a4] to-[#aab38c] text-white font-bold px-6 py-3 rounded-xl hover:from-[#aab38c] hover:to-[#bec5a4] transition-all duration-300"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}
        
        {/* Estadísticas */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-white to-[#f2f2f2] rounded-2xl border border-[#bec5a4] p-6 shadow-xl">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 border border-[#bec5a4]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#bec5a4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[#666666] text-sm uppercase tracking-wider">Pacientes únicos</h3>
                <p className="text-3xl font-bold text-[#3a3a3a] mt-1">
                  {patients.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-[#f2f2f2] rounded-2xl border border-[#bec5a4] p-6 shadow-xl">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 border border-[#bec5a4]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#bec5a4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[#666666] text-sm uppercase tracking-wider">Beneficiarios</h3>
                <p className="text-3xl font-bold text-[#3a3a3a] mt-1">
                  {patients.filter(p => p.isBeneficiary).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-[#f2f2f2] rounded-2xl border border-[#bec5a4] p-6 shadow-xl">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 border border-[#bec5a4]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#bec5a4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <div>
                <h3 className="text-[#666666] text-sm uppercase tracking-wider">Edad promedio</h3>
                <p className="text-3xl font-bold text-[#3a3a3a] mt-1">
                  {patients.length > 0 
                    ? Math.round(patients.reduce((sum, p) => sum + (p.age || 0), 0) / patients.length)
                    : 0} años
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pie de página premium */}
        <div className="mt-12 text-center py-8 border-t border-[#bec5a4]/30">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#bec5a4] to-[#aab38c] rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#bec5a4] to-[#aab38c]">
              Mentalmente - Transformando la atención psicológica.
            </h3>
          </div>
          <p className="text-[#666666] max-w-2xl mx-auto">
            Plataforma de gestión clínica premium para profesionales de la salud mental. 
            Transformando la atención psicológica a nivel mundial con tecnología de vanguardia.
          </p>
        </div>
      </div>
      
      {/* Modal de detalles de historia clínica */}
      {isDetailModalOpen && selectedPatient && (
        <MedicalRecordDetailsModal 
          record={selectedPatient as unknown as MedicalRecordWithUser} 
          onClose={closeModals}
        />
      )}
      
      {/* Modal de edición de paciente */}
      {editingPatient && (
        <div className="fixed inset-0 bg-[#f2f2f2]/90 flex items-center justify-center z-50 p-4 backdrop-blur-md">
          <div className="bg-gradient-to-br from-white to-[#f2f2f2] rounded-2xl border border-[#bec5a4] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-[#3a3a3a]">Editar Paciente</h3>
                <button 
                  onClick={closeModals}
                  className="text-[#666666] hover:text-[#bec5a4] transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[#666666] mb-2">Nombre completo</label>
                  <input
                    type="text"
                    name="patientName"
                    value={editingPatient.patientName}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 bg-[#f2f2f2] border border-[#bec5a4] rounded-xl text-[#3a3a3a] placeholder-[#999999]"
                    placeholder="Nombre completo"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#666666] mb-2">Tipo de identificación</label>
                    <select
                      name="identificationType"
                      value={editingPatient.identificationType}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f2f2f2] border border-[#bec5a4] rounded-xl text-[#3a3a3a]"
                    >
                      <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                      <option value="Cédula de extranjería">Cédula de extranjería</option>
                      <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                      <option value="Pasaporte">Pasaporte</option>
                      <option value="Registro civil">Registro civil</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[#666666] mb-2">Número de identificación</label>
                    <input
                      type="text"
                      name="identificationNumber"
                      value={editingPatient.identificationNumber}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f2f2f2] border border-[#bec5a4] rounded-xl text-[#3a3a3a] placeholder-[#999999]"
                      placeholder="Número de identificación"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#666666] mb-2">Fecha de nacimiento</label>
                    <input
                      type="date"
                      name="birthDate"
                      value={editingPatient.birthDate || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f2f2f2] border border-[#bec5a4] rounded-xl text-[#3a3a3a]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[#666666] mb-2">Edad</label>
                    <input
                      type="number"
                      name="age"
                      value={editingPatient.age || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f2f2f2] border border-[#bec5a4] rounded-xl text-[#3a3a3a] placeholder-[#999999]"
                      placeholder="Edad"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#666666] mb-2">Teléfono</label>
                    <input
                      type="text"
                      name="phone"
                      value={editingPatient.phone || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f2f2f2] border border-[#bec5a4] rounded-xl text-[#3a3a3a] placeholder-[#999999]"
                      placeholder="Teléfono"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[#666666] mb-2">Celular</label>
                    <input
                      type="text"
                      name="cellPhone"
                      value={editingPatient.cellPhone || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f2f2f2] border border-[#bec5a4] rounded-xl text-[#3a3a3a] placeholder-[#999999]"
                      placeholder="Celular"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[#666666] mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editingPatient.email || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 bg-[#f2f2f2] border border-[#bec5a4] rounded-xl text-[#3a3a3a] placeholder-[#999999]"
                    placeholder="Email"
                  />
                </div>
                
                <div>
                  <label className="block text-[#666666] mb-2">Dirección</label>
                  <input
                    type="text"
                    name="address"
                    value={editingPatient.address || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 bg-[#f2f2f2] border border-[#bec5a4] rounded-xl text-[#3a3a3a] placeholder-[#999999]"
                    placeholder="Dirección"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#666666] mb-2">Ciudad</label>
                    <input
                      type="text"
                      name="city"
                      value={editingPatient.city || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f2f2f2] border border-[#bec5a4] rounded-xl text-[#3a3a3a] placeholder-[#999999]"
                      placeholder="Ciudad"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[#666666] mb-2">Departamento</label>
                    <input
                      type="text"
                      name="state"
                      value={editingPatient.state || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f2f2f2] border border-[#bec5a4] rounded-xl text-[#3a3a3a] placeholder-[#999999]"
                      placeholder="Departamento"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[#666666] mb-2">Barrio</label>
                    <input
                      type="text"
                      name="neighborhood"
                      value={editingPatient.neighborhood || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f2f2f2] border border-[#bec5a4] rounded-xl text-[#3a3a3a] placeholder-[#999999]"
                      placeholder="Barrio"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#666666] mb-2">EPS</label>
                    <input
                      type="text"
                      name="eps"
                      value={editingPatient.eps || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f2f2f2] border border-[#bec5a4] rounded-xl text-[#3a3a3a] placeholder-[#999999]"
                      placeholder="EPS"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[#666666] mb-2">Beneficiario</label>
                    <div className="mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="isBeneficiary"
                          checked={editingPatient.isBeneficiary || false}
                          onChange={handleEditChange}
                          className="form-checkbox h-5 w-5 text-[#bec5a4] bg-[#f2f2f2] border-[#bec5a4] rounded focus:ring-[#bec5a4]"
                        />
                        <span className="ml-2 text-[#3a3a3a]">Es beneficiario</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={closeModals}
                  className="px-6 py-3 bg-gradient-to-r from-[#e0e0e0] to-[#d0d0d0] text-[#3a3a3a] font-medium rounded-xl hover:from-[#d0d0d0] hover:to-[#c0c0c0] transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSavePatient}
                  className="px-6 py-3 bg-gradient-to-r from-[#bec5a4] to-[#aab38c] text-white font-bold rounded-xl hover:from-[#aab38c] hover:to-[#bec5a4] transition-all shadow-lg"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && patientToDelete && (
        <div className="fixed inset-0 bg-[#f2f2f2]/90 flex items-center justify-center z-50 p-4 backdrop-blur-md">
          <div className="bg-gradient-to-br from-white to-[#f2f2f2] rounded-2xl border border-[#bec5a4] shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#ff6b6b]/20 to-[#ff5252]/20 rounded-full flex items-center justify-center mb-4">
                  <FaTrash className="text-[#ff6b6b] text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-[#3a3a3a] mb-2">Confirmar Eliminación</h3>
                <p className="text-[#666666]">
                  ¿Estás seguro de que deseas eliminar al paciente <span className="font-bold text-[#3a3a3a]">{patientToDelete.patientName}</span>? Esta acción no se puede deshacer.
                </p>
              </div>
              
              <div className="mt-8 flex justify-center space-x-4">
                <button
                  onClick={closeModals}
                  className="px-6 py-3 bg-gradient-to-r from-[#e0e0e0] to-[#d0d0d0] text-[#3a3a3a] font-medium rounded-xl hover:from-[#d0d0d0] hover:to-[#c0c0c0] transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeletePatient}
                  className="px-6 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#ff5252] text-white font-bold rounded-xl hover:from-[#ff5252] hover:to-[#ff6b6b] transition-all shadow-lg"
                >
                  Eliminar Paciente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientReceptionDashboard;