'use client';

import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { 
  FaTimes, FaPrint, FaUser, FaNotesMedical, FaHistory, 
  FaStethoscope, FaUsers, FaFileMedicalAlt, FaCheckCircle, 
  FaExclamationTriangle, FaPhone, FaIdCard, FaBuilding 
} from 'react-icons/fa';
import { MedicalRecordDetailsModalProps } from '@/lib/type';
import SpinnerPDF from './SpinnerPDF';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const MedicalRecordDetailsModal: React.FC<MedicalRecordDetailsModalProps> = ({
  record,
  onClose
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [pdfStatus, setPdfStatus] = useState<{success: boolean; message: string} | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setPdfStatus(null);

    try {
      if (!contentRef.current) {
        throw new Error('No se encontró el contenido para generar el PDF');
      }

      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: false,
        useCORS: true,
        onclone: (clonedDoc) => {
          // Eliminar reglas con lab() que puedan causar error
          try {
            const styleSheets = clonedDoc.styleSheets;
            for (let i = 0; i < styleSheets.length; i++) {
              const sheet = styleSheets[i];
              try {
                const rules = sheet.cssRules;
                if (!rules) continue;
                for (let j = 0; j < rules.length; j++) {
                  const rule = rules[j];
                  if (rule.cssText && rule.cssText.includes('lab(')) {
                    sheet.deleteRule(j);
                    j--;
                  }
                }
              } catch (e) {
                // Ignorar errores de acceso CORS
              }
            }
          } catch (e) {
            console.warn('Error al limpiar estilos:', e);
          }
        },
      });

      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

      pdf.save(`Historia_Clinica_${record.identificationNumber || 'sin_numero'}.pdf`);

      setPdfStatus({
        success: true,
        message: 'PDF generado con éxito'
      });

    } catch (error) {
      console.error('Error generando PDF:', error);
      setPdfStatus({
        success: false,
        message: `Error al generar PDF: ${error instanceof Error ? error.message : 'desconocido'}`
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return format(new Date(date), 'dd/MM/yyyy');
  };

  // Componentes de diseño profesional
  const Header = () => (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-[#e8e8e8]">
      {/* Logo a la izquierda */}
      <div className="flex items-center mb-4 md:mb-0">
        <img 
          src="/logo-sana-tu.png" 
          alt="SanaTú Quingar" 
          className="h-16 w-auto mr-4"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const fallback = document.createElement('div');
              fallback.className = 'w-16 h-16 bg-gradient-to-br from-[#bec5a4] to-[#a0a78c] rounded-lg flex items-center justify-center text-white font-bold text-2xl';
              fallback.textContent = 'SQ';
              parent.prepend(fallback);
            }
          }}
        />
        <div>
          <h1 className="text-2xl font-light text-[#3a3a3a] tracking-wide">
            Sana<span className="font-semibold text-[#bec5a4]">Tú</span> Quingar
          </h1>
          <p className="text-sm text-[#666666]">Centro de Psicología Integral</p>
        </div>
      </div>

      {/* Información de la empresa a la derecha */}
      <div className="text-right">
        <div className="flex items-center justify-end mb-1">
          <FaBuilding className="text-[#bec5a4] mr-2" size={14} />
          <span className="font-semibold text-[#3a3a3a]">SANATÚ SAS</span>
        </div>
        <div className="flex items-center justify-end mb-1">
          <FaIdCard className="text-[#bec5a4] mr-2" size={14} />
          <span className="text-sm text-[#666666]">NIT 902010331-8</span>
        </div>
        <div className="flex items-center justify-end mb-2">
          <FaPhone className="text-[#bec5a4] mr-2" size={14} />
          <span className="text-sm text-[#666666]">Tel: 3113266223</span>
        </div>
        <div className="border-t border-[#bec5a4]/30 pt-2">
          <span className="font-medium text-[#3a3a3a] uppercase tracking-wider text-sm">
            Historia Clínica Psicológica
          </span>
        </div>
      </div>
    </div>
  );

  const Footer = () => (
    <div className="mt-10 pt-6 border-t border-[#e8e8e8] text-center">
      <div className="flex flex-col items-center">
        <p className="font-medium text-[#3a3a3a]">Liyiveth Quintero García</p>
        <p className="text-sm text-[#666666] mb-2">Psicóloga - TP No. 229742</p>
        <p className="text-xs text-[#999999]">SanaTú SAS</p>
      </div>
      <div className="mt-4 text-xs text-[#999999]">
        © {new Date().getFullYear()} SanaTú Quingar - Sistema de Historias Clínicas Digitales
      </div>
    </div>
  );

  // Renderizar secciones con iconos (estilo profesional)
  const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <div className="flex items-center mb-6">
      <div className="bg-gradient-to-r from-[#bec5a4] to-[#a0a78c] p-3 rounded-lg shadow-md mr-3">
        <div className="text-white text-xl">{icon}</div>
      </div>
      <h3 className="text-2xl font-light text-[#3a3a3a] tracking-wide">{title}</h3>
    </div>
  );

  const renderField = (label: string, value: string | null | undefined) => (
    <div className="mb-4">
      <div className="text-xs font-medium text-[#666666] uppercase tracking-wider mb-1">{label}</div>
      <div className="text-base text-[#3a3a3a] border-b border-[#e8e8e8] pb-2">
        {value || <span className="text-[#999999] italic">No especificado</span>}
      </div>
    </div>
  );

  const renderMultilineField = (label: string, value: string | null) => (
    <div className="mb-6">
      <div className="text-xs font-medium text-[#666666] uppercase tracking-wider mb-2">{label}</div>
      <div className="bg-white p-4 rounded-lg border border-[#e8e8e8] shadow-sm text-[#3a3a3a] min-h-[80px] whitespace-pre-wrap">
        {value || (
          <span className="text-[#999999] italic">
            {label.includes('Recomendaciones') ? 'Sin recomendaciones' : 
             label.includes('Evolución') ? 'Sin registro de evolución' : 
             'Sin información especificada'}
          </span>
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'basic', label: 'Datos Personales', icon: <FaUser /> },
    { id: 'medical', label: 'Antecedentes', icon: <FaNotesMedical /> },
    { id: 'clinical', label: 'Información Clínica', icon: <FaStethoscope /> },
    { id: 'evolution', label: 'Evolución', icon: <FaHistory /> },
    { id: 'professionals', label: 'Profesionales', icon: <FaUsers /> },
  ];

  return (
    <div className="fixed inset-0 bg-[#3a3a3a]/90 flex items-center justify-center z-[100] backdrop-blur-md">
      {isGenerating && <SpinnerPDF />}

      <div className="bg-white rounded-3xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e8e8e8] relative">
        {/* Contenedor para capturar el PDF (todo menos botones) */}
        <div ref={contentRef} className="pdf-content">
          {/* Header profesional */}
          <Header />

          {/* Resumen rápido del paciente (similar a antes pero más elegante) */}
          <div className="mb-8 bg-gradient-to-r from-[#f8f8f8] to-white p-4 rounded-xl border border-[#e8e8e8]">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center">
                <FaUser className="text-[#bec5a4] mr-2" size={14} />
                <span className="text-[#666666]">Paciente:</span>
                <span className="ml-2 font-medium text-[#3a3a3a]">{record.patientName}</span>
              </div>
              <div className="flex items-center">
                <FaIdCard className="text-[#bec5a4] mr-2" size={14} />
                <span className="text-[#666666]">ID:</span>
                <span className="ml-2 font-medium text-[#3a3a3a]">{record.identificationNumber}</span>
              </div>
              <div className="flex items-center">
                <FaFileMedicalAlt className="text-[#bec5a4] mr-2" size={14} />
                <span className="text-[#666666]">HC:</span>
                <span className="ml-2 font-medium text-[#3a3a3a]">{record.recordNumber}</span>
              </div>
              <div className="flex items-center">
                <FaHistory className="text-[#bec5a4] mr-2" size={14} />
                <span className="text-[#666666]">Fecha:</span>
                <span className="ml-2 font-medium text-[#3a3a3a]">{formatDate(record.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Pestañas (estilo más limpio) */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-[#e8e8e8] pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#bec5a4] text-white shadow-md' 
                    : 'text-[#666666] hover:text-[#3a3a3a] hover:bg-[#f8f8f8]'
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Contenido de pestañas */}
          <div className="space-y-8">
            {/* Información Básica */}
            {activeTab === 'basic' && (
              <div>
                <SectionHeader icon={<FaUser />} title="Datos Personales" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="col-span-1">
                    <h4 className="font-medium text-[#3a3a3a] mb-4 pb-2 border-b border-[#bec5a4]">Identificación</h4>
                    {renderField("Tipo", record.identificationType)}
                    {renderField("Número", record.identificationNumber)}
                    {renderField("Fecha nacimiento", formatDate(record.birthDate))}
                    {renderField("Edad", record.age?.toString())}
                  </div>
                  <div className="col-span-1">
                    <h4 className="font-medium text-[#3a3a3a] mb-4 pb-2 border-b border-[#bec5a4]">Información Personal</h4>
                    {renderField("Escolaridad", record.educationLevel)}
                    {renderField("Ocupación", record.occupation)}
                    {renderField("Nacionalidad", record.nationality)}
                    {renderField("Religión", record.religion)}
                    {renderField("Lugar de nacimiento", record.birthPlace)}
                  </div>
                  <div className="col-span-1">
                    <h4 className="font-medium text-[#3a3a3a] mb-4 pb-2 border-b border-[#bec5a4]">Contacto</h4>
                    {renderField("Dirección", record.address)}
                    {renderField("Barrio", record.neighborhood)}
                    {renderField("Ciudad", record.city)}
                    {renderField("Departamento", record.state)}
                    {renderField("Teléfono", record.phone)}
                    {renderField("Celular", record.cellPhone)}
                    {renderField("Email", record.email)}
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-[#3a3a3a] mb-4 pb-2 border-b border-[#bec5a4]">Atención</h4>
                    {renderField("Fecha ingreso", formatDate(record.admissionDate))}
                    {renderField("EPS", record.eps)}
                    {renderField("Beneficiario", record.isBeneficiary ? 'Sí' : 'No')}
                    {renderField("Remitido por", record.referredBy)}
                  </div>
                </div>
              </div>
            )}

            {/* Antecedentes */}
            {activeTab === 'medical' && (
              <div>
                <SectionHeader icon={<FaNotesMedical />} title="Antecedentes" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-[#3a3a3a] mb-4 pb-2 border-b border-[#bec5a4]">Personales</h4>
                    {renderMultilineField("Patológicos", record.personalPathological)}
                    {renderMultilineField("Quirúrgicos", record.personalSurgical)}
                    {renderMultilineField("Psicopatológicos", record.personalPsychopathological)}
                    {renderMultilineField("Trauma/Abuso", record.traumaHistory)}
                    {renderMultilineField("Sueño", record.sleepStatus)}
                    {renderMultilineField("Sustancias", record.substanceUse)}
                    {renderMultilineField("Otros", record.personalOther)}
                  </div>
                  <div>
                    <h4 className="font-medium text-[#3a3a3a] mb-4 pb-2 border-b border-[#bec5a4]">Familiares</h4>
                    {renderMultilineField("Patológicos", record.familyPathological)}
                    {renderMultilineField("Quirúrgicos", record.familySurgical)}
                    {renderMultilineField("Psicopatológicos", record.familyPsychopathological)}
                    {renderMultilineField("Traumáticos", record.familyTraumatic)}
                    {renderMultilineField("Sustancias", record.familySubstanceUse)}
                    {renderMultilineField("Otros", record.familyOther)}
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-medium text-[#3a3a3a] mb-4 pb-2 border-b border-[#bec5a4]">Desarrollo</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderMultilineField("Embarazo", record.pregnancyInfo)}
                    {renderMultilineField("Parto", record.deliveryInfo)}
                    {renderMultilineField("Desarrollo psicomotor", record.psychomotorDevelopment)}
                    {renderMultilineField("Dinámica familiar", record.familyDynamics)}
                  </div>
                </div>
              </div>
            )}

            {/* Información Clínica */}
            {activeTab === 'clinical' && (
              <div>
                <SectionHeader icon={<FaStethoscope />} title="Información Clínica" />
                <div className="space-y-6">
                  {renderMultilineField("Motivo de consulta", record.consultationReason)}
                  {renderMultilineField("Historia del problema", record.problemHistory)}
                  {renderMultilineField("Expectativas", record.therapyExpectations)}
                  {renderMultilineField("Examen Mental", record.mentalExam)}
                  {renderMultilineField("Evaluación psicológica", record.psychologicalAssessment)}
                  {renderMultilineField("Diagnóstico (DSM5/CIE10)", record.diagnosis)}
                  {renderMultilineField("Objetivos terapéuticos", record.therapeuticGoals)}
                  {renderMultilineField("Plan terapéutico", record.treatmentPlan)}
                  {renderMultilineField("Derivaciones", record.referralInfo)}
                  {renderMultilineField("Recomendaciones", record.recommendations)}
                </div>
              </div>
            )}

            {/* Evolución */}
            {activeTab === 'evolution' && (
              <div>
                <SectionHeader icon={<FaHistory />} title="Evolución" />
                {renderMultilineField("Evolución del paciente", record.evolution)}
                <div className="mt-8">
                  <h4 className="font-medium text-[#3a3a3a] mb-4 pb-2 border-b border-[#bec5a4]">Progreso del tratamiento</h4>
                  <div className="h-40 bg-gradient-to-b from-[#f8f8f8] to-white p-4 rounded-xl border border-[#e8e8e8]">
                    <div className="flex h-full items-end gap-4">
                      {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'].map((mes, idx) => (
                        <div key={mes} className="flex-1 flex flex-col items-center">
                          <div className="text-xs text-[#666666] mb-1">{mes}</div>
                          <div 
                            className="w-full bg-gradient-to-t from-[#bec5a4] to-[#a0a78c] rounded-t"
                            style={{ height: `${(idx + 1) * 15}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profesionales */}
            {activeTab === 'professionals' && (
              <div>
                <SectionHeader icon={<FaUsers />} title="Profesionales y Responsables" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-[#3a3a3a] mb-4 pb-2 border-b border-[#bec5a4]">Responsable 1</h4>
                    {renderField("Nombre", record.guardian1Name)}
                    {renderField("Parentesco", record.guardian1Relationship)}
                    {renderField("Teléfono", record.guardian1Phone)}
                    {renderField("Ocupación", record.guardian1Occupation)}
                  </div>
                  <div>
                    <h4 className="font-medium text-[#3a3a3a] mb-4 pb-2 border-b border-[#bec5a4]">Responsable 2</h4>
                    {renderField("Nombre", record.guardian2Name)}
                    {renderField("Parentesco", record.guardian2Relationship)}
                    {renderField("Teléfono", record.guardian2Phone)}
                    {renderField("Ocupación", record.guardian2Occupation)}
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-medium text-[#3a3a3a] mb-4 pb-2 border-b border-[#bec5a4]">Profesional a cargo</h4>
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
                </div>
              </div>
            )}
          </div>

          {/* Footer profesional */}
          <Footer />
        </div>

        {/* Botones fuera del PDF */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-gradient-to-r from-[#bec5a4] to-[#a0a78c] text-white px-5 py-2.5 rounded-xl hover:from-[#a0a78c] hover:to-[#8e957a] transition-all shadow-lg disabled:opacity-50 transform hover:scale-[1.02] duration-300"
          >
            <FaPrint className="text-lg" />
            <span className="font-medium">{isGenerating ? 'Generando PDF...' : 'Exportar PDF'}</span>
          </button>
          <button
            aria-label="Cerrar modal"
            onClick={onClose}
            className="bg-white p-2 rounded-full transition-all shadow-sm border border-[#e8e8e8] hover:bg-[#f8f8f8] transform hover:scale-110 duration-200"
          >
            <FaTimes className="text-[#3a3a3a]" size={20} />
          </button>
        </div>

        {/* Estado de generación */}
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
    </div>
  );
};

export default MedicalRecordDetailsModal;