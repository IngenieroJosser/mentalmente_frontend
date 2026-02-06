'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { FaTimes, FaPrint, FaUser, FaNotesMedical, FaHistory, FaStethoscope, FaUsers, FaFileMedicalAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { MedicalRecordDetailsModalProps } from '@/lib/type';
import SpinnerPDF from './SpinnerPDF';

const MedicalRecordDetailsModal: React.FC<MedicalRecordDetailsModalProps> = ({
  record,
  onClose
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [pdfStatus, setPdfStatus] = useState<{success: boolean; message: string} | null>(null);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setPdfStatus(null);
    
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
  
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
        
        setPdfStatus({
          success: true,
          message: 'PDF generado con éxito'
        });
      } else {
        // Manejar error
        let errorMessage = 'Error desconocido al generar PDF';
        
        try {
          // Intentar obtener el mensaje de error
          const errorData = await response.clone().json();
          errorMessage = errorData.error || errorData.message || errorMessage;
          
          // Mensajes específicos para errores comunes
          if (errorData.error?.includes('no encontrado')) {
            errorMessage = 'Archivo de plantilla o fuente no encontrado. Contacte al administrador.';
          }
        } catch {
          // Si falla el parseo JSON, usar el texto plano
          try {
            const text = await response.text();
            errorMessage = text;
          } catch {
            errorMessage = `Error ${response.status}: ${response.statusText}`;
          }
        }
        
        throw new Error(errorMessage);
      }
      
    } catch (error: unknown) {
      console.error('Error en generación de PDF:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error desconocido al generar PDF';
      
      setPdfStatus({
        success: false,
        message: `Error al generar PDF: ${errorMessage}`
      });
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
    <div className="flex items-center mb-6">
      <div className="bg-gradient-to-r from-[#19334c] to-[#2c5170] p-3 rounded-lg shadow-md mr-3">
        <div className="text-white text-xl">{icon}</div>
      </div>
      <h3 className="text-2xl font-bold text-[#19334c]">{title}</h3>
    </div>
  );

  // Renderizar campo con diseño premium
  const renderField = (label: string, value: string | null | undefined) => (
    <div className="mb-4">
      <div className="text-sm font-medium text-[#19334c]/70 uppercase tracking-wide mb-1">{label}</div>
      <div className="text-lg font-medium text-[#19334c] border-b border-[#e0e7ff] pb-2">
        {value || <span className="text-gray-400 italic">No especificado</span>}
      </div>
    </div>
  );

  // Renderizar campo multilínea premium
  const renderMultilineField = (label: string, value: string | null) => (
    <div className="mb-6">
      <div className="text-sm font-medium text-[#19334c]/70 uppercase tracking-wide mb-2">{label}</div>
      <div className="bg-gradient-to-b from-[#f8f9fc] to-white p-4 rounded-xl border border-[#e0e7ff] shadow-sm text-[#19334c] min-h-[60px] whitespace-pre-wrap">
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

  // Tabs de navegación premium
  const tabs = [
    { id: 'basic', label: 'Información Básica', icon: <FaUser /> },
    { id: 'medical', label: 'Antecedentes', icon: <FaNotesMedical /> },
    { id: 'clinical', label: 'Clínica', icon: <FaStethoscope /> },
    { id: 'evolution', label: 'Evolución', icon: <FaHistory /> },
    { id: 'professionals', label: 'Profesionales', icon: <FaUsers /> },
  ];

  return (
    <div className="fixed inset-0 bg-[#19334c]/90 flex items-center justify-center z-[100] backdrop-blur-md">
      {isGenerating && <SpinnerPDF />}

      {/* Modal principal - Diseño Premium */}
      <div className="bg-gradient-to-br from-white to-[#f8f9fc] rounded-3xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e0e7ff] relative">
        {/* Logo Mentalmente */}
        <div className="absolute top-6 right-8 flex items-center">
          <div className="bg-gradient-to-r from-[#19334c] to-[#2c5170] p-2 rounded-lg mr-2">
            <FaFileMedicalAlt className="text-white text-xl" />
          </div>
          <span className="text-xl font-bold text-[#19334c]">Mentalmente</span>
        </div>
        
        {/* Header Premium */}
        <div className="mb-8 pb-6 border-b border-[#e0e7ff]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#19334c] to-[#c77914] bg-clip-text text-transparent">
                Historia Clínica Digital
              </h1>
              <p className="text-[#19334c]/80 mt-2 max-w-2xl">
                Sistema de gestión de historias clínicas de Mentalmente - Centro de Excelencia en Psicología Integral
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                aria-label='Imprimir'
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-gradient-to-r from-[#19334c] to-[#2c5170] text-white px-5 py-2.5 rounded-xl hover:from-[#c77914] hover:to-[#e0a449] transition-all shadow-lg disabled:opacity-50 transform hover:scale-[1.02] duration-300"
              >
                <FaPrint className="text-lg" /> 
                <span className="font-medium">{isGenerating ? 'Generando PDF...' : 'Exportar PDF'}</span>
              </button>
              <button 
                aria-label='Cerrar modal'
                onClick={onClose}
                className="bg-gradient-to-r from-[#f8f9fc] to-white p-2 rounded-full transition-all shadow-sm border border-[#e0e7ff] hover:from-[#e0e7ff] hover:to-[#f0f4ff] transform hover:scale-110 duration-200"
              >
                <FaTimes className="text-[#19334c]" size={20} />
              </button>
            </div>
          </div>
          
          <div className="mt-6 bg-gradient-to-r from-[#19334c]/5 to-[#c77914]/5 p-4 rounded-xl border border-[#e0e7ff]">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <div className="bg-[#19334c]/10 p-2 rounded-lg mr-3">
                  <FaUser className="text-[#19334c]" />
                </div>
                <div>
                  <div className="text-sm text-[#19334c]/70">Paciente</div>
                  <div className="font-bold text-xl text-[#19334c]">{record.patientName}</div>
                </div>
              </div>
              
              <div className="h-8 w-px bg-[#e0e7ff]"></div>
              
              <div>
                <div className="text-sm text-[#19334c]/70">Identificación</div>
                <div className="font-medium text-lg text-[#19334c]">{record.identificationNumber}</div>
              </div>
              
              <div className="h-8 w-px bg-[#e0e7ff]"></div>
              
              <div>
                <div className="text-sm text-[#19334c]/70">Historia Clínica</div>
                <div className="font-medium text-lg text-[#19334c]">{record.recordNumber}</div>
              </div>
              
              <div className="h-8 w-px bg-[#e0e7ff]"></div>
              
              <div>
                <div className="text-sm text-[#19334c]/70">Fecha de creación</div>
                <div className="font-medium text-lg text-[#19334c]">{formatDate(record.createdAt)}</div>
              </div>
            </div>
          </div>
          
          {/* Estado de generación de PDF */}
          {pdfStatus && (
            <div className={`mt-4 p-3 rounded-lg flex items-center ${
              pdfStatus.success 
                ? 'bg-green-100 border border-green-300 text-green-700' 
                : 'bg-red-100 border border-red-300 text-red-700'
            }`}>
              {pdfStatus.success ? (
                <FaCheckCircle className="mr-2 text-green-600" />
              ) : (
                <FaExclamationTriangle className="mr-2 text-red-600" />
              )}
              <span>{pdfStatus.message}</span>
            </div>
          )}
        </div>

        {/* Pestañas de navegación premium */}
        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all shadow-sm transform duration-200 ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-[#19334c] to-[#2c5170] text-white shadow-md hover:shadow-lg scale-[1.02]' 
                  : 'bg-white text-[#19334c] hover:bg-[#f8f9fc] border border-[#e0e7ff] hover:from-[#f8f9fc] hover:to-[#f0f4ff] hover:scale-[1.02]'
              }`}
            >
              <div className="text-lg">{tab.icon}</div>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Contenido de pestañas - Diseño Premium */}
        <div className="space-y-8">
          {/* Información Básica */}
          {activeTab === 'basic' && (
            <div className="bg-gradient-to-br from-white to-[#f8f9fc] p-8 rounded-3xl border border-[#e0e7ff] shadow-sm">
              <SectionHeader icon={<FaUser />} title="Datos Personales" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Tarjeta de Identificación */}
                <div className="bg-gradient-to-b from-white to-[#f8f9fc] p-6 rounded-2xl border border-[#e0e7ff] shadow-sm">
                  <div className="flex items-center mb-5">
                    <div className="bg-gradient-to-r from-[#19334c]/10 to-[#2c5170]/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                      <FaUser className="text-[#19334c] text-xl" />
                    </div>
                    <h4 className="font-bold text-xl text-[#19334c]">Identificación</h4>
                  </div>
                  {renderField("Tipo de identificación", record.identificationType)}
                  {renderField("Número de identificación", record.identificationNumber)}
                  {renderField("Fecha de nacimiento", formatDate(record.birthDate))}
                  {renderField("Edad", record.age?.toString())}
                </div>
                
                {/* Tarjeta de Información Personal */}
                <div className="bg-gradient-to-b from-white to-[#f8f9fc] p-6 rounded-2xl border border-[#e0e7ff] shadow-sm">
                  <div className="flex items-center mb-5">
                    <div className="bg-gradient-to-r from-[#19334c]/10 to-[#2c5170]/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                      <FaUser className="text-[#19334c] text-xl" />
                    </div>
                    <h4 className="font-bold text-xl text-[#19334c]">Información Personal</h4>
                  </div>
                  {renderField("Escolaridad", record.educationLevel)}
                  {renderField("Ocupación", record.occupation)}
                  {renderField("Nacionalidad", record.nationality)}
                  {renderField("Religión", record.religion)}
                  {renderField("Lugar de nacimiento", record.birthPlace)}
                </div>
                
                {/* Tarjeta de Contacto */}
                <div className="bg-gradient-to-b from-white to-[#f8f9fc] p-6 rounded-2xl border border-[#e0e7ff] shadow-sm">
                  <div className="flex items-center mb-5">
                    <div className="bg-gradient-to-r from-[#19334c]/10 to-[#2c5170]/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                      <FaUser className="text-[#19334c] text-xl" />
                    </div>
                    <h4 className="font-bold text-xl text-[#19334c]">Contacto</h4>
                  </div>
                  {renderField("Dirección", record.address)}
                  {renderField("Barrio", record.neighborhood)}
                  {renderField("Ciudad", record.city)}
                  {renderField("Departamento", record.state)}
                  {renderField("Teléfono", record.phone)}
                  {renderField("Celular", record.cellPhone)}
                  {renderField("Email", record.email)}
                </div>
                
                {/* Tarjeta de Atención */}
                <div className="bg-gradient-to-b from-white to-[#f8f9fc] p-6 rounded-2xl border border-[#e0e7ff] shadow-sm md:col-span-3">
                  <div className="flex items-center mb-5">
                    <div className="bg-gradient-to-r from-[#19334c]/10 to-[#2c5170]/10 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                      <FaUser className="text-[#19334c] text-xl" />
                    </div>
                    <h4 className="font-bold text-xl text-[#19334c]">Atención</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      {renderField("Fecha de ingreso", formatDate(record.admissionDate))}
                      {renderField("EPS", record.eps)}
                    </div>
                    <div>
                      {renderField("¿Es beneficiario?", record.isBeneficiary ? 'Sí' : 'No')}
                      {renderField("Remitido por", record.referredBy)}
                    </div>
                    <div className="bg-gradient-to-r from-[#f8f9fc] to-[#f0f4ff] p-4 rounded-xl border border-[#e0e7ff]">
                      <div className="text-sm text-[#19334c]/70 mb-2">Estado del tratamiento</div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="font-medium text-[#19334c]">Activo</span>
                      </div>
                      <div className="mt-2 text-sm text-[#19334c]/70">Última sesión: 15/06/2023</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Antecedentes */}
          {activeTab === 'medical' && (
            <div className="bg-gradient-to-br from-white to-[#f8f9fc] p-8 rounded-3xl border border-[#e0e7ff] shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <SectionHeader icon={<FaNotesMedical />} title="Antecedentes Personales" />
                  
                  <div className="space-y-6">
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
                  
                  <div className="space-y-6">
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
                  
                  <div className="space-y-6">
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
            <div className="bg-gradient-to-br from-white to-[#f8f9fc] p-8 rounded-3xl border border-[#e0e7ff] shadow-sm">
              <SectionHeader icon={<FaStethoscope />} title="Información Clínica" />
              
              <div className="space-y-8">
                {renderMultilineField("Motivo de consulta", record.consultationReason)}
                {renderMultilineField("Historia del problema (duración, evolución, frecuencia)", record.problemHistory)}
                {renderMultilineField("Expectativas del paciente respecto a la terapia", record.therapyExpectations)}
                {renderMultilineField("Examen Mental", record.mentalExam)}
                {renderMultilineField("Evaluación psicológica (estado de ánimo, niveles de ansiedad y estrés, habilidades de afrontamiento, funcionamiento cognitivo, emocional, conductual y social)", record.psychologicalAssessment)}
                {renderMultilineField("IDX O DX (DSM5-CIE 10)", record.diagnosis)}
                {renderMultilineField("Objetivos terapéuticos", record.therapeuticGoals)}
                {renderMultilineField("Plan Terapéutico", record.treatmentPlan)}
                {renderMultilineField("Derivación Y/O Remisión", record.referralInfo)}
                {renderMultilineField("Recomendaciones", record.recommendations)}
              </div>
            </div>
          )}

          {/* Evolución */}
          {activeTab === 'evolution' && (
            <div className="bg-gradient-to-br from-white to-[#f8f9fc] p-8 rounded-3xl border border-[#e0e7ff] shadow-sm">
              <SectionHeader icon={<FaHistory />} title="Evolución del Paciente" />
              
              <div className="bg-gradient-to-b from-white to-[#f8f9fc] p-6 rounded-2xl border border-[#e0e7ff] shadow-sm">
                {record.evolution ? (
                  <div className="text-[#19334c] whitespace-pre-line">
                    {record.evolution}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-lg mb-4">No hay registros de evolución</div>
                    <button className="bg-gradient-to-r from-[#19334c] to-[#2c5170] text-white px-4 py-2 rounded-lg">
                      Agregar nueva entrada
                    </button>
                  </div>
                )}
              </div>
              
              {/* Gráfico de progreso ficticio */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg text-[#19334c]">Progreso del tratamiento</h4>
                  <div className="text-sm text-[#19334c]/70">Últimos 6 meses</div>
                </div>
                <div className="h-40 bg-gradient-to-b from-[#f8f9fc] to-white p-4 rounded-xl border border-[#e0e7ff]">
                  <div className="flex h-full items-end gap-4">
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-[#19334c]/70 mb-1">Ene</div>
                      <div className="w-full bg-gradient-to-t from-[#19334c] to-[#2c5170] rounded-t h-1/4"></div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-[#19334c]/70 mb-1">Feb</div>
                      <div className="w-full bg-gradient-to-t from-[#19334c] to-[#2c5170] rounded-t h-1/3"></div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-[#19334c]/70 mb-1">Mar</div>
                      <div className="w-full bg-gradient-to-t from-[#19334c] to-[#2c5170] rounded-t h-1/2"></div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-[#19334c]/70 mb-1">Abr</div>
                      <div className="w-full bg-gradient-to-t from-[#19334c] to-[#2c5170] rounded-t h-2/3"></div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-[#19334c]/70 mb-1">May</div>
                      <div className="w-full bg-gradient-to-t from-[#c77914] to-[#e0a449] rounded-t h-3/4"></div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-[#19334c]/70 mb-1">Jun</div>
                      <div className="w-full bg-gradient-to-t from-[#c77914] to-[#e0a449] rounded-t h-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profesionales */}
          {activeTab === 'professionals' && (
            <div className="bg-gradient-to-br from-white to-[#f8f9fc] p-8 rounded-3xl border border-[#e0e7ff] shadow-sm">
              <SectionHeader icon={<FaUsers />} title="Responsables y Profesionales" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-b from-white to-[#f8f9fc] p-6 rounded-2xl border border-[#e0e7ff] shadow-sm">
                  <h4 className="font-bold text-xl text-[#19334c] mb-6 flex items-center">
                    <div className="bg-gradient-to-r from-[#19334c]/10 to-[#2c5170]/10 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                      <FaUser className="text-[#19334c]" />
                    </div>
                    Responsable 1
                  </h4>
                  <div className="space-y-4">
                    {renderField("Nombre", record.guardian1Name)}
                    {renderField("Parentesco", record.guardian1Relationship)}
                    {renderField("Teléfono", record.guardian1Phone)}
                    {renderField("Ocupación", record.guardian1Occupation)}
                  </div>
                </div>
                
                <div className="bg-gradient-to-b from-white to-[#f8f9fc] p-6 rounded-2xl border border-[#e0e7ff] shadow-sm">
                  <h4 className="font-bold text-xl text-[#19334c] mb-6 flex items-center">
                    <div className="bg-gradient-to-r from-[#19334c]/10 to-[#2c5170]/10 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                      <FaUser className="text-[#19334c]" />
                    </div>
                    Responsable 2
                  </h4>
                  <div className="space-y-4">
                    {renderField("Nombre", record.guardian2Name)}
                    {renderField("Parentesco", record.guardian2Relationship)}
                    {renderField("Teléfono", record.guardian2Phone)}
                    {renderField("Ocupación", record.guardian2Occupation)}
                  </div>
                </div>
                
                <div className="md:col-span-2 bg-gradient-to-b from-white to-[#f8f9fc] p-6 rounded-2xl border border-[#e0e7ff] shadow-sm">
                  <h4 className="font-bold text-xl text-[#19334c] mb-6 flex items-center">
                    <div className="bg-gradient-to-r from-[#19334c]/10 to-[#2c5170]/10 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                      <FaStethoscope className="text-[#19334c]" />
                    </div>
                    Profesional a cargo
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      {renderField("Atendido por", record.attendedBy)}
                      {renderField("Especialidad", "Psicología Clínica")}
                    </div>
                    <div>
                      {renderField("Número de tarjeta profesional", record.licenseNumber)}
                      {renderField("Años de experiencia", "8 años")}
                    </div>
                  </div>
                  
                  <div className="mt-8 flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="ml-4">
                      <div className="font-bold text-lg text-[#19334c]">Dra. Laura Méndez</div>
                      <div className="text-[#19334c]/70">Psicóloga Clínica - Especialista en Terapia Cognitivo-Conductual</div>
                      <div className="mt-1 text-sm text-[#19334c]/70">laura.mendez@mentalmente.com | +57 300 123 4567</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-between items-center">
          <div className="text-sm text-[#19334c]/70">
            Mentalmente © {new Date().getFullYear()} - Sistema de Historias Clínicas Digitales
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-[#19334c] to-[#2c5170] text-white font-medium rounded-xl hover:from-[#c77914] hover:to-[#e0a449] transition-all shadow-lg transform hover:scale-[1.03] duration-300"
          >
            Cerrar Historia
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordDetailsModal;