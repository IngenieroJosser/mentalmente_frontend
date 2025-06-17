'use client';
import React, { useState, useEffect } from 'react';
import { createHistory, updateHistory, getHistoryById } from '@/services/historyService';
import { MedicalRecord } from '@prisma/client';
import { format } from 'date-fns';
import { HistoryFormProps } from '@/lib/type';
import { useAuth } from '@/context/AuthContext';
import { FaUser, FaIdCard, FaCalendarAlt, FaPhone, FaEnvelope, FaHospital, FaNotesMedical, FaClipboardList, FaFlask, FaStethoscope, FaFileMedical, FaSave, FaTimes } from 'react-icons/fa';

const HistoryForm: React.FC<HistoryFormProps> = ({ historyId, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<MedicalRecord>>({
    patientName: '',
    identificationType: 'Cédula',
    identificationNumber: '',
    birthDate: new Date(),
    age: undefined,
    educationLevel: '',
    occupation: '',
    birthPlace: '',
    nationality: '',
    religion: '',
    address: '',
    neighborhood: '',
    city: '',
    state: '',
    admissionDate: new Date(),
    phone: '',
    cellPhone: '',
    email: '',
    eps: '',
    isBeneficiary: false,
    referredBy: '',
    guardian1Name: '',
    guardian1Relationship: '',
    guardian1Phone: '',
    guardian1Occupation: '',
    guardian2Name: '',
    guardian2Relationship: '',
    guardian2Phone: '',
    guardian2Occupation: '',
    attendedBy: '',
    licenseNumber: '',
    personalPathological: '',
    personalSurgical: '',
    personalPsychopathological: '',
    traumaHistory: '',
    sleepStatus: '',
    substanceUse: '',
    personalOther: '',
    familyPathological: '',
    familySurgical: '',
    familyPsychopathological: '',
    familyTraumatic: '',
    familySubstanceUse: '',
    familyOther: '',
    pregnancyInfo: '',
    deliveryInfo: '',
    psychomotorDevelopment: '',
    familyDynamics: '',
    consultationReason: '',
    problemHistory: '',
    therapyExpectations: '',
    mentalExam: '',
    psychologicalAssessment: '',
    diagnosis: '',
    therapeuticGoals: '',
    treatmentPlan: '',
    referralInfo: '',
    recommendations: '',
    evolution: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');

  useEffect(() => {
    if (historyId) {
      const loadHistory = async () => {
        setIsFormLoading(true);
        try {
          const history = await getHistoryById(historyId);
          if (history.birthDate) {
            history.birthDate = new Date(history.birthDate);
          }
          if (history.admissionDate) {
            history.admissionDate = new Date(history.admissionDate);
          }
          setFormData(history);
        } catch (error) {
          console.error('Error cargando historia:', error);
        } finally {
          setIsFormLoading(false);
        }
      };
      loadHistory();
    }
  }, [historyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value ? new Date(value) : null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      console.error('Usuario no autenticado');
      return;
    }

    setIsLoading(true);
    try {
      const dataToSend = {
        ...formData,
        userId: user.id,
        recordNumber: formData.recordNumber || `HC-${Date.now()}`
      };

      if (historyId) {
        await updateHistory(historyId, dataToSend);
      } else {
        await createHistory(dataToSend as any);
      }
      onSuccess();
    } catch (error) {
      console.error('Error guardando historia:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateForInput = (date: Date | null | undefined) => {
    if (!date) return '';
    try {
      return format(date, 'yyyy-MM-dd');
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return '';
    }
  };

  const sectionItems = [
    { id: 'personal', label: 'Personal', icon: <FaUser /> },
    { id: 'guardians', label: 'Responsables', icon: <FaIdCard /> },
    { id: 'professional', label: 'Profesional', icon: <FaStethoscope /> },
    { id: 'personalHistory', label: 'Antecedentes', icon: <FaNotesMedical /> },
    { id: 'familyHistory', label: 'Familiares', icon: <FaClipboardList /> },
    { id: 'development', label: 'Desarrollo', icon: <FaFlask /> },
    { id: 'clinical', label: 'Clínica', icon: <FaFileMedical /> },
    { id: 'evolution', label: 'Evolución', icon: <FaHospital /> }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-[#19334c]">
            {historyId ? 'Editar Historia Clínica' : 'Nueva Historia Clínica'}
          </h2>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-[#c77914] transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>
        
        {isFormLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#c77914] mb-4"></div>
            <p className="text-[#19334c] font-medium">Cargando información...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Navegación por secciones */}
            <div className="bg-[#f8f9fa] p-3 rounded-lg mb-6">
              <div className="flex flex-wrap gap-2">
                {sectionItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center px-4 py-2 rounded-full transition-all ${
                      activeSection === item.id
                        ? 'bg-[#19334c] text-white shadow-md'
                        : 'bg-white text-[#19334c] border border-[#19334c] hover:bg-[#19334c]/10'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sección 1: Información personal */}
            {(activeSection === 'personal') && (
            <div className="border border-[#e0e7ff] rounded-xl overflow-hidden">
              <div className="bg-[#19334c] p-4 flex items-center">
                <FaUser className="text-white mr-2" />
                <h3 className="font-semibold text-lg text-white">Información Personal</h3>
              </div>
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center">
                      <FaUser className="mr-2 text-[#c77914]" />
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName || ''}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center">
                      <FaIdCard className="mr-2 text-[#c77914]" />
                      Tipo de identificación *
                    </label>
                    <select
                      name="identificationType"
                      value={formData.identificationType || ''}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    >
                      <option value="Cédula">Cédula</option>
                      <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                      <option value="Pasaporte">Pasaporte</option>
                      <option value="Registro civil">Registro civil</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center">
                      <FaIdCard className="mr-2 text-[#c77914]" />
                      Número de identificación *
                    </label>
                    <input
                      type="text"
                      name="identificationNumber"
                      value={formData.identificationNumber || ''}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center">
                      <FaCalendarAlt className="mr-2 text-[#c77914]" />
                      Fecha de nacimiento
                    </label>
                    <input
                      type="date"
                      value={formatDateForInput(formData.birthDate)}
                      onChange={(e) => handleDateChange('birthDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Edad</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Número de registro *</label>
                    <input
                      type="text"
                      name="recordNumber"
                      value={formData.recordNumber || ''}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nivel educativo</label>
                    <input
                      type="text"
                      name="educationLevel"
                      value={formData.educationLevel || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ocupación</label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Lugar de nacimiento</label>
                    <input
                      type="text"
                      name="birthPlace"
                      value={formData.birthPlace || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nacionalidad</label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Religión</label>
                    <input
                      type="text"
                      name="religion"
                      value={formData.religion || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Dirección</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Barrio</label>
                    <input
                      type="text"
                      name="neighborhood"
                      value={formData.neighborhood || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ciudad</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Departamento</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha de ingreso</label>
                    <input
                      type="date"
                      value={formatDateForInput(formData.admissionDate)}
                      onChange={(e) => handleDateChange('admissionDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center">
                      <FaPhone className="mr-2 text-[#c77914]" />
                      Teléfono fijo
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center">
                      <FaPhone className="mr-2 text-[#c77914]" />
                      Celular
                    </label>
                    <input
                      type="text"
                      name="cellPhone"
                      value={formData.cellPhone || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center">
                      <FaEnvelope className="mr-2 text-[#c77914]" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center">
                      <FaHospital className="mr-2 text-[#c77914]" />
                      EPS
                    </label>
                    <input
                      type="text"
                      name="eps"
                      value={formData.eps || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isBeneficiary"
                      checked={formData.isBeneficiary || false}
                      onChange={handleChange}
                      className="rounded text-[#c77914] focus:ring-[#c77914]"
                    />
                    <label className="text-sm font-medium ml-2">¿Es beneficiario?</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Referido por</label>
                    <input
                      type="text"
                      name="referredBy"
                      value={formData.referredBy || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Sección 2: Responsables */}
            {(activeSection === 'guardians') && (
            <div className="border border-[#e0e7ff] rounded-xl overflow-hidden">
              <div className="bg-[#19334c] p-4 flex items-center">
                <FaIdCard className="text-white mr-2" />
                <h3 className="font-semibold text-lg text-white">Responsables</h3>
              </div>
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#f9fafb] p-4 rounded-lg border border-[#e0e7ff]">
                    <h4 className="font-medium text-md text-[#19334c] mb-4 border-b pb-2">Responsable 1</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nombre completo</label>
                        <input
                          type="text"
                          name="guardian1Name"
                          value={formData.guardian1Name || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Parentesco</label>
                        <input
                          type="text"
                          name="guardian1Relationship"
                          value={formData.guardian1Relationship || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 flex items-center">
                          <FaPhone className="mr-2 text-[#c77914]" />
                          Teléfono
                        </label>
                        <input
                          type="text"
                          name="guardian1Phone"
                          value={formData.guardian1Phone || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Ocupación</label>
                        <input
                          type="text"
                          name="guardian1Occupation"
                          value={formData.guardian1Occupation || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f9fafb] p-4 rounded-lg border border-[#e0e7ff]">
                    <h4 className="font-medium text-md text-[#19334c] mb-4 border-b pb-2">Responsable 2</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nombre completo</label>
                        <input
                          type="text"
                          name="guardian2Name"
                          value={formData.guardian2Name || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Parentesco</label>
                        <input
                          type="text"
                          name="guardian2Relationship"
                          value={formData.guardian2Relationship || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 flex items-center">
                          <FaPhone className="mr-2 text-[#c77914]" />
                          Teléfono
                        </label>
                        <input
                          type="text"
                          name="guardian2Phone"
                          value={formData.guardian2Phone || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Ocupación</label>
                        <input
                          type="text"
                          name="guardian2Occupation"
                          value={formData.guardian2Occupation || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Sección 3: Atendido por */}
            {(activeSection === 'professional') && (
            <div className="border border-[#e0e7ff] rounded-xl overflow-hidden">
              <div className="bg-[#19334c] p-4 flex items-center">
                <FaStethoscope className="text-white mr-2" />
                <h3 className="font-semibold text-lg text-white">Atendido por</h3>
              </div>
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre del profesional</label>
                    <input
                      type="text"
                      name="attendedBy"
                      value={formData.attendedBy || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Número de licencia</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Sección 4: Antecedentes personales */}
            {(activeSection === 'personalHistory') && (
            <div className="border border-[#e0e7ff] rounded-xl overflow-hidden">
              <div className="bg-[#19334c] p-4 flex items-center">
                <FaNotesMedical className="text-white mr-2" />
                <h3 className="font-semibold text-lg text-white">Antecedentes personales</h3>
              </div>
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Patológicos</label>
                    <textarea
                      name="personalPathological"
                      value={formData.personalPathological || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Quirúrgicos</label>
                    <textarea
                      name="personalSurgical"
                      value={formData.personalSurgical || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Psicopatológicos</label>
                    <textarea
                      name="personalPsychopathological"
                      value={formData.personalPsychopathological || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Historia traumática</label>
                    <textarea
                      name="traumaHistory"
                      value={formData.traumaHistory || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Estado del sueño</label>
                    <textarea
                      name="sleepStatus"
                      value={formData.sleepStatus || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Uso de sustancias</label>
                    <textarea
                      name="substanceUse"
                      value={formData.substanceUse || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Otros</label>
                    <textarea
                      name="personalOther"
                      value={formData.personalOther || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Sección 5: Antecedentes familiares */}
            {(activeSection === 'familyHistory') && (
            <div className="border border-[#e0e7ff] rounded-xl overflow-hidden">
              <div className="bg-[#19334c] p-4 flex items-center">
                <FaClipboardList className="text-white mr-2" />
                <h3 className="font-semibold text-lg text-white">Antecedentes familiares</h3>
              </div>
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Patológicos</label>
                    <textarea
                      name="familyPathological"
                      value={formData.familyPathological || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Quirúrgicos</label>
                    <textarea
                      name="familySurgical"
                      value={formData.familySurgical || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Psicopatológicos</label>
                    <textarea
                      name="familyPsychopathological"
                      value={formData.familyPsychopathological || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Traumáticos</label>
                    <textarea
                      name="familyTraumatic"
                      value={formData.familyTraumatic || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Uso de sustancias</label>
                    <textarea
                      name="familySubstanceUse"
                      value={formData.familySubstanceUse || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Otros</label>
                    <textarea
                      name="familyOther"
                      value={formData.familyOther || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Sección 6: Datos del desarrollo */}
            {(activeSection === 'development') && (
            <div className="border border-[#e0e7ff] rounded-xl overflow-hidden">
              <div className="bg-[#19334c] p-4 flex items-center">
                <FaFlask className="text-white mr-2" />
                <h3 className="font-semibold text-lg text-white">Datos del desarrollo</h3>
              </div>
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Embarazo</label>
                    <textarea
                      name="pregnancyInfo"
                      value={formData.pregnancyInfo || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Parto</label>
                    <textarea
                      name="deliveryInfo"
                      value={formData.deliveryInfo || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Desarrollo psicomotor</label>
                    <textarea
                      name="psychomotorDevelopment"
                      value={formData.psychomotorDevelopment || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Dinámica familiar</label>
                    <textarea
                      name="familyDynamics"
                      value={formData.familyDynamics || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Sección 7: Información clínica */}
            {(activeSection === 'clinical') && (
            <div className="border border-[#e0e7ff] rounded-xl overflow-hidden">
              <div className="bg-[#19334c] p-4 flex items-center">
                <FaFileMedical className="text-white mr-2" />
                <h3 className="font-semibold text-lg text-white">Información clínica</h3>
              </div>
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Motivo de consulta</label>
                    <textarea
                      name="consultationReason"
                      value={formData.consultationReason || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Historia del problema</label>
                    <textarea
                      name="problemHistory"
                      value={formData.problemHistory || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Expectativas de terapia</label>
                    <textarea
                      name="therapyExpectations"
                      value={formData.therapyExpectations || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Examen mental</label>
                    <textarea
                      name="mentalExam"
                      value={formData.mentalExam || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Evaluación psicológica</label>
                    <textarea
                      name="psychologicalAssessment"
                      value={formData.psychologicalAssessment || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Diagnóstico</label>
                    <textarea
                      name="diagnosis"
                      value={formData.diagnosis || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Objetivos terapéuticos</label>
                    <textarea
                      name="therapeuticGoals"
                      value={formData.therapeuticGoals || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Plan de tratamiento</label>
                    <textarea
                      name="treatmentPlan"
                      value={formData.treatmentPlan || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Información de referencia</label>
                    <textarea
                      name="referralInfo"
                      value={formData.referralInfo || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Recomendaciones</label>
                    <textarea
                      name="recommendations"
                      value={formData.recommendations || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                    />
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Sección 8: Evolución */}
            {(activeSection === 'evolution') && (
            <div className="border border-[#e0e7ff] rounded-xl overflow-hidden">
              <div className="bg-[#19334c] p-4 flex items-center">
                <FaHospital className="text-white mr-2" />
                <h3 className="font-semibold text-lg text-white">Evolución</h3>
              </div>
              <div className="p-4 bg-white">
                <div>
                  <textarea
                    name="evolution"
                    value={formData.evolution || ''}
                    onChange={handleChange}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/50"
                  />
                </div>
              </div>
            </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-between mt-6">
              <div>
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-5 py-2.5 border border-[#19334c] text-[#19334c] font-medium rounded-lg hover:bg-gray-50 flex items-center"
                >
                  <FaTimes className="mr-2" />
                  Cancelar
                </button>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-[#19334c] text-white font-medium rounded-lg hover:bg-[#c77914] transition-colors flex items-center disabled:bg-gray-400"
                >
                  <FaSave className="mr-2" />
                  {isLoading ? 'Guardando...' : 'Guardar Historia'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default HistoryForm;