'use client';

import React, { useRef, useState } from 'react';
import { format } from 'date-fns';
import { FaTimes, FaPrint, FaUser, FaNotesMedical, FaBrain, FaHistory, FaStethoscope } from 'react-icons/fa';
import { MedicalRecordDetailsModalProps } from '@/lib/type';
import SpinnerPDF from './SpinnerPDF';

const MedicalRecordDetailsModal: React.FC<MedicalRecordDetailsModalProps> = ({
  record,
  onClose
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const printableRef = useRef<HTMLDivElement>(null);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
  
      // Clonar la respuesta para múltiples lecturas
      const responseClone = response.clone();
      
      // Verificar el tipo de contenido
      const contentType = response.headers.get('content-type') || '';
      
      if (response.ok && contentType.includes('application/pdf')) {
        // Procesar como PDF
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `Historia_Clinica_${record.identificationNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        
        // Limpieza
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      } else {
        // Manejar error
        let errorMessage = 'Error desconocido al generar PDF';
        
        try {
          // Intentar obtener el mensaje de error
          const errorData = await responseClone.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
          
          // Mensajes específicos para errores comunes
          if (errorData.error?.includes('no encontrado')) {
            errorMessage = 'Archivo de plantilla o fuente no encontrado. Contacte al administrador.';
          }
        } catch (jsonError) {
          // Si falla el parseo JSON, usar el texto plano
          try {
            const text = await responseClone.text();
            errorMessage = text;
          } catch (textError) {
            errorMessage = `Error ${response.status}: ${response.statusText}`;
          }
        }
        
        throw new Error(errorMessage);
      }
      
    } catch (error: any) {
      console.error('Error en generación de PDF:', error);
      
      // Mensaje más amigable para el usuario
      const userMessage = error.message.includes('no encontrado')
        ? "Archivos de plantilla faltantes. Contacte al administrador."
        : error.message.includes('Unexpected token')
          ? "Respuesta inválida del servidor"
          : `Error: ${error.message}`;
      
      alert(`❌ Error al generar el PDF:\n\n${userMessage}\n\nDetalles en consola.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return format(new Date(date), 'dd/MM/yyyy');
  };

  // Renderizar secciones con iconos
  const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <div className="flex items-center mb-4 pb-2 border-b border-[#19334c]/30">
      <div className="text-[#c77914] mr-2">{icon}</div>
      <h3 className="text-xl font-bold text-[#19334c]">{title}</h3>
    </div>
  );

  // Renderizar campo con diseño moderno
  const renderField = (label: string, value: string | null | undefined) => (
    <div className="mb-3">
      <div className="text-sm font-medium text-[#19334c]/80">{label}</div>
      <div className="text-base font-medium text-[#19334c]">
        {value || <span className="text-gray-400 italic">No especificado</span>}
      </div>
    </div>
  );

  // Renderizar campo multilínea
  const renderMultilineField = (label: string, value: string | null, rows: number = 3) => (
    <div className="mb-4">
      <div className="text-sm font-medium text-[#19334c]/80 mb-1">{label}</div>
      <div className="bg-[#f8f9fc] p-3 rounded-lg border border-[#e0e7ff] text-[#19334c] min-h-[60px] whitespace-pre-wrap">
        {value || (
          <span className="text-gray-400 italic">
            {label.includes('Recomendaciones') ? 'Sin recomendaciones' : 
             label.includes('Evolución') ? 'Sin registro de evolución' : 
             'Sin información especificada'}
          </span>
        )}
      </div>
    </div>
  );

  // Tabs de navegación
  const tabs = [
    { id: 'basic', label: 'Información Básica', icon: <FaUser /> },
    { id: 'medical', label: 'Antecedentes', icon: <FaNotesMedical /> },
    { id: 'clinical', label: 'Clínica', icon: <FaStethoscope /> },
    { id: 'evolution', label: 'Evolución', icon: <FaHistory /> },
    { id: 'professionals', label: 'Profesionales', icon: <FaBrain /> }
  ];

  return (
    <div className="fixed inset-0 bg-[#19334c]/80 flex items-center justify-center z-50 backdrop-blur-sm">
      {isGenerating && <SpinnerPDF />}

      {/* Modal principal */}
      <div className="bg-white rounded-2xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#e0e7ff]">
          <div>
            <h2 className="text-2xl font-bold text-[#19334c]">
              Historia Clínica
            </h2>
            <p className="text-[#19334c]/70 mt-1">
              Paciente: <span className="font-medium">{record.patientName}</span> | 
              ID: <span className="font-medium">{record.identificationNumber}</span>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              aria-label='Imprimir'
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-gradient-to-r from-[#19334c] to-[#2c5170] text-white px-4 py-2 rounded-lg hover:from-[#c77914] hover:to-[#e0a449] transition-all shadow-md disabled:opacity-50"
            >
              <FaPrint /> {isGenerating ? 'Generando...' : 'Exportar PDF'}
            </button>
            <button 
              aria-label='Cerrar modal'
              onClick={onClose}
              className="bg-[#f8f9fc] hover:bg-[#e0e7ff] p-2 rounded-full transition-colors"
            >
              <FaTimes className="text-[#19334c]" size={20} />
            </button>
          </div>
        </div>

        {/* Pestañas de navegación */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-[#19334c] to-[#2c5170] text-white shadow-md' 
                  : 'bg-[#f8f9fc] text-[#19334c] hover:bg-[#e0e7ff]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Contenido de pestañas */}
        <div className="space-y-6">
          {/* Información Básica */}
          {activeTab === 'basic' && (
            <div className="bg-gradient-to-br from-[#f8f9fc] to-white p-6 rounded-2xl border border-[#e0e7ff]">
              <SectionHeader icon={<FaUser />} title="Datos Personales" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e0e7ff]">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#19334c]/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <FaUser className="text-[#19334c]" />
                    </div>
                    <h4 className="font-bold text-[#19334c]">Identificación</h4>
                  </div>
                  {renderField("Tipo de identificación", record.identificationType)}
                  {renderField("Número de identificación", record.identificationNumber)}
                  {renderField("Fecha de nacimiento", formatDate(record.birthDate))}
                  {renderField("Edad", record.age?.toString())}
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e0e7ff]">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#19334c]/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <FaUser className="text-[#19334c]" />
                    </div>
                    <h4 className="font-bold text-[#19334c]">Información Personal</h4>
                  </div>
                  {renderField("Escolaridad", record.educationLevel)}
                  {renderField("Ocupación", record.occupation)}
                  {renderField("Nacionalidad", record.nationality)}
                  {renderField("Religión", record.religion)}
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e0e7ff]">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#19334c]/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <FaUser className="text-[#19334c]" />
                    </div>
                    <h4 className="font-bold text-[#19334c]">Contacto</h4>
                  </div>
                  {renderField("Dirección", record.address)}
                  {renderField("Barrio", record.neighborhood)}
                  {renderField("Ciudad", record.city)}
                  {renderField("Departamento", record.state)}
                  {renderField("Teléfono", record.phone)}
                  {renderField("Celular", record.cellPhone)}
                  {renderField("Email", record.email)}
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e0e7ff]">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#19334c]/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <FaUser className="text-[#19334c]" />
                    </div>
                    <h4 className="font-bold text-[#19334c]">Atención</h4>
                  </div>
                  {renderField("Fecha de ingreso", formatDate(record.admissionDate))}
                  {renderField("EPS", record.eps)}
                  {renderField("¿Es beneficiario?", record.isBeneficiary ? 'Sí' : 'No')}
                  {renderField("Remitido por", record.referredBy)}
                </div>
              </div>
            </div>
          )}

          {/* Antecedentes */}
          {activeTab === 'medical' && (
            <div className="bg-gradient-to-br from-[#f8f9fc] to-white p-6 rounded-2xl border border-[#e0e7ff]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <SectionHeader icon={<FaNotesMedical />} title="Antecedentes Personales" />
                  
                  <div className="space-y-4">
                    {renderMultilineField("Patológicos", record.personalPathological)}
                    {renderMultilineField("Quirúrgicos", record.personalSurgical)}
                    {renderMultilineField("Psicopatológicos", record.personalPsychopathological)}
                    {renderMultilineField("Historia de trauma o abuso", record.traumaHistory)}
                    {renderMultilineField("Estado del sueño", record.sleepStatus)}
                    {renderMultilineField("Consumo de sustancias psicoactivas", record.substanceUse)}
                    {renderMultilineField("Otros", record.personalOther)}
                  </div>
                </div>
                
                <div>
                  <SectionHeader icon={<FaNotesMedical />} title="Antecedentes Familiares" />
                  
                  <div className="space-y-4">
                    {renderMultilineField("Patológicos", record.familyPathological)}
                    {renderMultilineField("Quirúrgicos", record.familySurgical)}
                    {renderMultilineField("Psicopatológicos", record.familyPsychopathological)}
                    {renderMultilineField("Traumáticos", record.familyTraumatic)}
                    {renderMultilineField("Consumo de sustancias psicoactivas", record.familySubstanceUse)}
                    {renderMultilineField("Otros", record.familyOther)}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <SectionHeader icon={<FaNotesMedical />} title="Desarrollo" />
                  
                  <div className="space-y-4">
                    {renderMultilineField("Embarazo", record.pregnancyInfo)}
                    {renderMultilineField("Parto", record.deliveryInfo)}
                    {renderMultilineField("Desarrollo psicomotor (sentarse, caminar, hablar, control de esfínteres)", record.psychomotorDevelopment)}
                    {renderMultilineField("Descripción de la dinámica familiar", record.familyDynamics)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Información Clínica */}
          {activeTab === 'clinical' && (
            <div className="bg-gradient-to-br from-[#f8f9fc] to-white p-6 rounded-2xl border border-[#e0e7ff]">
              <SectionHeader icon={<FaStethoscope />} title="Información Clínica" />
              
              <div className="space-y-6">
                {renderMultilineField("Motivo de consulta", record.consultationReason, 4)}
                {renderMultilineField("Historia del problema (duración, evolución, frecuencia)", record.problemHistory, 4)}
                {renderMultilineField("Expectativas del paciente respecto a la terapia", record.therapyExpectations, 3)}
                {renderMultilineField("Examen Mental", record.mentalExam, 4)}
                {renderMultilineField("Evaluación psicológica (estado de ánimo, niveles de ansiedad y estrés, habilidades de afrontamiento, funcionamiento cognitivo, emocional, conductual y social)", record.psychologicalAssessment, 6)}
                {renderMultilineField("IDX O DX (DSM5-CIE 10)", record.diagnosis, 3)}
                {renderMultilineField("Objetivos terapéuticos", record.therapeuticGoals, 3)}
                {renderMultilineField("Plan Terapéutico", record.treatmentPlan, 4)}
                {renderMultilineField("Derivación Y/O Remisión", record.referralInfo, 3)}
                {renderMultilineField("Recomendaciones", record.recommendations, 3)}
              </div>
            </div>
          )}

          {/* Evolución */}
          {activeTab === 'evolution' && record.evolution && (
            <div className="bg-gradient-to-br from-[#f8f9fc] to-white p-6 rounded-2xl border border-[#e0e7ff]">
              <SectionHeader icon={<FaHistory />} title="Evolución del Paciente" />
              
              <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e0e7ff]">
                <div className="text-sm text-[#19334c] whitespace-pre-line">
                  {record.evolution}
                </div>
              </div>
            </div>
          )}

          {/* Profesionales */}
          {activeTab === 'professionals' && (
            <div className="bg-gradient-to-br from-[#f8f9fc] to-white p-6 rounded-2xl border border-[#e0e7ff]">
              <SectionHeader icon={<FaBrain />} title="Responsables y Profesionales" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e0e7ff]">
                  <h4 className="font-bold text-[#19334c] mb-4">Responsable 1</h4>
                  {renderField("Nombre", record.guardian1Name)}
                  {renderField("Parentesco", record.guardian1Relationship)}
                  {renderField("Teléfono", record.guardian1Phone)}
                  {renderField("Ocupación", record.guardian1Occupation)}
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e0e7ff]">
                  <h4 className="font-bold text-[#19334c] mb-4">Responsable 2</h4>
                  {renderField("Nombre", record.guardian2Name)}
                  {renderField("Parentesco", record.guardian2Relationship)}
                  {renderField("Teléfono", record.guardian2Phone)}
                  {renderField("Ocupación", record.guardian2Occupation)}
                </div>
                
                <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-[#e0e7ff]">
                  <h4 className="font-bold text-[#19334c] mb-4">Profesional</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      {renderField("Atendido por", record.attendedBy)}
                    </div>
                    <div>
                      {renderField("Número de tarjeta profesional", record.licenseNumber)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-[#19334c] to-[#2c5170] text-white font-medium rounded-lg hover:from-[#c77914] hover:to-[#e0a449] transition-all shadow-md"
          >
            Cerrar Historia
          </button>
        </div>
      </div>

      {/* Componente para PDF */}
      <div 
        ref={printableRef} 
        className="absolute top-[10000px] left-0 w-[210mm] bg-white p-10 font-sans text-sm"
      >
        <div className="w-full max-w-4xl mx-auto">
          {/* Encabezado */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-[#19334c] w-16 h-16 rounded-full flex items-center justify-center mr-4">
                <FaNotesMedical className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-wide text-[#19334c]">HISTORIA CLÍNICA PSICOLÓGICA</h1>
                <p className="text-lg mt-1 text-[#c77914] font-medium">MentalMente - Centro de Psicología Integral</p>
              </div>
            </div>
            <div className="border-t border-b border-[#19334c]/30 py-2 text-[#19334c]">
              <p>Historia Clínica N° {record.recordNumber || '__________'} | Fecha: {formatDate(new Date())}</p>
            </div>
          </div>

          {/* Información Personal */}
          <div className="mb-8">
            <h2 className="font-bold text-xl border-b-2 border-[#19334c] mb-4 pb-2 text-[#19334c]">INFORMACIÓN PERSONAL</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-medium mb-1">Nombre paciente:</div>
                <div className="border-b border-black pb-1">{record.patientName || '__________'}</div>
              </div>
              
              <div>
                <div className="font-medium mb-1">Tipo de identificación:</div>
                <div className="flex space-x-4">
                  <span>RC <span className="inline-block w-5 h-5 border border-black ml-1 text-center">{record.identificationType === 'RC' ? '✓' : ''}</span></span>
                  <span>TI <span className="inline-block w-5 h-5 border border-black ml-1 text-center">{record.identificationType === 'TI' ? '✓' : ''}</span></span>
                  <span>CC <span className="inline-block w-5 h-5 border border-black ml-1 text-center">{record.identificationType === 'CC' ? '✓' : ''}</span></span>
                </div>
              </div>
              
              <div>
                <div className="font-medium mb-1">N° Identificación:</div>
                <div className="border-b border-black pb-1">{record.identificationNumber || '__________'}</div>
              </div>
              
              <div>
                <div className="font-medium mb-1">Edad:</div>
                <div className="border-b border-black pb-1">{record.age || '__________'}</div>
              </div>
              
              <div>
                <div className="font-medium mb-1">Fecha de nacimiento:</div>
                <div className="border-b border-black pb-1">{formatDate(record.birthDate) || '__________'}</div>
              </div>
              
              <div>
                <div className="font-medium mb-1">Escolaridad:</div>
                <div className="border-b border-black pb-1">{record.educationLevel || '__________'}</div>
              </div>
              
              <div>
                <div className="font-medium mb-1">Ocupación:</div>
                <div className="border-b border-black pb-1">{record.occupation || '__________'}</div>
              </div>
              
              <div>
                <div className="font-medium mb-1">Lugar de nacimiento:</div>
                <div className="border-b border-black pb-1">{record.birthPlace || '__________'}</div>
              </div>
              
              <div>
                <div className="font-medium mb-1">Nacionalidad:</div>
                <div className="border-b border-black pb-1">{record.nationality || '__________'}</div>
              </div>
              
              <div>
                <div className="font-medium mb-1">Religión:</div>
                <div className="border-b border-black pb-1">{record.religion || '__________'}</div>
              </div>
              
              <div>
                <div className="font-medium mb-1">Dirección de Residencia:</div>
                <div className="border-b border-black pb-1">{record.address || '__________'}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="font-medium mb-1">Barrio:</div>
                  <div className="border-b border-black pb-1">{record.neighborhood || '__________'}</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Ciudad:</div>
                  <div className="border-b border-black pb-1">{record.city || '__________'}</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Departamento:</div>
                  <div className="border-b border-black pb-1">{record.state || '__________'}</div>
                </div>
              </div>
              
              <div>
                <div className="font-medium mb-1">Fecha ingreso:</div>
                <div className="border-b border-black pb-1">{formatDate(record.admissionDate) || '__________'}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="font-medium mb-1">Celular:</div>
                  <div className="border-b border-black pb-1">{record.cellPhone || '__________'}</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Teléfono:</div>
                  <div className="border-b border-black pb-1">{record.phone || '__________'}</div>
                </div>
              </div>
              
              <div>
                <div className="font-medium mb-1">E-mail:</div>
                <div className="border-b border-black pb-1">{record.email || '__________'}</div>
              </div>
              
              <div>
                <div className="font-medium mb-1">EPS:</div>
                <div className="border-b border-black pb-1">{record.eps || '__________'}</div>
              </div>
              
              <div>
                <div className="font-medium mb-1">Estado EPS:</div>
                <div className="flex space-x-4">
                  <span>Cotizante <span className="inline-block w-5 h-5 border border-black ml-1 text-center">{!record.isBeneficiary ? '✓' : ''}</span></span>
                  <span>Beneficiario <span className="inline-block w-5 h-5 border border-black ml-1 text-center">{record.isBeneficiary ? '✓' : ''}</span></span>
                </div>
              </div>
              
              <div>
                <div className="font-medium mb-1">Remitido por:</div>
                <div className="border-b border-black pb-1">{record.referredBy || '__________'}</div>
              </div>
            </div>
          </div>

          {/* Responsables */}
          <div className="mb-8">
            <h2 className="font-bold text-xl border-b-2 border-[#19334c] mb-4 pb-2 text-[#19334c]">RESPONSABLES</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-3 text-[#19334c]">Responsable 1</h3>
                <div className="space-y-2">
                  <div>
                    <div className="font-medium mb-1">Nombre:</div>
                    <div className="border-b border-black pb-1">{record.guardian1Name || '__________'}</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Parentesco:</div>
                    <div className="border-b border-black pb-1">{record.guardian1Relationship || '__________'}</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Teléfono:</div>
                    <div className="border-b border-black pb-1">{record.guardian1Phone || '__________'}</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Ocupación:</div>
                    <div className="border-b border-black pb-1">{record.guardian1Occupation || '__________'}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold mb-3 text-[#19334c]">Responsable 2</h3>
                <div className="space-y-2">
                  <div>
                    <div className="font-medium mb-1">Nombre:</div>
                    <div className="border-b border-black pb-1">{record.guardian2Name || '__________'}</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Parentesco:</div>
                    <div className="border-b border-black pb-1">{record.guardian2Relationship || '__________'}</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Teléfono:</div>
                    <div className="border-b border-black pb-1">{record.guardian2Phone || '__________'}</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Ocupación:</div>
                    <div className="border-b border-black pb-1">{record.guardian2Occupation || '__________'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profesional */}
          <div className="mb-8">
            <h2 className="font-bold text-xl border-b-2 border-[#19334c] mb-4 pb-2 text-[#19334c]">PROFESIONAL</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-medium mb-1">Atendido por:</div>
                <div className="border-b border-black pb-1">{record.attendedBy || '__________'}</div>
              </div>
              <div>
                <div className="font-medium mb-1">Tarjeta profesional N°:</div>
                <div className="border-b border-black pb-1">{record.licenseNumber || '__________'}</div>
              </div>
            </div>
          </div>

          {/* Información Médico-Psicológica */}
          <div className="mb-8">
            <h2 className="font-bold text-xl border-b-2 border-[#19334c] mb-4 pb-2 text-[#19334c]">INFORMACIÓN MÉDICO-PSICOLÓGICA</h2>
            
            <div className="mb-6">
              <h3 className="font-bold mb-3 text-[#19334c]">Antecedentes personales</h3>
              <div className="space-y-3">
                <div>
                  <div className="font-medium mb-1">Patológicos:</div>
                  <div className="border border-gray-300 p-2 min-h-[40px]">{record.personalPathological || '__________'}</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Quirúrgicos:</div>
                  <div className="border border-gray-300 p-2 min-h-[40px]">{record.personalSurgical || '__________'}</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Psicopatológicos:</div>
                  <div className="border border-gray-300 p-2 min-h-[40px]">{record.personalPsychopathological || '__________'}</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Historia de trauma o abuso:</div>
                  <div className="border border-gray-300 p-2 min-h-[40px]">{record.traumaHistory || '__________'}</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Estado del Sueño:</div>
                  <div className="border border-gray-300 p-2 min-h-[40px]">{record.sleepStatus || '__________'}</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Consumo de sustancias psicoactivas:</div>
                  <div className="border border-gray-300 p-2 min-h-[40px]">{record.substanceUse || '__________'}</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Otros:</div>
                  <div className="border border-gray-300 p-2 min-h-[40px]">{record.personalOther || '__________'}</div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold mb-3 text-[#19334c]">Antecedentes Familiares</h3>
              <div className="space-y-3">
                <div>
                  <div className="font-medium mb-1">Patológicos:</div>
                  <div className="border border-gray-300 p-2 min-h-[40px]">{record.familyPathological || '__________'}</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Quirúrgicos:</div>
                  <div className="border border-gray-300 p-2 min-h-[40px]">{record.familySurgical || '__________'}</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Psicopatológicos:</div>
                  <div className="border border-gray-300 p-2 min-h-[40px]">{record.familyPsychopathological || '__________'}</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Traumáticos:</div>
                  <div className="border border-gray-300 p-2 min-h-[40px]">{record.familyTraumatic || '__________'}</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Consumo de sustancias psicoactivas:</div>
                  <div className="border border-gray-300 p-2 min-h-[40px]">{record.familySubstanceUse || '__________'}</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Otros:</div>
                  <div className="border border-gray-300 p-2 min-h-[40px]">{record.familyOther || '__________'}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-3 text-[#19334c]">Desarrollo</h3>
              <div className="space-y-3">
                <div>
                  <div className="font-medium mb-1">Embarazo:</div>
                  <div className="border border-gray-300 p-2 min-h-[40px]">{record.pregnancyInfo || '__________'}</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Parto:</div>
                  <div className="border border-gray-300 p-2 min-h-[40px]">{record.deliveryInfo || '__________'}</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Desarrollo psicomotor:</div>
                  <div className="border border-gray-300 p-2 min-h-[40px]">{record.psychomotorDevelopment || '__________'}</div>
                </div>
                <div>
                  <div className="font-medium mb-1">Dinámica familiar:</div>
                  <div className="border border-gray-300 p-2 min-h-[40px]">{record.familyDynamics || '__________'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Información Clínica */}
          <div className="mb-8">
            <h2 className="font-bold text-xl border-b-2 border-[#19334c] mb-4 pb-2 text-[#19334c]">INFORMACIÓN CLÍNICA</h2>
            
            <div className="space-y-4">
              <div>
                <div className="font-medium mb-1">Motivo de consulta:</div>
                <div className="border border-gray-300 p-2 min-h-[60px]">{record.consultationReason || '__________'}</div>
              </div>
              <div>
                <div className="font-medium mb-1">Historia del problema:</div>
                <div className="border border-gray-300 p-2 min-h-[60px]">{record.problemHistory || '__________'}</div>
              </div>
              <div>
                <div className="font-medium mb-1">Expectativas del paciente:</div>
                <div className="border border-gray-300 p-2 min-h-[60px]">{record.therapyExpectations || '__________'}</div>
              </div>
              <div>
                <div className="font-medium mb-1">Examen Mental:</div>
                <div className="border border-gray-300 p-2 min-h-[60px]">{record.mentalExam || '__________'}</div>
              </div>
              <div>
                <div className="font-medium mb-1">Evaluación psicológica:</div>
                <div className="border border-gray-300 p-2 min-h-[80px]">{record.psychologicalAssessment || '__________'}</div>
              </div>
              <div>
                <div className="font-medium mb-1">IDX O DX (DSM5-CIE 10):</div>
                <div className="border border-gray-300 p-2 min-h-[40px]">{record.diagnosis || '__________'}</div>
              </div>
              <div>
                <div className="font-medium mb-1">Objetivos terapéuticos:</div>
                <div className="border border-gray-300 p-2 min-h-[60px]">{record.therapeuticGoals || '__________'}</div>
              </div>
              <div>
                <div className="font-medium mb-1">Plan Terapéutico:</div>
                <div className="border border-gray-300 p-2 min-h-[60px]">{record.treatmentPlan || '__________'}</div>
              </div>
              <div>
                <div className="font-medium mb-1">Derivación Y/O Remisión:</div>
                <div className="border border-gray-300 p-2 min-h-[40px]">{record.referralInfo || '__________'}</div>
              </div>
              <div>
                <div className="font-medium mb-1">Recomendaciones:</div>
                <div className="border border-gray-300 p-2 min-h-[40px]">{record.recommendations || '__________'}</div>
              </div>
            </div>
          </div>

          {/* Evolución */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="font-medium mb-1">Nombre:</div>
                <div className="border-b border-black pb-1">{record.patientName || '__________'}</div>
              </div>
              <div>
                <div className="font-medium mb-1">Historia N°:</div>
                <div className="border-b border-black pb-1">{record.recordNumber || '__________'}</div>
              </div>
            </div>
            
            <h2 className="font-bold text-xl border-b-2 border-[#19334c] mb-4 pb-2 text-[#19334c]">EVOLUCIÓN</h2>
            <div className="border border-gray-300 p-4 min-h-[150px]">
              {record.evolution || (
                <>
                  <div className="border-b border-black min-h-[20px] mb-2"></div>
                  <div className="border-b border-black min-h-[20px] mb-2"></div>
                  <div className="border-b border-black min-h-[20px] mb-2"></div>
                  <div className="border-b border-black min-h-[20px] mb-2"></div>
                  <div className="border-b border-black min-h-[20px] mb-2"></div>
                </>
              )}
            </div>
          </div>

          {/* Pie de página */}
          <div className="mt-12 pt-4 border-t border-gray-300 text-center text-xs">
            <div className="flex justify-center items-center mb-2">
              <div className="bg-[#19334c] w-8 h-8 rounded-full flex items-center justify-center mr-2">
                <FaNotesMedical className="text-white text-sm" />
              </div>
              <p className="font-bold text-[#19334c]">MentalMente - Centro de Psicología Integral</p>
            </div>
            <p className="text-[#19334c]">322 8555 682 | www.mentalmente.com | @mentotmentep</p>
            <p className="text-[#19334c] mt-1">Calle 123 #45-67, Ciudad | NIT: 123456789-0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordDetailsModal;