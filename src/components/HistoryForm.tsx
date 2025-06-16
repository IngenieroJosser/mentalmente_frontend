'use client';
import React, { useState, useEffect } from 'react';
import { createHistory, updateHistory, getHistoryById } from '@/services/historyService';
import { MedicalRecord } from '@prisma/client';
import { format } from 'date-fns';
import { HistoryFormProps } from '@/lib/type';
import { useAuth } from '@/context/AuthContext';

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

  useEffect(() => {
    if (historyId) {
      const loadHistory = async () => {
        setIsFormLoading(true);
        try {
          const history = await getHistoryById(historyId);
          // Convertir fechas de string a Date
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
    setIsLoading(true);
    try {
      if (historyId) {
        await updateHistory(historyId, formData);
      } else {
        await createHistory({
          ...formData,
          userId: user?.id || 1,  // Usar el ID del usuario autenticado
        } as any);
      }
      onSuccess(); // Cerrar formulario y recargar historias
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {historyId ? 'Editar Historia Clínica' : 'Nueva Historia Clínica'}
        </h2>
        
        {isFormLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c77914]"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección 1: Información personal */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-[#19334c] mb-4">Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre completo *</label>
                  <input
                    aria-label='Nombre completo'
                    type="text"
                    name="patientName"
                    value={formData.patientName || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de identificación *</label>
                  <select
                    aria-label='Tipo de identificación'
                    name="identificationType"
                    value={formData.identificationType || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="Cédula">Cédula</option>
                    <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                    <option value="Pasaporte">Pasaporte</option>
                    <option value="Registro civil">Registro civil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Número de identificación *</label>
                  <input
                    aria-label='Número de identificación'
                    type="text"
                    name="identificationNumber"
                    value={formData.identificationNumber || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha de nacimiento</label>
                  <input
                    aria-label='Fecha de nacimiento'
                    type="date"
                    value={formatDateForInput(formData.birthDate)}
                    onChange={(e) => handleDateChange('birthDate', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Edad</label>
                  <input
                    aria-label='Edad'
                    type="number"
                    name="age"
                    value={formData.age || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nivel educativo</label>
                  <input
                    aria-label='Nivel educativo'
                    type="text"
                    name="educationLevel"
                    value={formData.educationLevel || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ocupación</label>
                  <input
                    aria-label='Ocupación'
                    type="text"
                    name="occupation"
                    value={formData.occupation || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lugar de nacimiento</label>
                  <input
                    aria-label='Lugar de nacimiento'
                    type="text"
                    name="birthPlace"
                    value={formData.birthPlace || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nacionalidad</label>
                  <input
                    aria-label='Nacionalidad'
                    type="text"
                    name="nationality"
                    value={formData.nationality || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Religión</label>
                  <input
                    aria-label='Religión'
                    type="text"
                    name="religion"
                    value={formData.religion || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dirección</label>
                  <input
                    aria-label='Dirección'
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Barrio</label>
                  <input
                    aria-label='Barrio'
                    type="text"
                    name="neighborhood"
                    value={formData.neighborhood || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ciudad</label>
                  <input
                    aria-label='Ciudad'
                    type="text"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Departamento</label>
                  <input
                    aria-label='Departamento'
                    type="text"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha de ingreso</label>
                  <input
                    aria-label='Fecha de ingreso'
                    type="date"
                    value={formatDateForInput(formData.admissionDate)}
                    onChange={(e) => handleDateChange('admissionDate', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono fijo</label>
                  <input
                    aria-label='Teléfono fijo'
                    type="text"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Celular</label>
                  <input
                    aria-label='Celular'
                    type="text"
                    name="cellPhone"
                    value={formData.cellPhone || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    aria-label='Email'
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">EPS</label>
                  <input
                    aria-label='EPS'
                    type="text"
                    name="eps"
                    value={formData.eps || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    aria-label='Es beneficiario'
                    type="checkbox"
                    name="isBeneficiary"
                    checked={formData.isBeneficiary || false}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium">¿Es beneficiario?</label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Referido por</label>
                  <input
                    aria-label='Referido por'
                    type="text"
                    name="referredBy"
                    value={formData.referredBy || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Sección 2: Responsables */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-[#19334c] mb-4">Responsables</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <h4 className="font-medium text-md text-[#19334c] mb-2">Responsable 1</h4>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre completo</label>
                  <input
                    aria-label='Nombre completo'
                    type="text"
                    name="guardian1Name"
                    value={formData.guardian1Name || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Parentesco</label>
                  <input
                    aria-label='Parentesco'
                    type="text"
                    name="guardian1Relationship"
                    value={formData.guardian1Relationship || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono</label>
                  <input
                    aria-label='Teléfono'
                    type="text"
                    name="guardian1Phone"
                    value={formData.guardian1Phone || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ocupación</label>
                  <input
                    aria-label='Ocupación'
                    type="text"
                    name="guardian1Occupation"
                    value={formData.guardian1Occupation || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="col-span-2">
                  <h4 className="font-medium text-md text-[#19334c] mb-2">Responsable 2</h4>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre completo</label>
                  <input
                    aria-label='Nombre completo'
                    type="text"
                    name="guardian2Name"
                    value={formData.guardian2Name || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Parentesco</label>
                  <input
                    aria-label='Parentesco'
                    type="text"
                    name="guardian2Relationship"
                    value={formData.guardian2Relationship || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono</label>
                  <input
                    aria-label='Teléfono'
                    type="text"
                    name="guardian2Phone"
                    value={formData.guardian2Phone || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ocupación</label>
                  <input
                    aria-label='Ocupación'
                    type="text"
                    name="guardian2Occupation"
                    value={formData.guardian2Occupation || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Sección 3: Atendido por */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-[#19334c] mb-4">Atendido por</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre del profesional</label>
                  <input
                    aria-label='Nombre del profesional'
                    type="text"
                    name="attendedBy"
                    value={formData.attendedBy || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Número de licencia</label>
                  <input
                    aria-label='Número de licencia'
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Sección 4: Antecedentes personales */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-[#19334c] mb-4">Antecedentes personales</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Patológicos</label>
                  <textarea
                    aria-label='Patológicos'
                    name="personalPathological"
                    value={formData.personalPathological || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quirúrgicos</label>
                  <textarea
                    aria-label='Quirúrgicos'
                    name="personalSurgical"
                    value={formData.personalSurgical || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Psicopatológicos</label>
                  <textarea
                    aria-label='Psicopatológicos'
                    name="personalPsychopathological"
                    value={formData.personalPsychopathological || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Historia traumática</label>
                  <textarea
                    aria-label='Historia traumática'
                    name="traumaHistory"
                    value={formData.traumaHistory || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estado del sueño</label>
                  <textarea
                    aria-label='Estado del sueño'
                    name="sleepStatus"
                    value={formData.sleepStatus || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Uso de sustancias</label>
                  <textarea
                    aria-label='Uso de sustancias'
                    name="substanceUse"
                    value={formData.substanceUse || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Otros</label>
                  <textarea
                    aria-label='Otros'
                    name="personalOther"
                    value={formData.personalOther || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Sección 5: Antecedentes familiares */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-[#19334c] mb-4">Antecedentes familiares</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Patológicos</label>
                  <textarea
                    aria-label='Patológicos'
                    name="familyPathological"
                    value={formData.familyPathological || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quirúrgicos</label>
                  <textarea
                    aria-label='Quirúrgicos'
                    name="familySurgical"
                    value={formData.familySurgical || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Psicopatológicos</label>
                  <textarea
                    aria-label='Psicopatológicos'
                    name="familyPsychopathological"
                    value={formData.familyPsychopathological || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Traumáticos</label>
                  <textarea
                    aria-label='Traumáticos'
                    name="familyTraumatic"
                    value={formData.familyTraumatic || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Uso de sustancias</label>
                  <textarea
                    aria-label='Uso de sustancias'
                    name="familySubstanceUse"
                    value={formData.familySubstanceUse || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Otros</label>
                  <textarea
                    aria-label='Otros'
                    name="familyOther"
                    value={formData.familyOther || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Sección 6: Datos del desarrollo */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-[#19334c] mb-4">Datos del desarrollo</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Embarazo</label>
                  <textarea
                    aria-label='Embarazo'
                    name="pregnancyInfo"
                    value={formData.pregnancyInfo || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Parto</label>
                  <textarea
                    aria-label='Parto'
                    name="deliveryInfo"
                    value={formData.deliveryInfo || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Desarrollo psicomotor</label>
                  <textarea
                    aria-label='Desarrollo psicomotor'
                    name="psychomotorDevelopment"
                    value={formData.psychomotorDevelopment || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dinámica familiar</label>
                  <textarea
                    aria-label='Dinamica familiar'
                    name="familyDynamics"
                    value={formData.familyDynamics || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Sección 7: Información clínica */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-[#19334c] mb-4">Información clínica</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Motivo de consulta</label>
                  <textarea
                    aria-label='Motivo de consulta'
                    name="consultationReason"
                    value={formData.consultationReason || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Historia del problema</label>
                  <textarea
                    aria-label='Historia del problema'
                    name="problemHistory"
                    value={formData.problemHistory || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expectativas de terapia</label>
                  <textarea
                    aria-label='Expectativa de terapia'
                    name="therapyExpectations"
                    value={formData.therapyExpectations || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Examen mental</label>
                  <textarea
                    aria-label='Examen mental'
                    name="mentalExam"
                    value={formData.mentalExam || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Evaluación psicológica</label>
                  <textarea
                    aria-label='Evaluación Psicológica'
                    name="psychologicalAssessment"
                    value={formData.psychologicalAssessment || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Diagnóstico</label>
                  <textarea
                    aria-label='Diagnostico'
                    name="diagnosis"
                    value={formData.diagnosis || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Objetivos terapéuticos</label>
                  <textarea
                    aria-label='Objetivo terapeutico'
                    name="therapeuticGoals"
                    value={formData.therapeuticGoals || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Plan de tratamiento</label>
                  <textarea
                    aria-label='Plan de tratamiento'
                    name="treatmentPlan"
                    value={formData.treatmentPlan || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Información de referencia</label>
                  <textarea
                    aria-label='Información de referencia'
                    name="referralInfo"
                    value={formData.referralInfo || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Recomendaciones</label>
                  <textarea
                    aria-label='Las recomendaciones'
                    name="recommendations"
                    value={formData.recommendations || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Sección 8: Evolución */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-[#19334c] mb-4">Evolución</h3>
              <div>
                <textarea
                  aria-label='Texto para la evolución del paciente'
                  name="evolution"
                  value={formData.evolution || ''}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-[#19334c] text-white rounded-lg disabled:bg-gray-400"
              >
                {isLoading ? 'Guardando...' : 'Guardar Historia'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default HistoryForm;