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
import { pdf } from '@react-pdf/renderer';
import MedicalRecordPDF from './MedicalRecordPDF';

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
      const blob = await pdf(
        <MedicalRecordPDF record={record} baseUrl={window.location.origin} />
      ).toBlob();
  
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Historia_Clinica_${record.identificationNumber || 'sin_numero'}.pdf`;
      link.click();
  
      setTimeout(() => URL.revokeObjectURL(url), 100);
  
      setPdfStatus({ success: true, message: 'PDF generado con éxito' });
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

  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    return format(new Date(date), 'dd/MM/yyyy');
  };

  // Componentes de diseño profesional para el PDF
  const Header = () => (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b-2 border-[#bec5a4]">
      {/* Logo a la izquierda */}
      <div className="flex items-center mb-4 md:mb-0">
        <img 
          src="/logo-sana-tu.png" 
          alt="SanaTú Quingar" 
          className="h-20 w-auto mr-4"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const fallback = document.createElement('div');
              fallback.className = 'w-20 h-20 bg-gradient-to-br from-[#bec5a4] to-[#a0a78c] rounded-lg flex items-center justify-center text-white font-serif text-3xl';
              fallback.textContent = 'SQ';
              parent.prepend(fallback);
            }
          }}
        />
        <div>
          <h1 className="text-3xl font-serif text-[#2c3e50] tracking-tight">
            Sana<span className="font-semibold text-[#bec5a4]">Tú</span> Quingar
          </h1>
          <p className="text-sm text-[#7f8c8d]">Centro de Psicología Integral</p>
        </div>
      </div>

      {/* Información de la empresa a la derecha */}
      <div className="text-right border-l-2 border-[#bec5a4] pl-6">
        <div className="flex items-center justify-end mb-2">
          <FaBuilding className="text-[#bec5a4] mr-2" size={16} />
          <span className="font-serif text-[#2c3e50] text-lg">SANATÚ SAS</span>
        </div>
        <div className="flex items-center justify-end mb-1">
          <FaIdCard className="text-[#bec5a4] mr-2" size={14} />
          <span className="text-sm text-[#7f8c8d]">NIT 902010331-8</span>
        </div>
        <div className="flex items-center justify-end mb-1">
          <FaPhone className="text-[#bec5a4] mr-2" size={14} />
          <span className="text-sm text-[#7f8c8d]">Tel: 3113266223</span>
        </div>
        <div className="mt-3 pt-2 border-t border-[#bec5a4]">
          <span className="font-serif text-[#2c3e50] uppercase tracking-wider text-sm">
            Historia Clínica Psicológica
          </span>
        </div>
      </div>
    </div>
  );

  const Footer = () => (
    <div className="mt-12 pt-6 border-t-2 border-[#bec5a4] text-center">
      <div className="flex flex-col items-center">
        <p className="font-serif text-lg text-[#2c3e50]">Liyiveth Quintero García</p>
        <p className="text-sm text-[#7f8c8d] mb-2">Psicóloga - TP No. 229742</p>
        <p className="text-xs text-[#95a5a6]">SanaTú SAS</p>
      </div>
      <div className="mt-4 text-xs text-[#95a5a6]">
        © {new Date().getFullYear()} SanaTú Quingar - Sistema de Historias Clínicas Digitales
      </div>
    </div>
  );

  // Componente para cada sección
  const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <div className="flex items-center mb-6">
      <div className="bg-gradient-to-r from-[#bec5a4] to-[#a0a78c] p-3 rounded-lg shadow-md mr-3">
        <div className="text-white text-xl">{icon}</div>
      </div>
      <h2 className="text-2xl font-serif text-[#2c3e50]">{title}</h2>
    </div>
  );

  const Field = ({ label, value, className = "" }: { label: string; value?: string | null; className?: string }) => (
    <div className={`mb-4 ${className}`}>
      <div className="text-xs font-medium text-[#7f8c8d] uppercase tracking-wider mb-1">{label}</div>
      <div className="text-base text-[#2c3e50] border-b border-[#ecf0f1] pb-1">
        {value || <span className="text-[#bdc3c7] italic">—</span>}
      </div>
    </div>
  );

  const MultilineField = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="mb-6">
      <div className="text-xs font-medium text-[#7f8c8d] uppercase tracking-wider mb-2">{label}</div>
      <div className="bg-[#f9f9f9] p-4 rounded-lg border border-[#ecf0f1] text-[#2c3e50] min-h-[80px] whitespace-pre-wrap">
        {value || <span className="text-[#bdc3c7] italic">No registrado</span>}
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      {isGenerating && <SpinnerPDF />}

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">
        {/* Contenedor para capturar el PDF */}
        <div ref={contentRef} className="p-8">
          {/* Header */}
          <Header />

          {/* Resumen rápido del paciente */}
          <div className="mb-8 bg-[#f9f9f9] p-5 rounded-xl border border-[#ecf0f1] grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-[#7f8c8d] mb-1">Paciente</div>
              <div className="font-medium text-[#2c3e50]">{record.patientName}</div>
            </div>
            <div>
              <div className="text-xs text-[#7f8c8d] mb-1">Identificación</div>
              <div className="font-medium text-[#2c3e50]">{record.identificationNumber}</div>
            </div>
            <div>
              <div className="text-xs text-[#7f8c8d] mb-1">Historia Clínica</div>
              <div className="font-medium text-[#2c3e50]">{record.recordNumber}</div>
            </div>
            <div>
              <div className="text-xs text-[#7f8c8d] mb-1">Fecha de creación</div>
              <div className="font-medium text-[#2c3e50]">{formatDate(record.createdAt)}</div>
            </div>
          </div>

          {/* Pestañas (estilo limpio) */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-[#ecf0f1] pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#bec5a4] text-white shadow-md' 
                    : 'text-[#7f8c8d] hover:text-[#2c3e50] hover:bg-[#f2f2f2]'
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Contenido dinámico según pestaña activa */}
          <div className="space-y-8">
            {/* Pestaña Básica */}
            {activeTab === 'basic' && (
              <div>
                <SectionHeader icon={<FaUser />} title="Datos Personales" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg text-[#2c3e50] border-b border-[#bec5a4] pb-2">Identificación</h3>
                    <Field label="Tipo" value={record.identificationType} />
                    <Field label="Número" value={record.identificationNumber} />
                    <Field label="Fecha de nacimiento" value={formatDate(record.birthDate)} />
                    <Field label="Edad" value={record.age?.toString()} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg text-[#2c3e50] border-b border-[#bec5a4] pb-2">Información Personal</h3>
                    <Field label="Escolaridad" value={record.educationLevel} />
                    <Field label="Ocupación" value={record.occupation} />
                    <Field label="Nacionalidad" value={record.nationality} />
                    <Field label="Religión" value={record.religion} />
                    <Field label="Lugar de nacimiento" value={record.birthPlace} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg text-[#2c3e50] border-b border-[#bec5a4] pb-2">Contacto</h3>
                    <Field label="Dirección" value={record.address} />
                    <Field label="Barrio" value={record.neighborhood} />
                    <Field label="Ciudad" value={record.city} />
                    <Field label="Departamento" value={record.state} />
                    <Field label="Teléfono" value={record.phone} />
                    <Field label="Celular" value={record.cellPhone} />
                    <Field label="Email" value={record.email} />
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg text-[#2c3e50] border-b border-[#bec5a4] pb-2">Atención</h3>
                    <Field label="Fecha de ingreso" value={formatDate(record.admissionDate)} />
                    <Field label="EPS" value={record.eps} />
                    <Field label="Beneficiario" value={record.isBeneficiary ? 'Sí' : 'No'} />
                    <Field label="Remitido por" value={record.referredBy} />
                  </div>
                </div>
              </div>
            )}

            {/* Pestaña Antecedentes */}
            {activeTab === 'medical' && (
              <div>
                <SectionHeader icon={<FaNotesMedical />} title="Antecedentes" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg text-[#2c3e50] border-b border-[#bec5a4] pb-2">Personales</h3>
                    <MultilineField label="Patológicos" value={record.personalPathological} />
                    <MultilineField label="Quirúrgicos" value={record.personalSurgical} />
                    <MultilineField label="Psicopatológicos" value={record.personalPsychopathological} />
                    <MultilineField label="Trauma/Abuso" value={record.traumaHistory} />
                    <MultilineField label="Estado del sueño" value={record.sleepStatus} />
                    <MultilineField label="Consumo de sustancias" value={record.substanceUse} />
                    <MultilineField label="Otros" value={record.personalOther} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg text-[#2c3e50] border-b border-[#bec5a4] pb-2">Familiares</h3>
                    <MultilineField label="Patológicos" value={record.familyPathological} />
                    <MultilineField label="Quirúrgicos" value={record.familySurgical} />
                    <MultilineField label="Psicopatológicos" value={record.familyPsychopathological} />
                    <MultilineField label="Traumáticos" value={record.familyTraumatic} />
                    <MultilineField label="Consumo de sustancias" value={record.familySubstanceUse} />
                    <MultilineField label="Otros" value={record.familyOther} />
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="font-serif text-lg text-[#2c3e50] border-b border-[#bec5a4] pb-2 mb-4">Desarrollo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <MultilineField label="Embarazo" value={record.pregnancyInfo} />
                    <MultilineField label="Parto" value={record.deliveryInfo} />
                    <MultilineField label="Desarrollo psicomotor" value={record.psychomotorDevelopment} />
                    <MultilineField label="Dinámica familiar" value={record.familyDynamics} />
                  </div>
                </div>
              </div>
            )}

            {/* Pestaña Clínica */}
            {activeTab === 'clinical' && (
              <div>
                <SectionHeader icon={<FaStethoscope />} title="Información Clínica" />
                <div className="space-y-6">
                  <MultilineField label="Motivo de consulta" value={record.consultationReason} />
                  <MultilineField label="Historia del problema" value={record.problemHistory} />
                  <MultilineField label="Expectativas de la terapia" value={record.therapyExpectations} />
                  <MultilineField label="Examen mental" value={record.mentalExam} />
                  <MultilineField label="Evaluación psicológica" value={record.psychologicalAssessment} />
                  <MultilineField label="Diagnóstico (DSM5/CIE10)" value={record.diagnosis} />
                  <MultilineField label="Objetivos terapéuticos" value={record.therapeuticGoals} />
                  <MultilineField label="Plan terapéutico" value={record.treatmentPlan} />
                  <MultilineField label="Derivaciones / Remisiones" value={record.referralInfo} />
                  <MultilineField label="Recomendaciones" value={record.recommendations} />
                </div>
              </div>
            )}

            {/* Pestaña Evolución */}
            {activeTab === 'evolution' && (
              <div>
                <SectionHeader icon={<FaHistory />} title="Evolución" />
                <MultilineField label="Evolución del paciente" value={record.evolution} />
                <div className="mt-8">
                  <h3 className="font-serif text-lg text-[#2c3e50] border-b border-[#bec5a4] pb-2 mb-4">Progreso del tratamiento</h3>
                  <div className="h-48 bg-[#f9f9f9] p-4 rounded-xl border border-[#ecf0f1]">
                    <div className="flex h-full items-end gap-4">
                      {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'].map((mes, idx) => (
                        <div key={mes} className="flex-1 flex flex-col items-center">
                          <div className="text-xs text-[#7f8c8d] mb-2">{mes}</div>
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

            {/* Pestaña Profesionales */}
            {activeTab === 'professionals' && (
              <div>
                <SectionHeader icon={<FaUsers />} title="Profesionales y Responsables" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg text-[#2c3e50] border-b border-[#bec5a4] pb-2">Responsable 1</h3>
                    <Field label="Nombre" value={record.guardian1Name} />
                    <Field label="Parentesco" value={record.guardian1Relationship} />
                    <Field label="Teléfono" value={record.guardian1Phone} />
                    <Field label="Ocupación" value={record.guardian1Occupation} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg text-[#2c3e50] border-b border-[#bec5a4] pb-2">Responsable 2</h3>
                    <Field label="Nombre" value={record.guardian2Name} />
                    <Field label="Parentesco" value={record.guardian2Relationship} />
                    <Field label="Teléfono" value={record.guardian2Phone} />
                    <Field label="Ocupación" value={record.guardian2Occupation} />
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="font-serif text-lg text-[#2c3e50] border-b border-[#bec5a4] pb-2 mb-4">Profesional a cargo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Field label="Atendido por" value={record.attendedBy} />
                    <Field label="Número de tarjeta profesional" value={record.licenseNumber} />
                    <Field label="Especialidad" value="Psicología Clínica" />
                    <Field label="Años de experiencia" value="8 años" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <Footer />
        </div>

        {/* Botones fuera del PDF */}
        <div className="sticky bottom-0 bg-white border-t border-[#ecf0f1] p-4 flex justify-end space-x-3">
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
            className="bg-white p-2 rounded-full transition-all shadow-sm border border-[#ecf0f1] hover:bg-[#f8f8f8] transform hover:scale-110 duration-200"
          >
            <FaTimes className="text-[#2c3e50]" size={20} />
          </button>
        </div>

        {/* Estado de generación */}
        {pdfStatus && (
          <div className={`m-4 p-3 rounded-lg flex items-center ${
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