'use client';
import React, { useState, useEffect } from 'react';
import { createHistory, updateHistory, getHistoryById, CreateHistoryData } from '@/services/historyService';
import { format, differenceInYears, isDate } from 'date-fns';
import { HistoryFormProps, MedicalRecordFormData } from '@/lib/type';
import { useAuth } from '@/context/AuthContext';
import { FaUser, FaIdCard, FaStethoscope, FaNotesMedical, FaClipboardList, FaFlask, FaFileMedical, FaHospital, FaSave, FaTimes, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

// Opciones para diagnósticos
const DIAGNOSIS_OPTIONS = [
  {
    category: 'Psicología',
    options: [
      'F32.9 Depresión',
      'F41.9 Ansiedad',
      'F43.20 Estrés',
      'F51.9 Trastornos del sueño',
      'F63.0 Problemas de pareja',
      'F91.9 Problemas de conducta en niños y adolescentes',
      'F50.9 Trastornos alimentarios',
      'F43.21 Duelos y pérdidas',
      'F90.9 Trastorno de déficit de atención e hiperactividad (TDAH)',
      'F40.9 Fobias',
      'F42.9 Trastorno obsesivo-compulsivo (TOC)',
      'F43.10 Trastorno de estrés postraumático (TEPT)',
      'F60.9 Trastornos de personalidad',
      'Z65.8 Problemas de autoestima',
      'Z73.9 Crisis existenciales',
      'F63.9 Manejo de la ira',
      'Z63.0 Problemas familiares',
      'F91.9 Acoso escolar (bullying)',
      'F41.0 Trastorno de pánico',
      'Z60.3 Problemas de adaptación',
      'R45.851 Ideación suicida',
      'T14.91 Intento suicida',
      'F19.20 Adicciones a sustancias psicoactivas (SPA)',
      'F10.20 Adicciones al alcohol',
      'F63.9 Dependencia emocional',
      'F32.0 Burnout (agotamiento laboral)',
      'F64.9 Trastorno de identidad de género',
      'F40.1 Trastorno de ansiedad social',
      'F94.1 Trastorno de apego en la infancia',
      'F93.1 Miedo a hablar en público'
    ]
  },
  {
    category: 'Psiquiatría',
    options: [
      'F20.9 Esquizofrenia',
      'F31.9 Trastorno bipolar',
      'F33.9 Depresión mayor',
      'F42.9 Trastorno obsesivo-compulsivo (TOC)',
      'F41.0 Trastorno de pánico',
      'F41.1 Trastorno de ansiedad generalizada',
      'F43.10 Trastorno de estrés postraumático (TEPT)',
      'F19.20 Dependencia de sustancias',
      'F51.9 Trastornos del sueño',
      'F50.9 Trastornos alimentarios',
      'F60.3 Trastorno de personalidad límite',
      'F60.2 Trastorno de personalidad antisocial',
      'F25.9 Trastorno esquizoafectivo',
      'F23.9 Trastornos psicóticos breves',
      'F45.0 Trastorno de somatización',
      'F19.20 Trastorno del estado de ánimo inducido por sustancias',
      'F43.20 Trastorno de adaptación',
      'F22.0 Trastorno delirante',
      'F03.90 Demencias',
      'F91.9 Trastorno de conducta',
      'R45.851 Ideación suicida',
      'T14.91 Intento suicida',
      'F19.20 Adicciones a sustancias psicoactivas (SPA)',
      'F10.20 Adicciones al alcohol',
      'F63.0 Dependencia emocional',
      'F44.81 Trastorno de identidad disociativo',
      'F40.1 Trastorno de ansiedad social',
      'F48.1 Trastorno de despersonalización/desrealización',
      'F63.9 Trastorno de control de impulsos',
      'F93.0 Trastorno de ansiedad por separación'
    ]
  },
  {
    category: 'Neuropsicología',
    options: [
      'F84.9 Trastornos del desarrollo',
      'G30.9 Demencias',
      'S06.9 Traumatismos craneoencefálicos',
      'F81.9 Trastornos del aprendizaje',
      'G40.9 Epilepsia',
      'I69.30 Accidentes cerebrovasculares (ACV)',
      'F84.0 Trastornos del espectro autista',
      'G31.84 Trastornos neurodegenerativos',
      'F80.9 Trastornos del lenguaje y la comunicación',
      'Q99.9 Síndromes genéticos',
      'R41.3 Trastornos de la memoria',
      'F98.8 Trastornos de atención',
      'F63.9 Trastornos del control de impulsos',
      'G25.9 Trastornos del movimiento',
      'G93.40 Problemas cognitivos relacionados con enfermedades médicas',
      'R48.8 Problemas de procesamiento sensorial',
      'R44.3 Trastornos de la percepción',
      'F06.8 Trastornos emocionales asociados a daño cerebral',
      'R41.840 Evaluación de capacidades cognitivas en niños',
      'R41.841 Evaluación de capacidades cognitivas en adultos mayores',
      'R45.851 Ideación suicida',
      'T14.91 Intento suicida',
      'F19.20 Adicciones a sustancias psicoactivas (SPA)',
      'F10.20 Adicciones al alcohol',
      'F63.9 Dependencia emocional',
      'F95.2 Síndrome de Tourette',
      'G93.49 Trastornos cognitivos post-quirúrgicos',
      'F80.9 Trastornos de lateralidad',
      'F07.89 Trastornos de la función ejecutiva',
      'G93.49 Evaluación neuropsicológica pre y post tratamiento oncológico'
    ]
  },
  {
    category: 'Fisioterapia',
    options: [
      'M54.5 Dolor lumbar',
      'S83.511A Lesiones deportivas',
      'Y93.9 Accidentes laborales',
      'M53.2 Problemas de postura',
      'Z47.89 Rehabilitación postquirúrgica',
      'M15.9 Artrosis',
      'M79.7 Fibromialgia',
      'G80.9 Parálisis cerebral',
      'I69.30 Accidentes cerebrovasculares (ACV)',
      'S14.2XXA Lesiones de la médula espinal',
      'S83.9XXA Lesiones de tejidos blandos',
      'R26.89 Problemas de equilibrio y coordinación',
      'M54.2 Dolor de cuello',
      'M51.26 Hernias discales',
      'S83.511A Lesiones de rodilla',
      'S43.009A Lesiones de hombro',
      'S52.509A Recuperación de fracturas',
      'M76.9 Tendinitis',
      'G56.0 Síndrome del túnel carpiano',
      'J98.8 Rehabilitación respiratoria',
      'M79.1 Dolor crónico',
      'Z95.1 Rehabilitación cardiovascular',
      'I89.0 Linfedema',
      'Z74.09 Problemas de movilidad en personas mayores',
      'M62.81 Lesiones musculares',
      'M41.9 Escoliosis',
      'G24.9 Distonía',
      'Z97.1 Amputaciones y prótesis',
      'G62.9 Rehabilitación neurológica',
      'R25.2 Espasticidad'
    ]
  },
  {
    category: 'Terapia Ocupacional',
    options: [
      'Z73.0 Dificultades en actividades de la vida diaria (AVD)',
      'Z74.3 Discapacidades físicas',
      'I69.30 Rehabilitación tras accidentes cerebrovasculares (ACV)',
      'F84.0 Trastornos del espectro autista',
      'F88 Retrasos en el desarrollo',
      'G31.84 Enfermedades degenerativas',
      'S69.90XA Lesiones de la mano y el miembro superior',
      'R27.9 Trastornos de la coordinación motora',
      'Z56.9 Adaptación al entorno laboral',
      'Z65.8 Salud mental',
      'F81.9 Trastornos de aprendizaje',
      'R48.8 Problemas de integración sensorial',
      'R26.9 Rehabilitación de la movilidad',
      'Z13.5 Adaptaciones para discapacidades visuales',
      'Z56.9 Intervenciones en salud ocupacional',
      'M79.1 Terapia para el manejo del dolor crónico',
      'Z55.9 Terapia para la mejora de habilidades sociales',
      'G62.9 Rehabilitación para lesiones neurológicas',
      'F90.9 Terapia para mejorar la atención y concentración',
      'Z74.3 Adaptaciones en el hogar para personas con discapacidades',
      'R45.851 Ideación suicida',
      'T14.91 Intento suicida',
      'F19.20 Adicciones a sustancias psicoactivas (SPA)',
      'F10.20 Adicciones al alcohol',
      'F63.9 Dependencia emocional',
      'F50.9 Intervención en trastornos de la alimentación',
      'Z55.9 Evaluación y mejora de habilidades preescolares',
      'R41.840 Rehabilitación cognitiva',
      'Z71.9 Asesoría psicológica',
      'Z56.9 Orientación vocacional'
    ]
  }
];

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
    pathologySeverity: 1
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showGuardiansInfo, setShowGuardiansInfo] = useState(true);

  // Calcular edad automáticamente cuando cambia la fecha de nacimiento
  useEffect(() => {
    if (formData.birthDate && isDate(new Date(formData.birthDate))) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = differenceInYears(today, birthDate);
      
      setFormData(prev => ({
        ...prev,
        age: age
      }));
      
      // Mostrar/ocultar información de responsables basado en la edad
      setShowGuardiansInfo(age < 18);
    }
  }, [formData.birthDate]);

  // Función para conversión segura de fechas
  const safeDateConversion = (dateValue: unknown): Date | null => {
    try {
      if (!dateValue) return null;
      if (dateValue instanceof Date) return dateValue;
      if (typeof dateValue === 'string' || typeof dateValue === 'number') {
        const parsedDate = new Date(dateValue);
        // Verificar si la fecha es válida
        if (isNaN(parsedDate.getTime())) return null;
        return parsedDate;
      }
      return null;
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
          
          // Calcular edad inicial si existe fecha de nacimiento
          if (convertedHistory.birthDate) {
            const today = new Date();
            const age = differenceInYears(today, new Date(convertedHistory.birthDate));
            setShowGuardiansInfo(age < 18);
          }
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
    
    // Extraer campos que no se deben enviar usando el operador rest
    // No asignamos nombres a las variables que no usaremos
    const { id: _, userId: __, createdAt: ___, updatedAt: ____, ...dataWithoutSystemFields } = formData; 
    
    // Preparar los datos para enviar, asegurando que las fechas sean strings ISO o null
    const dataToSend = {
      ...dataWithoutSystemFields,
      ...(!historyId && { userId: user.id }),
      age: formData.age ? Number(formData.age) : null,
      birthDate: formData.birthDate instanceof Date ? formData.birthDate.toISOString() : null,
      admissionDate: formData.admissionDate instanceof Date ? formData.admissionDate.toISOString() : null,
      recordNumber: formData.recordNumber || `HC-${Date.now()}`,
    };

    try {
      if (historyId) {
        if (!historyId) {
          throw new Error('ID de historia clínica no válido');
        }

        await updateHistory(historyId, dataToSend);
        alert('Historia clínica actualizada exitosamente');
      } else {
        if (!dataToSend.patientName || !dataToSend.identificationNumber) {
          throw new Error('Nombre del paciente y número de identificación son requeridos');
        }

        await createHistory(dataToSend as unknown as CreateHistoryData);
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
      <label className={`block text-sm font-medium mb-1 text-gray-800 ${type === 'checkbox' ? 'ml-2' : ''}`}>
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
          } rounded-xl focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/20 bg-[#f8f9fc] text-gray-800`}
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
          } rounded-xl focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/20 bg-[#f8f9fc] text-gray-800`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name as keyof MedicalRecordFormData] as string || ''}
          onChange={handleChange}
          className={`w-full px-4 py-3 border ${
            formErrors[name] ? 'border-red-500' : 'border-[#e0e7ff]'
          } rounded-xl focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/20 bg-[#f8f9fc] text-gray-800`}
        />
      )}
      
      {formErrors[name] && (
        <p className="mt-1 text-sm text-red-600">{formErrors[name]}</p>
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
            <p className="text-gray-700 mt-1">
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
            <p className="text-gray-800 font-medium">Cargando información...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Barra de progreso */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-800">
                  Paso {currentSectionIndex + 1} de {sectionItems.length}
                </span>
                <span className="text-sm font-medium text-gray-800">
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="mb-5">
                        <label className="block text-sm font-medium mb-1 text-gray-800">
                          Tipo de identificación *
                        </label>
                        <select
                          name="identificationType"
                          value={formData.identificationType}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border ${
                            formErrors.identificationType ? 'border-red-500' : 'border-[#e0e7ff]'
                          } rounded-xl focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/20 bg-[#f8f9fc] text-gray-800`}
                        >
                          <option value="Cédula">Cédula</option>
                          <option value="Pasaporte">Pasaporte</option>
                          <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
                          <option value="Cédula de Extranjería">Cédula de Extranjería</option>
                          <option value="Registro Civil">Registro Civil</option>
                        </select>
                        {formErrors.identificationType && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.identificationType}</p>
                        )}
                      </div>
                      {renderField("Número *", "identificationNumber", "text", true)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-800">
                          Fecha de nacimiento
                        </label>
                        <input
                          type="date"
                          name="birthDate"
                          value={formatDateForInput(formData.birthDate) || ''}
                          onChange={(e) => {
                            handleDateChange("birthDate", e.target.value);
                          }}
                          className={`w-full px-4 py-3 border ${
                            formErrors.birthDate ? 'border-red-500' : 'border-[#e0e7ff]'
                          } rounded-xl focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/20 bg-[#f8f9fc] text-gray-800`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-800">
                          Edad
                        </label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age || ''}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border ${
                            formErrors.age ? 'border-red-500' : 'border-[#e0e7ff]'
                          } rounded-xl focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/20 bg-[#f8f9fc] text-gray-800`}
                        />
                      </div>
                    </div>
                    
                    {renderField("Número de registro *", "recordNumber", "text", true)}
                    <label className="block text-sm font-medium mb-1 text-gray-800" htmlFor="educationLevel">Nivel educativo</label>
                    <select
                          name="educationLevel"
                          value={formData.educationLevel || ''}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border ${
                            formErrors.educationLevel ? 'border-red-500' : 'border-[#e0e7ff]'
                          } rounded-xl focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/20 bg-[#f8f9fc] text-gray-800`}
                        >
                          <option value="">Seleccione un nivel educativo</option>
                          <option value="Primaria">Primaria</option>
                          <option value="Secundaria">Secundaria</option>
                          <option value="Universidad">Universidad</option>
                          <option value="Postgrado">Postgrado</option>
                        </select>
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
                    {renderField("Otro teléfono", "phone", "text")}
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
                      <label className="text-sm font-medium ml-2 text-gray-800">¿Es beneficiario?</label>
                    </div>
                    {renderField("Referido por", "referredBy", "text")}
                  </div>
                </div>
              </div>
            )}

            {/* Sección 2: Responsables - solo para menores de 18 años */}
            {(activeSection === 'guardians' && showGuardiansInfo) && (
              <div>
                <SectionHeader icon={<FaIdCard />} title="Responsables" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-b from-[#f8f9fc] to-white p-6 rounded-2xl border border-[#e0e7ff] shadow-sm">
                    <h3 className="font-bold text-lg text-gray-800 mb-5 border-b pb-3">Responsable 1</h3>
                    {renderField("Nombre completo", "guardian1Name")}
                    {renderField("Parentesco", "guardian1Relationship")}
                    {renderField("Teléfono", "guardian1Phone")}
                    {renderField("Ocupación", "guardian1Occupation")}
                  </div>
                  
                  <div className="bg-gradient-to-b from-[#f8f9fc] to-white p-6 rounded-2xl border border-[#e0e7ff] shadow-sm">
                    <h3 className="font-bold text-lg text-gray-800 mb-5 border-b pb-3">Responsable 2</h3>
                    {renderField("Nombre completo", "guardian2Name")}
                    {renderField("Parentesco", "guardian2Relationship")}
                    {renderField("Teléfono", "guardian2Phone")}
                    {renderField("Ocupación", "guardian2Occupation")}
                  </div>
                </div>
              </div>
            )}

            {/* Mensaje para adultos */}
            {(activeSection === 'guardians' && !showGuardiansInfo) && (
              <div className="bg-gradient-to-b from-[#f8f9fc] to-white p-8 rounded-2xl border border-[#e0e7ff] shadow-sm">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaUser className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Paciente mayor de edad</h3>
                    <p className="text-gray-700 mt-1">
                      El paciente es mayor de 18 años, por lo que la información de responsables no es requerida.
                    </p>
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
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Información Adicional</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800">Especialidad</label>
                        <div className="px-4 py-3 border border-[#e0e7ff] rounded-xl bg-[#f8f9fc] text-gray-800">
                          Psicología Clínica
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800">Años de experiencia</label>
                        <div className="px-4 py-3 border border-[#e0e7ff] rounded-xl bg-[#f8f9fc] text-gray-800">
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
                  
                  {/* Selector de patología y nivel de severidad */}
                  <div className="bg-gradient-to-b from-[#f8f9fc] to-white p-6 rounded-2xl border border-[#e0e7ff] shadow-sm mt-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Severidad de Patología</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-800">
                          Patología Principal
                        </label>
                        <select
                          name="diagnosis"
                          value={formData.diagnosis}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-[#e0e7ff] rounded-xl focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/20 bg-[#f8f9fc] text-gray-800"
                        >
                          <option value="">Seleccione una patología</option>
                          {DIAGNOSIS_OPTIONS.map(group => (
                            <optgroup label={group.category} key={group.category}>
                              {group.options.map(option => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-800">
                          Nivel de Severidad (1-10)
                        </label>
                        <div className="flex items-center">
                          <input
                            type="range"
                            name="pathologySeverity"
                            min="1"
                            max="10"
                            value={formData.pathologySeverity || 1}
                            onChange={handleChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="ml-4 w-10 text-center font-bold text-gray-800">
                            {formData.pathologySeverity || 1}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600 flex justify-between">
                          <span>1 - Mínimo</span>
                          <span>10 - Crítico</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-800">
                        Motivo de consulta
                      </label>
                      <select
                        name="consultationReason"
                        value={formData.consultationReason || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-[#e0e7ff] rounded-xl focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/20 bg-[#f8f9fc] text-gray-800"
                      >
                        <option value="">Seleccione un motivo</option>
                        {DIAGNOSIS_OPTIONS.map(group => (
                          <optgroup label={group.category} key={group.category}>
                            {group.options.map(option => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-800">
                        Diagnóstico
                      </label>
                      <select
                        name="diagnosis"
                        value={formData.diagnosis || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-[#e0e7ff] rounded-xl focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/20 bg-[#f8f9fc] text-gray-800"
                      >
                        <option value="">Seleccione un diagnóstico</option>
                        {DIAGNOSIS_OPTIONS.map(group => (
                          <optgroup label={group.category} key={group.category}>
                            {group.options.map(option => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {renderField("Historia del problema", "problemHistory", "textarea")}
                  {renderField("Expectativas de terapia", "therapyExpectations", "textarea")}
                  {renderField("Examen mental", "mentalExam", "textarea")}
                  {renderField("Evaluación psicológica", "psychologicalAssessment", "textarea")}
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
                    <label className="block text-sm font-medium mb-1 text-gray-800">
                      Registros de evolución
                    </label>
                    <textarea
                      name="evolution"
                      value={formData.evolution || ''}
                      onChange={handleEvolutionChange}
                      onKeyDown={handleKeyDown}
                      rows={8}
                      className="w-full px-4 py-3 border border-[#e0e7ff] rounded-xl focus:border-[#c77914] focus:ring-2 focus:ring-[#c77914]/20 bg-[#f8f9fc] text-gray-800"
                    />
                    <p className="mt-1 text-sm text-gray-600">
                      Presiona Shift + Enter para nueva línea, solo el botón Guardar envía el formulario
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-b from-[#f8f9fc] to-white p-6 rounded-2xl border border-[#e0e7ff] shadow-sm">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Resumen del Paciente</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-[#19334c]/5 p-3 rounded-lg">
                        <div className="text-sm text-gray-700">Sesiones completadas</div>
                        <div className="text-2xl font-bold text-gray-800">12</div>
                      </div>
                      <div className="bg-[#19334c]/5 p-3 rounded-lg">
                        <div className="text-sm text-gray-700">Progreso</div>
                        <div className="text-2xl font-bold text-gray-800">75%</div>
                      </div>
                      <div className="bg-[#19334c]/5 p-3 rounded-lg">
                        <div className="text-sm text-gray-700">Última sesión</div>
                        <div className="text-lg font-bold text-gray-800">15/06/2023</div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-800">Estado del tratamiento</span>
                        <span className="text-sm font-medium text-gray-800">Activo</span>
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
                    : 'bg-white text-gray-800 border border-[#e0e7ff] hover:bg-[#f8f9fc]'
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
        <div className="mt-8 pt-6 border-t border-[#e0e7ff] text-center text-sm text-gray-600">
          <p>Mentalmente © {new Date().getFullYear()} - Sistema de Historias Clínicas Digitales</p>
          <p className="mt-1">Todos los datos ingresados son confidenciales y protegidos por la ley HIPAA</p>
        </div>
      </div>
    </div>
  );
};

export default HistoryForm;