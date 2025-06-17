'use client';

import React, { useRef, useState } from 'react';
import { format } from 'date-fns';
import { FaTimes, FaPrint, FaUser, FaUsers, FaUserMd, FaHistory, FaBrain, FaHeartbeat, FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import PrintableHistory from './PrintableHistory';
import { MedicalRecordDetailsModalProps } from '@/lib/type';

const MedicalRecordDetailsModal: React.FC<MedicalRecordDetailsModalProps> = ({ 
  record, 
  onClose 
}) => {
  const printableRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handlePrintMedicalRecord = useReactToPrint({
    content: () => printableRef.current,
    documentTitle: `Historia_Clinica_${record.recordNumber}`,
    onBeforeGetContent: () => Promise.resolve(),
    onAfterPrint: () => {}
  } as any);

  const formatDate = (date: Date | null) => {
    if (!date) return 'No especificada';
    return format(new Date(date), 'dd/MM/yyyy');
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const filteredSections = [
    {
      id: 'basic',
      title: "Información Básica",
      icon: <FaUser />,
      content: (
        <>
          <InfoRow label="Nombre del paciente" value={record.patientName} />
          <InfoRow label="Identificación" value={`${record.identificationType}: ${record.identificationNumber}`} />
          <InfoRow label="Fecha de nacimiento" value={formatDate(record.birthDate)} />
          <InfoRow label="Edad" value={record.age || 'No especificada'} />
          <InfoRow label="Escolaridad" value={record.educationLevel || 'No especificada'} />
          <InfoRow label="Ocupación" value={record.occupation || 'No especificada'} />
          <InfoRow label="Lugar de nacimiento" value={record.birthPlace || 'No especificado'} />
          <InfoRow label="Nacionalidad" value={record.nationality || 'No especificada'} />
          <InfoRow label="Religión" value={record.religion || 'No especificada'} />
          <InfoRow label="Dirección" value={record.address || 'No especificada'} />
          <InfoRow label="Barrio" value={record.neighborhood || 'No especificado'} />
          <InfoRow label="Ciudad" value={record.city || 'No especificada'} />
          <InfoRow label="Departamento" value={record.state || 'No especificado'} />
        </>
      )
    },
    {
      id: 'contact',
      title: "Contacto y EPS",
      icon: <FaUser />,
      content: (
        <>
          <InfoRow label="Fecha de ingreso" value={formatDate(record.admissionDate)} />
          <InfoRow label="Teléfono fijo" value={record.phone || 'No especificado'} />
          <InfoRow label="Celular" value={record.cellPhone || 'No especificado'} />
          <InfoRow label="Email" value={record.email || 'No especificado'} />
          <InfoRow label="EPS" value={record.eps || 'No especificada'} />
          <InfoRow label="¿Es beneficiario?" value={record.isBeneficiary ? 'Sí' : 'No'} />
          <InfoRow label="Remitido por" value={record.referredBy || 'No especificado'} />
        </>
      )
    },
    {
      id: 'guardians',
      title: "Responsables",
      icon: <FaUsers />,
      content: (
        <>
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
              <FaUser className="mr-2 text-[#c77914]" /> Responsable 1
            </h4>
            <InfoRow label="Nombre" value={record.guardian1Name || 'No especificado'} />
            <InfoRow label="Parentesco" value={record.guardian1Relationship || 'No especificado'} />
            <InfoRow label="Teléfono" value={record.guardian1Phone || 'No especificado'} />
            <InfoRow label="Ocupación" value={record.guardian1Occupation || 'No especificada'} />
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
              <FaUser className="mr-2 text-[#c77914]" /> Responsable 2
            </h4>
            <InfoRow label="Nombre" value={record.guardian2Name || 'No especificado'} />
            <InfoRow label="Parentesco" value={record.guardian2Relationship || 'No especificado'} />
            <InfoRow label="Teléfono" value={record.guardian2Phone || 'No especificado'} />
            <InfoRow label="Ocupación" value={record.guardian2Occupation || 'No especificada'} />
          </div>
        </>
      )
    },
    {
      id: 'professional',
      title: "Profesional",
      icon: <FaUserMd />,
      content: (
        <>
          <InfoRow label="Atendido por" value={record.attendedBy || 'No especificado'} />
          <InfoRow label="Tarjeta profesional" value={record.licenseNumber || 'No especificado'} />
        </>
      )
    },
    {
      id: 'personal',
      title: "Antecedentes Personales",
      icon: <FaHistory />,
      content: (
        <>
          <TextBlock label="Patológicos" value={record.personalPathological} />
          <TextBlock label="Quirúrgicos" value={record.personalSurgical} />
          <TextBlock label="Psicopatológicos" value={record.personalPsychopathological} />
          <TextBlock label="Historia de trauma o abuso" value={record.traumaHistory} />
          <TextBlock label="Estado del sueño" value={record.sleepStatus} />
          <TextBlock label="Consumo de SPA" value={record.substanceUse} />
          <TextBlock label="Otros" value={record.personalOther} />
        </>
      )
    },
    {
      id: 'family',
      title: "Antecedentes Familiares",
      icon: <FaUsers />,
      content: (
        <>
          <TextBlock label="Patológicos" value={record.familyPathological} />
          <TextBlock label="Quirúrgicos" value={record.familySurgical} />
          <TextBlock label="Psicopatológicos" value={record.familyPsychopathological} />
          <TextBlock label="Traumáticos" value={record.familyTraumatic} />
          <TextBlock label="Consumo de SPA" value={record.familySubstanceUse} />
          <TextBlock label="Otros" value={record.familyOther} />
        </>
      )
    },
    {
      id: 'development',
      title: "Desarrollo",
      icon: <FaBrain />,
      content: (
        <>
          <TextBlock label="Embarazo" value={record.pregnancyInfo} />
          <TextBlock label="Parto" value={record.deliveryInfo} />
          <TextBlock 
            label="Desarrollo psicomotor" 
            value={record.psychomotorDevelopment} 
            sublabel="(sentarse, caminar, hablar, control de esfínteres)"
          />
          <TextBlock label="Dinámica familiar" value={record.familyDynamics} />
        </>
      )
    },
    {
      id: 'clinical',
      title: "Información Clínica",
      icon: <FaHeartbeat />,
      content: (
        <>
          <TextBlock label="Motivo de consulta" value={record.consultationReason} />
          <TextBlock 
            label="Historia del problema" 
            value={record.problemHistory} 
            sublabel="(duración, evolución, frecuencia)"
          />
          <TextBlock label="Expectativas de terapia" value={record.therapyExpectations} />
          <TextBlock label="Examen Mental" value={record.mentalExam} />
          <TextBlock 
            label="Evaluación psicológica" 
            value={record.psychologicalAssessment} 
            sublabel="(estado de ánimo, ansiedad, estrés, funcionamiento cognitivo)"
          />
          <TextBlock label="Diagnóstico (DSM5-CIE 10)" value={record.diagnosis} />
          <TextBlock label="Objetivos terapéuticos" value={record.therapeuticGoals} />
          <TextBlock label="Plan Terapéutico" value={record.treatmentPlan} />
          <TextBlock label="Derivación/Remisión" value={record.referralInfo} />
          <TextBlock label="Recomendaciones" value={record.recommendations} />
        </>
      )
    },
    ...(record.evolution ? [{
      id: 'evolution',
      title: "Evolución",
      icon: <FaHistory />,
      content: (
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
          <p className="text-gray-700 whitespace-pre-line">
            {record.evolution}
          </p>
        </div>
      )
    }] : [])
  ].filter(section => 
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    searchTerm === ''
  );

  return (
    <div className="fixed inset-0 bg-[#19334c]/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl border border-[#c77914] transform transition-all duration-300 scale-[0.98] hover:scale-100">
        {/* Encabezado Premium */}
        <div className="bg-gradient-to-r from-[#19334c] to-[#0c1a29] p-5 flex justify-between items-center border-b border-[#c77914] relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#c77914] via-[#d99d4e] to-[#c77914]"></div>
          
          <div>
            <div className="flex items-center mb-2">
              <div className="bg-[#c77914] p-2 rounded-lg mr-3">
                <FaUserMd className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Historia Clínica Premium
                </h2>
                <p className="text-[#c77914] font-light text-sm">
                  {record.patientName} | N° {record.recordNumber}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar sección..."
                className="bg-[#ffffff]/10 text-white placeholder-[#ffffff]/50 px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#c77914] transition-all pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ffffff]/50" />
            </div>
            
            <button 
              onClick={handlePrintMedicalRecord}
              className="flex items-center gap-2 bg-[#c77914] text-white px-4 py-2 rounded-lg hover:bg-[#b36d12] transition-all font-medium shadow-md hover:shadow-lg"
            >
              <FaPrint /> Exportar
            </button>
            <button 
              onClick={onClose}
              className="bg-[#ffffff]/20 hover:bg-[#ffffff]/30 p-3 rounded-full transition-colors"
            >
              <FaTimes className="text-white" />
            </button>
          </div>
        </div>

        {/* Contenido principal con scroll */}
        <div className="overflow-y-auto flex-1 p-5 bg-gradient-to-br from-white to-[#f9f9f9]">
          <div className="grid grid-cols-1 gap-4">
            {filteredSections.map(section => (
              <PremiumSectionCard 
                key={section.id}
                icon={section.icon}
                title={section.title}
                isOpen={activeSection === section.id}
                onToggle={() => toggleSection(section.id)}
              >
                {section.content}
              </PremiumSectionCard>
            ))}
          </div>
        </div>

        {/* Resumen profesional */}
        <div className="bg-[#f8f9fa] border-t border-[#eaeaea] p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>Profesional: <span className="font-medium text-[#19334c]">{record.attendedBy || 'No especificado'}</span></p>
              <p>Última actualización: <span className="font-medium text-[#19334c]">{formatDate(record.admissionDate)}</span></p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-sm text-[#19334c] hover:text-[#c77914] transition-colors"
              >
                Volver arriba
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-[#19334c] text-white font-medium rounded-lg hover:bg-[#0c1a29] transition-colors shadow-md"
              >
                Cerrar Historial
              </button>
            </div>
          </div>
        </div>

        {/* Componente oculto para impresión */}
        <div className="hidden">
          <div ref={printableRef}>
            <PrintableHistory record={record} />
          </div>
        </div>
        
        {/* Marca de agua premium */}
        <div className="absolute bottom-4 right-4 opacity-10 pointer-events-none">
          <svg width="80" height="80" viewBox="0 0 100 100" className="text-[#c77914]">
            <path d="M50 15 A35 35 0 1 0 50 85 A35 35 0 1 0 50 15 Z" fill="currentColor" />
            <path d="M50 30 A20 20 0 1 1 50 70 A20 20 0 1 1 50 30 Z" fill="#19334c" />
            <path d="M55 55 L70 40 L60 35 L50 45 L40 35 L30 40 L45 55 L35 60 L50 70 L65 60 Z" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Componente premium para secciones
const PremiumSectionCard = ({ 
  icon, 
  title, 
  isOpen, 
  onToggle, 
  children 
}: { 
  icon: React.ReactNode; 
  title: string; 
  isOpen: boolean; 
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className={`bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 transition-all duration-300 ${isOpen ? 'ring-2 ring-[#c77914]/30' : ''}`}>
    <button 
      onClick={onToggle}
      className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center">
        <div className="bg-[#19334c] p-2 rounded-lg mr-3">
          <span className="text-[#c77914]">{icon}</span>
        </div>
        <h3 className="font-semibold text-lg text-[#19334c]">{title}</h3>
      </div>
      <div className="text-[#c77914]">
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </div>
    </button>
    
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
      <div className="p-4 space-y-4 border-t border-gray-100">
        {children}
      </div>
    </div>
  </div>
);

// Componente para filas de información
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-wrap py-2 border-b border-gray-100 last:border-0 group">
    <span className="w-2/5 text-sm font-medium text-[#19334c]">{label}</span>
    <span className="w-3/5 text-sm text-gray-700 group-hover:text-[#19334c] transition-colors">
      {value}
    </span>
  </div>
);

// Componente para bloques de texto
const TextBlock = ({ 
  label, 
  value, 
  sublabel 
}: { 
  label: string; 
  value?: string; 
  sublabel?: string;
}) => (
  <div className="mb-4 last:mb-0">
    <div className="flex items-center mb-2">
      <div className="w-1 h-5 bg-[#c77914] mr-2 rounded-full"></div>
      <h4 className="font-medium text-[#19334c]">{label}</h4>
    </div>
    
    {sublabel && <p className="text-xs text-[#c77914] mb-2 ml-3">{sublabel}</p>}
    
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 ml-3">
      <p className="text-gray-700 whitespace-pre-line text-sm">
        {value || 'No especificado'}
      </p>
    </div>
  </div>
);

export default MedicalRecordDetailsModal;