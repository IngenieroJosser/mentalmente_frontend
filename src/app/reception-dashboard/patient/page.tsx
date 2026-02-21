'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  FaUserInjured, FaIdCard, FaCalendarAlt, FaPhone, FaEnvelope, FaMapMarkerAlt, 
  FaHospital, FaVenusMars, FaHistory, FaEdit, FaTrash, FaTimes,
  FaSearch, FaFilter, FaChartLine, FaHeartbeat, FaUsers
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#fafafa] to-[#f0f0f0] p-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#bec5a4]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 bg-[#bec5a4] rounded-full opacity-20 animate-pulse"></div>
          </div>
        </div>
        <div className="text-center mt-8">
          <h2 className="text-2xl font-light text-[#2c3e50] mb-2">Cargando pacientes</h2>
          <p className="text-[#7f8c8d]">Preparando información médica...</p>
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
            onClick={() => window.location.reload()}
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
        {/* Encabezado principal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-light text-[#2c3e50] tracking-tight">
              Panel de Pacientes
            </h1>
            <p className="text-[#7f8c8d] mt-2 max-w-2xl text-sm">
              Gestión avanzada de pacientes con tecnología SanaTú Guingar Global.
              Visualice, edite y administre toda la información de sus pacientes.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="bg-white rounded-2xl px-6 py-3 shadow-sm border border-[#bec5a4]/20">
              <div className="text-xs uppercase tracking-wider text-[#7f8c8d]">Total pacientes</div>
              <div className="text-3xl font-light text-[#2c3e50]">{patients.length}</div>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#bec5a4]/20 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#bec5a4]" />
              <input
                type="text"
                placeholder="Buscar por nombre o identificación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50] placeholder-[#95a5a6]"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'all'
                    ? 'bg-[#bec5a4] text-white shadow-md shadow-[#bec5a4]/30'
                    : 'bg-[#f2f2f2] text-[#7f8c8d] hover:bg-[#e8e8e8]'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveTab('beneficiaries')}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'beneficiaries'
                    ? 'bg-[#bec5a4] text-white shadow-md shadow-[#bec5a4]/30'
                    : 'bg-[#f2f2f2] text-[#7f8c8d] hover:bg-[#e8e8e8]'
                }`}
              >
                Beneficiarios
              </button>
              <button className="p-2.5 rounded-xl bg-[#f2f2f2] text-[#7f8c8d] hover:bg-[#e8e8e8] transition-all">
                <FaFilter />
              </button>
            </div>
          </div>
        </div>

        {/* Grid de pacientes */}
        {filteredPatients.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-[#bec5a4]/20">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#bec5a4]/10 to-[#aab38c]/10 rounded-3xl flex items-center justify-center mb-6">
              <FaUserInjured className="h-12 w-12 text-[#bec5a4]" />
            </div>
            <h3 className="text-2xl font-light text-[#2c3e50] mb-2">No se encontraron pacientes</h3>
            <p className="text-[#7f8c8d] max-w-md mx-auto">
              {searchTerm 
                ? `No hay pacientes que coincidan con "${searchTerm}"`
                : 'Comienza agregando un nuevo paciente al sistema.'}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-6 px-6 py-3 bg-[#bec5a4] text-white rounded-xl hover:bg-[#aab38c] transition-all shadow-md shadow-[#bec5a4]/20"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="group bg-white rounded-3xl shadow-sm hover:shadow-xl border border-[#bec5a4]/20 overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                {/* Cabecera con inicial */}
                <div className="bg-gradient-to-r from-[#f9f9f9] to-[#f5f5f5] px-6 py-5 border-b border-[#bec5a4]/20">
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#bec5a4] to-[#aab38c] rounded-2xl flex items-center justify-center text-white font-serif text-2xl shadow-md">
                      {patient.patientName.charAt(0)}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-serif text-xl font-medium text-[#2c3e50]">{patient.patientName}</h3>
                      <div className="flex items-center mt-1 text-sm text-[#7f8c8d]">
                        <FaIdCard className="text-[#bec5a4] mr-2" size={12} />
                        <span>{patient.identificationType}: {patient.identificationNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cuerpo de la tarjeta */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center text-xs uppercase tracking-wider text-[#95a5a6] mb-1">
                        <FaCalendarAlt className="mr-1 text-[#bec5a4]" size={10} /> Edad
                      </div>
                      <div className="text-[#2c3e50] font-medium">{patient.age || 'N/A'} años</div>
                    </div>
                    <div>
                      <div className="flex items-center text-xs uppercase tracking-wider text-[#95a5a6] mb-1">
                        <FaVenusMars className="mr-1 text-[#bec5a4]" size={10} /> Admisión
                      </div>
                      <div className="text-[#2c3e50] font-medium text-sm truncate">{formatDate(patient.admissionDate)}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FaHospital className="text-[#bec5a4] mt-1 mr-3 flex-shrink-0" size={14} />
                      <div>
                        <div className="text-xs uppercase tracking-wider text-[#95a5a6]">EPS</div>
                        <div className="text-[#2c3e50] font-medium">{patient.eps || 'No registrada'}</div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaMapMarkerAlt className="text-[#bec5a4] mt-1 mr-3 flex-shrink-0" size={14} />
                      <div>
                        <div className="text-xs uppercase tracking-wider text-[#95a5a6]">Ubicación</div>
                        <div className="text-[#2c3e50] font-medium">{patient.city || 'N/A'}, {patient.state || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FaPhone className="text-[#bec5a4] mt-1 mr-3 flex-shrink-0" size={14} />
                      <div>
                        <div className="text-xs uppercase tracking-wider text-[#95a5a6]">Contacto</div>
                        <div className="text-[#2c3e50] font-medium text-sm">{patient.cellPhone || patient.phone || 'N/A'}</div>
                        {patient.email && <div className="text-[#7f8c8d] text-xs truncate">{patient.email}</div>}
                      </div>
                    </div>
                  </div>

                  {/* Estado y acciones */}
                  <div className="mt-6 pt-4 border-t border-[#bec5a4]/20 flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      patient.isBeneficiary 
                        ? 'bg-[#bec5a4]/10 text-[#2c3e50] border border-[#bec5a4]/30' 
                        : 'bg-[#ecf0f1] text-[#7f8c8d]'
                    }`}>
                      {patient.isBeneficiary ? 'Beneficiario' : 'Particular'}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openDetailModal(patient)}
                        className="p-2 rounded-xl bg-[#f2f2f2] text-[#7f8c8d] hover:bg-[#bec5a4] hover:text-white transition-all"
                        title="Ver historial clínico"
                      >
                        <FaHistory size={14} />
                      </button>
                      <button
                        onClick={() => openEditModal(patient)}
                        className="p-2 rounded-xl bg-[#f2f2f2] text-[#7f8c8d] hover:bg-[#bec5a4] hover:text-white transition-all"
                        title="Editar paciente"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(patient)}
                        className="p-2 rounded-xl bg-[#f2f2f2] text-[#7f8c8d] hover:bg-red-400 hover:text-white transition-all"
                        title="Eliminar paciente"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Estadísticas elegantes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-3xl shadow-sm border border-[#bec5a4]/20 p-6 flex items-center">
            <div className="w-14 h-14 bg-gradient-to-br from-[#bec5a4]/10 to-[#aab38c]/10 rounded-2xl flex items-center justify-center mr-4">
              <FaUsers className="text-2xl text-[#bec5a4]" />
            </div>
            <div>
              <div className="text-sm uppercase tracking-wider text-[#95a5a6]">Pacientes únicos</div>
              <div className="text-3xl font-light text-[#2c3e50]">{patients.length}</div>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-[#bec5a4]/20 p-6 flex items-center">
            <div className="w-14 h-14 bg-gradient-to-br from-[#bec5a4]/10 to-[#aab38c]/10 rounded-2xl flex items-center justify-center mr-4">
              <FaHeartbeat className="text-2xl text-[#bec5a4]" />
            </div>
            <div>
              <div className="text-sm uppercase tracking-wider text-[#95a5a6]">Beneficiarios</div>
              <div className="text-3xl font-light text-[#2c3e50]">{patients.filter(p => p.isBeneficiary).length}</div>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-[#bec5a4]/20 p-6 flex items-center">
            <div className="w-14 h-14 bg-gradient-to-br from-[#bec5a4]/10 to-[#aab38c]/10 rounded-2xl flex items-center justify-center mr-4">
              <FaChartLine className="text-2xl text-[#bec5a4]" />
            </div>
            <div>
              <div className="text-sm uppercase tracking-wider text-[#95a5a6]">Edad promedio</div>
              <div className="text-3xl font-light text-[#2c3e50]">
                {patients.length > 0 
                  ? Math.round(patients.reduce((sum, p) => sum + (p.age || 0), 0) / patients.length)
                  : 0} años
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#bec5a4] to-[#aab38c] rounded-xl flex items-center justify-center mr-3 shadow-md">
              <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-serif text-[#2c3e50]">SanaTú Guingar</h3>
          </div>
          <p className="text-sm text-[#95a5a6] max-w-2xl mx-auto">
            Plataforma de gestión clínica premium para profesionales de la salud mental.
            Transformando la atención psicológica con tecnología de vanguardia.
          </p>
          <div className="mt-4 text-xs text-[#bdc3c7]">
            © {new Date().getFullYear()} SanaTú Quingar. Todos los derechos reservados.
          </div>
        </div>
      </div>

      {/* Modal de detalles de historia clínica */}
      {isDetailModalOpen && selectedPatient && (
        <MedicalRecordDetailsModal 
          record={selectedPatient as unknown as MedicalRecordWithUser} 
          onClose={closeModals}
        />
      )}
      
      {/* Modal de edición de paciente (completo) */}
      {editingPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#bec5a4]/20">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif text-[#2c3e50]">Editar Paciente</h3>
                <button onClick={closeModals} className="text-[#95a5a6] hover:text-[#2c3e50] transition-colors">
                  <FaTimes size={20} />
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleSavePatient(); }} className="space-y-5">
                {/* Nombre completo */}
                <div>
                  <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Nombre completo</label>
                  <input
                    type="text"
                    name="patientName"
                    value={editingPatient.patientName}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                    required
                  />
                </div>
                
                {/* Tipo y número de identificación */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Tipo de identificación</label>
                    <select
                      name="identificationType"
                      value={editingPatient.identificationType}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      required
                    >
                      <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                      <option value="Cédula de extranjería">Cédula de extranjería</option>
                      <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                      <option value="Pasaporte">Pasaporte</option>
                      <option value="Registro civil">Registro civil</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Número de identificación</label>
                    <input
                      type="text"
                      name="identificationNumber"
                      value={editingPatient.identificationNumber}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      required
                    />
                  </div>
                </div>
                
                {/* Fecha de nacimiento y edad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Fecha de nacimiento</label>
                    <input
                      type="date"
                      name="birthDate"
                      value={editingPatient.birthDate || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Edad</label>
                    <input
                      type="number"
                      name="age"
                      value={editingPatient.age || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                    />
                  </div>
                </div>
                
                {/* Escolaridad y ocupación */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Escolaridad</label>
                    <input
                      type="text"
                      name="educationLevel"
                      value={editingPatient.educationLevel || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Ocupación</label>
                    <input
                      type="text"
                      name="occupation"
                      value={editingPatient.occupation || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                    />
                  </div>
                </div>
                
                {/* Lugar de nacimiento y nacionalidad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Lugar de nacimiento</label>
                    <input
                      type="text"
                      name="birthPlace"
                      value={editingPatient.birthPlace || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Nacionalidad</label>
                    <input
                      type="text"
                      name="nationality"
                      value={editingPatient.nationality || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                    />
                  </div>
                </div>
                
                {/* Religión */}
                <div>
                  <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Religión</label>
                  <input
                    type="text"
                    name="religion"
                    value={editingPatient.religion || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                  />
                </div>
                
                {/* Dirección completa */}
                <div>
                  <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Dirección</label>
                  <input
                    type="text"
                    name="address"
                    value={editingPatient.address || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                  />
                </div>
                
                {/* Ciudad, departamento, barrio */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Ciudad</label>
                    <input
                      type="text"
                      name="city"
                      value={editingPatient.city || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Departamento</label>
                    <input
                      type="text"
                      name="state"
                      value={editingPatient.state || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Barrio</label>
                    <input
                      type="text"
                      name="neighborhood"
                      value={editingPatient.neighborhood || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                    />
                  </div>
                </div>
                
                {/* Teléfono, celular, email */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Teléfono</label>
                    <input
                      type="text"
                      name="phone"
                      value={editingPatient.phone || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Celular</label>
                    <input
                      type="text"
                      name="cellPhone"
                      value={editingPatient.cellPhone || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editingPatient.email || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                    />
                  </div>
                </div>
                
                {/* EPS y fecha de ingreso */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#7f8c8d] mb-2">EPS</label>
                    <input
                      type="text"
                      name="eps"
                      value={editingPatient.eps || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Fecha de ingreso</label>
                    <input
                      type="date"
                      name="admissionDate"
                      value={editingPatient.admissionDate || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                    />
                  </div>
                </div>
                
                {/* Beneficiario y remitido por */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex items-center">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="isBeneficiary"
                        checked={editingPatient.isBeneficiary || false}
                        onChange={handleEditChange}
                        className="form-checkbox h-5 w-5 text-[#bec5a4] bg-[#f9f9f9] border-[#e0e0e0] rounded focus:ring-[#bec5a4]"
                      />
                      <span className="ml-2 text-sm text-[#2c3e50]">Es beneficiario</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Remitido por</label>
                    <input
                      type="text"
                      name="referredBy"
                      value={editingPatient.referredBy || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                    />
                  </div>
                </div>
                
                {/* Responsable 1 */}
                <div className="border-t border-[#e0e0e0] pt-5 mt-5">
                  <h4 className="text-lg font-serif text-[#2c3e50] mb-4">Responsable 1</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Nombre</label>
                      <input
                        type="text"
                        name="guardian1Name"
                        value={editingPatient.guardian1Name || ''}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Parentesco</label>
                      <input
                        type="text"
                        name="guardian1Relationship"
                        value={editingPatient.guardian1Relationship || ''}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Teléfono</label>
                      <input
                        type="text"
                        name="guardian1Phone"
                        value={editingPatient.guardian1Phone || ''}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Ocupación</label>
                      <input
                        type="text"
                        name="guardian1Occupation"
                        value={editingPatient.guardian1Occupation || ''}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Responsable 2 */}
                <div className="border-t border-[#e0e0e0] pt-5 mt-5">
                  <h4 className="text-lg font-serif text-[#2c3e50] mb-4">Responsable 2</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Nombre</label>
                      <input
                        type="text"
                        name="guardian2Name"
                        value={editingPatient.guardian2Name || ''}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Parentesco</label>
                      <input
                        type="text"
                        name="guardian2Relationship"
                        value={editingPatient.guardian2Relationship || ''}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Teléfono</label>
                      <input
                        type="text"
                        name="guardian2Phone"
                        value={editingPatient.guardian2Phone || ''}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Ocupación</label>
                      <input
                        type="text"
                        name="guardian2Occupation"
                        value={editingPatient.guardian2Occupation || ''}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Profesional a cargo */}
                <div className="border-t border-[#e0e0e0] pt-5 mt-5">
                  <h4 className="text-lg font-serif text-[#2c3e50] mb-4">Profesional a cargo</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Atendido por</label>
                      <input
                        type="text"
                        name="attendedBy"
                        value={editingPatient.attendedBy || ''}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Número de tarjeta profesional</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={editingPatient.licenseNumber || ''}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Antecedentes personales */}
                <div className="border-t border-[#e0e0e0] pt-5 mt-5">
                  <h4 className="text-lg font-serif text-[#2c3e50] mb-4">Antecedentes Personales</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Patológicos</label>
                      <textarea
                        name="personalPathological"
                        value={editingPatient.personalPathological || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Quirúrgicos</label>
                      <textarea
                        name="personalSurgical"
                        value={editingPatient.personalSurgical || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Psicopatológicos</label>
                      <textarea
                        name="personalPsychopathological"
                        value={editingPatient.personalPsychopathological || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Historia de trauma o abuso</label>
                      <textarea
                        name="traumaHistory"
                        value={editingPatient.traumaHistory || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Estado del sueño</label>
                      <textarea
                        name="sleepStatus"
                        value={editingPatient.sleepStatus || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Consumo de sustancias psicoactivas</label>
                      <textarea
                        name="substanceUse"
                        value={editingPatient.substanceUse || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Otros</label>
                      <textarea
                        name="personalOther"
                        value={editingPatient.personalOther || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Antecedentes familiares */}
                <div className="border-t border-[#e0e0e0] pt-5 mt-5">
                  <h4 className="text-lg font-serif text-[#2c3e50] mb-4">Antecedentes Familiares</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Patológicos</label>
                      <textarea
                        name="familyPathological"
                        value={editingPatient.familyPathological || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Quirúrgicos</label>
                      <textarea
                        name="familySurgical"
                        value={editingPatient.familySurgical || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Psicopatológicos</label>
                      <textarea
                        name="familyPsychopathological"
                        value={editingPatient.familyPsychopathological || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Traumáticos</label>
                      <textarea
                        name="familyTraumatic"
                        value={editingPatient.familyTraumatic || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Consumo de sustancias psicoactivas</label>
                      <textarea
                        name="familySubstanceUse"
                        value={editingPatient.familySubstanceUse || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Otros</label>
                      <textarea
                        name="familyOther"
                        value={editingPatient.familyOther || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Desarrollo */}
                <div className="border-t border-[#e0e0e0] pt-5 mt-5">
                  <h4 className="text-lg font-serif text-[#2c3e50] mb-4">Desarrollo</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Embarazo</label>
                      <textarea
                        name="pregnancyInfo"
                        value={editingPatient.pregnancyInfo || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Parto</label>
                      <textarea
                        name="deliveryInfo"
                        value={editingPatient.deliveryInfo || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Desarrollo psicomotor</label>
                      <textarea
                        name="psychomotorDevelopment"
                        value={editingPatient.psychomotorDevelopment || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Dinámica familiar</label>
                      <textarea
                        name="familyDynamics"
                        value={editingPatient.familyDynamics || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Información clínica */}
                <div className="border-t border-[#e0e0e0] pt-5 mt-5">
                  <h4 className="text-lg font-serif text-[#2c3e50] mb-4">Información Clínica</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Motivo de consulta</label>
                      <textarea
                        name="consultationReason"
                        value={editingPatient.consultationReason || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Historia del problema</label>
                      <textarea
                        name="problemHistory"
                        value={editingPatient.problemHistory || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Expectativas de la terapia</label>
                      <textarea
                        name="therapyExpectations"
                        value={editingPatient.therapyExpectations || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Examen mental</label>
                      <textarea
                        name="mentalExam"
                        value={editingPatient.mentalExam || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Evaluación psicológica</label>
                      <textarea
                        name="psychologicalAssessment"
                        value={editingPatient.psychologicalAssessment || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Diagnóstico (DSM5-CIE10)</label>
                      <textarea
                        name="diagnosis"
                        value={editingPatient.diagnosis || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Objetivos terapéuticos</label>
                      <textarea
                        name="therapeuticGoals"
                        value={editingPatient.therapeuticGoals || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Plan terapéutico</label>
                      <textarea
                        name="treatmentPlan"
                        value={editingPatient.treatmentPlan || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Derivación/Remisión</label>
                      <textarea
                        name="referralInfo"
                        value={editingPatient.referralInfo || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Recomendaciones</label>
                      <textarea
                        name="recommendations"
                        value={editingPatient.recommendations || ''}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#7f8c8d] mb-2">Evolución</label>
                      <textarea
                        name="evolution"
                        value={editingPatient.evolution || ''}
                        onChange={handleEditChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50]"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-6 py-3 bg-[#f2f2f2] text-[#7f8c8d] rounded-xl hover:bg-[#e8e8e8] transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#bec5a4] to-[#aab38c] text-white rounded-xl hover:from-[#aab38c] hover:to-[#bec5a4] transition-all shadow-md shadow-[#bec5a4]/30"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && patientToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 border border-[#bec5a4]/20">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-400/20 to-red-500/20 rounded-2xl flex items-center justify-center mb-4">
                <FaTrash className="text-red-400 text-2xl" />
              </div>
              <h3 className="text-2xl font-serif text-[#2c3e50] mb-2">Confirmar Eliminación</h3>
              <p className="text-[#7f8c8d]">
                ¿Estás seguro de que deseas eliminar al paciente <span className="font-medium text-[#2c3e50]">{patientToDelete.patientName}</span>? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={closeModals}
                className="px-6 py-3 bg-[#f2f2f2] text-[#7f8c8d] rounded-xl hover:bg-[#e8e8e8] transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletePatient}
                className="px-6 py-3 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-xl hover:from-red-500 hover:to-red-600 transition-all shadow-md shadow-red-400/30"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientReceptionDashboard;