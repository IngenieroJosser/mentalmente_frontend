'use client';
import React, { useState, useEffect } from 'react';
import { createHistory, updateHistory, getHistoryById } from '@/services/historyService';
import { format } from 'date-fns';
import { HistoryFormProps } from '@/lib/type';
import { useAuth } from '@/context/AuthContext';
import { FaUser, FaIdCard, FaCalendarAlt, FaPhone, FaEnvelope, FaHospital, FaNotesMedical, FaClipboardList, FaFlask, FaStethoscope, FaFileMedical, FaSave, FaTimes, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { MedicalRecordFormData } from '@/lib/type';

const HistoryForm: React.FC<HistoryFormProps> = ({ historyId, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<MedicalRecordFormData>({
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
    recordNumber: `HC-${Date.now()}`,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Función para conversión segura de fechas
  const safeDateConversion = (dateValue: any): Date | null => {
    try {
      if (!dateValue) return null;
      if (dateValue instanceof Date) return dateValue;
      const parsedDate = new Date(dateValue);
      // Verificar si la fecha es válida
      if (isNaN(parsedDate.getTime())) return null;
      return parsedDate;
    } catch (error) {
      console.error('Error convirtiendo fecha:', dateValue, error);
      return null;
    }
  };

  useEffect(() => {
    if (historyId) {
      const loadHistory = async () => {
        setIsFormLoading(true);
        try {
          const history = await getHistoryById(historyId);
          
          // Convertir las fechas de manera segura
          const convertedHistory: MedicalRecordFormData = {
            ...history,
            birthDate: safeDateConversion(history.birthDate) || new Date(),
            admissionDate: safeDateConversion(history.admissionDate) || new Date(),
          };
          
          setFormData(convertedHistory);
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
    
    // Limpiar error cuando se modifica el campo
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Función especial para el campo de evolución
  const handleEvolutionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, evolution: e.target.value }));
  };

  // Prevenir el envío automático con Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Insertar un salto de línea en lugar de enviar
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      
      target.value = value.substring(0, start) + "\n" + value.substring(end);
      target.selectionStart = target.selectionEnd = start + 1;
      
      // Actualizar el estado
      setFormData(prev => ({ ...prev, evolution: target.value }));
    }
  };

  const handleDateChange = (name: string, value: string) => {
    const newDate = value ? new Date(value) : new Date();
    setFormData(prev => ({ ...prev, [name]: newDate }));
  };

  const validateSection = (section: string) => {
    const errors: Record<string, string> = {};
    
    if (section === 'personal') {
      if (!formData.patientName) errors.patientName = 'Nombre completo es requerido';
      if (!formData.identificationType) errors.identificationType = 'Tipo de identificación es requerido';
      if (!formData.identificationNumber) errors.identificationNumber = 'Número de identificación es requerido';
      if (!formData.recordNumber) errors.recordNumber = 'Número de registro es requerido';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('No se ha identificado al usuario. Por favor inicie sesión.');
      return;
    }

    setIsLoading(true);
    
    // Preparar los datos para enviar, asegurando que las fechas sean strings ISO o null
    const dataToSend: any = {
      ...formData,
      ...(!historyId && { userId: user.id }),
      age: formData.age ? Number(formData.age) : null,
      birthDate: formData.birthDate instanceof Date ? formData.birthDate.toISOString() : null,
      admissionDate: formData.admissionDate instanceof Date ? formData.admissionDate.toISOString() : null,
      recordNumber: formData.recordNumber || `HC-${Date.now()}`,
    };

    try {
      if (historyId) {
        const { id, userId, createdAt, updatedAt, user, ...updateData } = dataToSend;
        
        if (!id) {
          throw new Error('ID de historia clínica no válido');
        }

        await updateHistory(historyId, updateData);
        alert('Historia clínica actualizada exitosamente');
      } else {
        if (!dataToSend.patientName || !dataToSend.identificationNumber) {
          throw new Error('Nombre del paciente y número de identificación son requeridos');
        }

        await createHistory(dataToSend);
        alert('Historia clínica creada exitosamente');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error guardando historia:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Ocurrió un error al guardar la historia clínica';
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateForInput = (date: Date | null | undefined) => {
    // Si no es una instancia de Date, devolver cadena vacía
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
    try {
      return format(date, 'yyyy-MM-dd');
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return '';
    }
  };

  const sectionItems = [
    { id: 'personal', label: 'Información Personal', icon: <FaUser /> },
    { id: 'guardians', label: 'Responsables', icon: <FaIdCard /> },
    { id: 'professional', label: 'Profesional', icon: <FaStethoscope /> },
    { id: 'personalHistory', label: 'Antecedentes Personales', icon: <FaNotesMedical /> },
    { id: 'familyHistory', label: 'Antecedentes Familiares', icon: <FaClipboardList /> },
    { id: 'development', label: 'Desarrollo', icon: <FaFlask /> },
    { id: 'clinical', label: 'Información Clínica', icon: <FaFileMedical /> },
    { id: 'evolution', label: 'Evolución', icon: <FaHospital /> }
  ];

  const currentSectionIndex = sectionItems.findIndex(item => item.id === activeSection);
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === sectionItems.length - 1;

  const navigateToSection = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      if (validateSection(activeSection)) {
        const nextSection = sectionItems[currentSectionIndex + 1]?.id;
        if (nextSection) {
          setActiveSection(nextSection);
        }
      }
    } else {
      const prevSection = sectionItems[currentSectionIndex - 1]?.id;
      if (prevSection) {
        setActiveSection(prevSection);
      }
    }
  };

  const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <div className="flex items-center mb-6">
      <div className="bg-gradient-to-r from-[#19334c] to-[#2c5170] p-3 rounded-xl mr-3">
        <div className="text-white text-xl">{icon}</div>
      </div>
      <h2 className="text-2xl font-bold text-[#19334c]">{title}</h2>
    </div>
  );

  const renderField = (label: string, name: string, type: string = 'text', required: boolean = false) => (
    <div className={`mb-5 ${type === 'checkbox' ? 'flex items-center' : ''}`}>
      <label className={`block text-sm font-medium mb-1 ${type === 'checkbox' ? 'ml-2' : ''}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={formData[name as keyof MedicalRecordFormData] as string || ''}
          onChange={handleChange}
          rows={3}
          className={`w-full px-4 py-3 border ${
            formErrors[name] ? 'border-red-500' : 'border-[#e0e7ff]'
          } rounded-xl focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/20 bg-[#f8f9fc]`}
        />
      ) : type === 'checkbox' ? (
        <input
          type="checkbox"
          name={name}
          checked={formData[name as keyof MedicalRecordFormData] as boolean || false}
          onChange={handleChange}
          className="h-5 w-5 text-[#c77914] rounded-lg focus:ring-[#c77914]"
        />
      ) : type === 'date' ? (
        <input
          type="date"
          name={name}
          value={formatDateForInput(formData[name as keyof MedicalRecordFormData] as Date | null)}
          onChange={(e) => {
            handleDateChange(name, e.target.value);
          }}
          className={`w-full px-4 py-3 border ${
            formErrors[name] ? 'border-red-500' : 'border-[#e0e7ff]'
          } rounded-xl focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/20 bg-[#f8f9fc]`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name as keyof MedicalRecordFormData] as string || ''}
          onChange={handleChange}
          className={`w-full px-4 py-3 border ${
            formErrors[name] ? 'border-red-500' : 'border-[#e0e7ff]'
          } rounded-xl focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/20 bg-[#f8f9fc]`}
        />
      )}
      
      {formErrors[name] && (
        <p className="mt-1 text-sm text-red-500">{formErrors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-white to-[#f8f9fc] rounded-3xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e0e7ff]">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#e0e7ff]">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#19334c] to-[#c77914] bg-clip-text text-transparent">
              {historyId ? 'Editar Historia Clínica' : 'Nueva Historia Clínica'}
            </h1>
            <p className="text-[#19334c]/80 mt-1">
              {sectionItems[currentSectionIndex]?.label}
            </p>
          </div>
          <button 
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-[#e0e7ff] transition-colors"
          >
            <FaTimes className="text-[#19334c] text-xl" />
          </button>
        </div>
        
        {isFormLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#c77914] mb-4"></div>
            <p className="text-[#19334c] font-medium">Cargando información...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Barra de progreso */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-[#19334c]">
                  Paso {currentSectionIndex + 1} de {sectionItems.length}
                </span>
                <span className="text-sm font-medium text-[#19334c]">
                  {Math.round(((currentSectionIndex + 1) / sectionItems.length) * 100)}% completado
                </span>
              </div>
              <div className="h-2 bg-[#e0e7ff] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#19334c] to-[#2c5170]"
                  style={{ width: `${((currentSectionIndex + 1) / sectionItems.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Sección 1: Información personal */}
            {(activeSection === 'personal') && (
              <div>
                <SectionHeader icon={<FaUser />} title="Información Personal" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {renderField("Nombre completo *", "patientName", "text", true)}
                    {renderField("Tipo de identificación *", "identificationType", "select", true)}
                    {renderField("Número de identificación *", "identificationNumber", "text", true)}
                    {renderField("Fecha de nacimiento", "birthDate", "date")}
                    {renderField("Edad", "age", "number")}
                    {renderField("Número de registro *", "recordNumber", "text", true)}
                    {renderField("Nivel educativo", "educationLevel", "text")}
                  </div>
                  
                  <div>
                    {renderField("Ocupación", "occupation", "text")}
                    {renderField("Lugar de nacimiento", "birthPlace", "text")}
                    {renderField("Nacionalidad", "nationality", "text")}
                    {renderField("Religión", "religion", "text")}
                    {renderField("Dirección", "address", "text")}
                    {renderField("Barrio", "neighborhood", "text")}
                    {renderField("Ciudad", "city", "text")}
                  </div>
                  
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {renderField("Departamento", "state", "text")}
                    {renderField("Fecha de ingreso", "admissionDate", "date")}
                    {renderField("Teléfono fijo", "phone", "text")}
                    {renderField("Celular", "cellPhone", "text")}
                    {renderField("Email", "email", "email")}
                    {renderField("EPS", "eps", "text")}
                    <div className="flex items-center mt-6">
                      <input
                        type="checkbox"
                        name="isBeneficiary"
                        checked={formData.isBeneficiary || false}
                        onChange={handleChange}
                        className="h-5 w-5 text-[#c77914] rounded-lg focus:ring-[#c77914]"
                      />
                      <label className="text-sm font-medium ml-2">¿Es beneficiario?</label>
                    </div>
                    {renderField("Referido por", "referredBy", "text")}
                  </div>
                </div>
              </div>
            )}

            {/* Sección 2: Responsables */}
            {(activeSection === 'guardians') && (
              <div>
                <SectionHeader icon={<FaIdCard />} title="Responsables" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-b from-[#f8f9fc] to-white p-6 rounded-2xl border border-[#e0e7ff] shadow-sm">
                    <h3 className="font-bold text-lg text-[#19334c] mb-5 border-b pb-3">Responsable 1</h3>
                    {renderField("Nombre completo", "guardian1Name")}
                    {renderField("Parentesco", "guardian1Relationship")}
                    {renderField("Teléfono", "guardian1Phone")}
                    {renderField("Ocupación", "guardian1Occupation")}
                  </div>
                  
                  <div className="bg-gradient-to-b from-[#f8f9fc] to-white p-6 rounded-2xl border border-[#e0e7ff] shadow-sm">
                    <h3 className="font-bold text-lg text-[#19334c] mb-5 border-b pb-3">Responsable 2</h3>
                    {renderField("Nombre completo", "guardian2Name")}
                    {renderField("Parentesco", "guardian2Relationship")}
                    {renderField("Teléfono", "guardian2Phone")}
                    {renderField("Ocupación", "guardian2Occupation")}
                  </div>
                </div>
              </div>
            )}

            {/* Sección 3: Profesional */}
            {(activeSection === 'professional') && (
              <div>
                <SectionHeader icon={<FaStethoscope />} title="Profesional a Cargo" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderField("Nombre del profesional", "attendedBy")}
                  {renderField("Número de licencia", "licenseNumber")}
                  
                  <div className="md:col-span-2 bg-gradient-to-b from-[#f8f9fc] to-white p-6 rounded-2xl border border-[#e0e7ff] shadow-sm mt-4">
                    <h3 className="font-bold text-lg text-[#19334c] mb-4">Información Adicional</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Especialidad</label>
                        <div className="px-4 py-3 border border-[#e0e7ff] rounded-xl bg-[#f8f9fc]">
                          Psicología Clínica
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Años de experiencia</label>
                        <div className="px-4 py-3 border border-[#e0e7ff] rounded-xl bg-[#f8f9fc]">
                          8 años
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sección 4: Antecedentes personales */}
            {(activeSection === 'personalHistory') && (
              <div>
                <SectionHeader icon={<FaNotesMedical />} title="Antecedentes Personales" />
                
                <div className="grid grid-cols-1 gap-6">
                  {renderField("Patológicos", "personalPathological", "textarea")}
                  {renderField("Quirúrgicos", "personalSurgical", "textarea")}
                  {renderField("Psicopatológicos", "personalPsychopathological", "textarea")}
                  {renderField("Historia traumática", "traumaHistory", "textarea")}
                  {renderField("Estado del sueño", "sleepStatus", "textarea")}
                  {renderField("Uso de sustancias", "substanceUse", "textarea")}
                  {renderField("Otros", "personalOther", "textarea")}
                </div>
              </div>
            )}

            {/* Sección 5: Antecedentes familiares */}
            {(activeSection === 'familyHistory') && (
              <div>
                <SectionHeader icon={<FaClipboardList />} title="Antecedentes Familiares" />
                
                <div className="grid grid-cols-1 gap-6">
                  {renderField("Patológicos", "familyPathological", "textarea")}
                  {renderField("Quirúrgicos", "familySurgical", "textarea")}
                  {renderField("Psicopatológicos", "familyPsychopathological", "textarea")}
                  {renderField("Traumáticos", "familyTraumatic", "textarea")}
                  {renderField("Uso de sustancias", "familySubstanceUse", "textarea")}
                  {renderField("Otros", "familyOther", "textarea")}
                </div>
              </div>
            )}

            {/* Sección 6: Desarrollo */}
            {(activeSection === 'development') && (
              <div>
                <SectionHeader icon={<FaFlask />} title="Datos del Desarrollo" />
                
                <div className="grid grid-cols-1 gap-6">
                  {renderField("Embarazo", "pregnancyInfo", "textarea")}
                  {renderField("Parto", "deliveryInfo", "textarea")}
                  {renderField("Desarrollo psicomotor", "psychomotorDevelopment", "textarea")}
                  {renderField("Dinámica familiar", "familyDynamics", "textarea")}
                </div>
              </div>
            )}

            {/* Sección 7: Información clínica */}
            {(activeSection === 'clinical') && (
              <div>
                <SectionHeader icon={<FaFileMedical />} title="Información Clínica" />
                
                <div className="grid grid-cols-1 gap-6">
                  {renderField("Motivo de consulta", "consultationReason", "textarea")}
                  {renderField("Historia del problema", "problemHistory", "textarea")}
                  {renderField("Expectativas de terapia", "therapyExpectations", "textarea")}
                  {renderField("Examen mental", "mentalExam", "textarea")}
                  {renderField("Evaluación psicológica", "psychologicalAssessment", "textarea")}
                  {renderField("Diagnóstico", "diagnosis", "textarea")}
                  {renderField("Objetivos terapéuticos", "therapeuticGoals", "textarea")}
                  {renderField("Plan de tratamiento", "treatmentPlan", "textarea")}
                  {renderField("Información de referencia", "referralInfo", "textarea")}
                  {renderField("Recomendaciones", "recommendations", "textarea")}
                </div>
              </div>
            )}

            {/* Sección 8: Evolución - con manejo especial */}
            {(activeSection === 'evolution') && (
              <div>
                <SectionHeader icon={<FaHospital />} title="Evolución" />
                
                <div className="grid grid-cols-1 gap-6">
                  {/* Campo de evolución con manejo especial */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium mb-1">
                      Registros de evolución
                    </label>
                    <textarea
                      name="evolution"
                      value={formData.evolution || ''}
                      onChange={handleEvolutionChange}
                      onKeyDown={handleKeyDown}
                      rows={8}
                      className="w-full px-4 py-3 border border-[#e0e7ff] rounded-xl focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/20 bg-[#f8f9fc]"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Presiona Shift + Enter para nueva línea, solo el botón Guardar envía el formulario
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-b from-[#f8f9fc] to-white p-6 rounded-2xl border border-[#e0e7ff] shadow-sm">
                    <h3 className="font-bold text-lg text-[#19334c] mb-4">Resumen del Paciente</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-[#19334c]/5 p-3 rounded-lg">
                        <div className="text-sm text-[#19334c]/70">Sesiones completadas</div>
                        <div className="text-2xl font-bold text-[#19334c]">12</div>
                      </div>
                      <div className="bg-[#19334c]/5 p-3 rounded-lg">
                        <div className="text-sm text-[#19334c]/70">Progreso</div>
                        <div className="text-2xl font-bold text-[#19334c]">75%</div>
                      </div>
                      <div className="bg-[#19334c]/5 p-3 rounded-lg">
                        <div className="text-sm text-[#19334c]/70">Última sesión</div>
                        <div className="text-lg font-bold text-[#19334c]">15/06/2023</div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-[#19334c]">Estado del tratamiento</span>
                        <span className="text-sm font-medium text-[#19334c]">Activo</span>
                      </div>
                      <div className="h-2 bg-[#e0e7ff] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#c77914] to-[#e0a449]" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navegación entre secciones */}
            <div className="flex justify-between mt-10">
              <button
                type="button"
                onClick={() => navigateToSection('prev')}
                disabled={isFirstSection}
                className={`flex items-center px-5 py-2.5 rounded-xl ${
                  isFirstSection 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-[#19334c] border border-[#e0e7ff] hover:bg-[#f8f9fc]'
                }`}
              >
                <FaArrowLeft className="mr-2" />
                Anterior
              </button>
              
              {isLastSection ? (
                <button
                  type="button" // Cambiado a type="button" para prevenir envío automático
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-[#19334c] to-[#2c5170] text-white font-medium rounded-xl hover:from-[#c77914] hover:to-[#e0a449] transition-all shadow-lg"
                >
                  <FaSave className="mr-2" />
                  {isLoading ? 'Guardando...' : 'Guardar Historia'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigateToSection('next')}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-[#19334c] to-[#2c5170] text-white font-medium rounded-xl hover:from-[#c77914] hover:to-[#e0a449] transition-all shadow-lg"
                >
                  Siguiente
                  <FaArrowRight className="ml-2" />
                </button>
              )}
            </div>
          </form>
        )}
        
        {/* Pie de página */}
        <div className="mt-8 pt-6 border-t border-[#e0e7ff] text-center text-sm text-[#19334c]/70">
          <p>Mentalmente © {new Date().getFullYear()} - Sistema de Historias Clínicas Digitales</p>
          <p className="mt-1">Todos los datos ingresados son confidenciales y protegidos por la ley HIPAA</p>
        </div>
      </div>
    </div>
  );
};

export default HistoryForm;