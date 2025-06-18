'use client';

import React, { useRef, useState } from 'react';
import { format } from 'date-fns';
import { FaTimes, FaPrint } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import { MedicalRecordDetailsModalProps } from '@/lib/type';
import SpinnerPDF from './SpinnerPDF';

const MedicalRecordDetailsModal: React.FC<MedicalRecordDetailsModalProps> = ({ 
  record, 
  onClose 
}) => {
  const renderMultilineField = (label: string, value: string | null, rows: number) => (
    <div className="mb-4">
      <div className="font-semibold mb-1">{label}:</div>
      <div className="text-gray-700 whitespace-pre-wrap">
        {value || 'N/A'}
      </div>
    </div>
  );
  const printableRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (!printableRef.current) return;
    
    setIsGenerating(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const originalElement = printableRef.current;
      
      // Clonar el elemento para no alterar el original
      const element = originalElement.cloneNode(true) as HTMLDivElement;
      
      // Establecer el ancho del clon
      element.style.width = '210mm';
      // Posicionar fuera de la vista
      element.style.position = 'fixed';
      element.style.top = '-10000px';
      element.style.left = '0';
      
      // Añadir el clon al body
      document.body.appendChild(element);
  
      // Crear un estilo para solucionar los colores
      const styleFix = document.createElement('style');
      styleFix.innerHTML = `
        * {
          color: #000 !important;
          background-color: #fff !important;
          border-color: #000 !important;
        }
      `;
      element.appendChild(styleFix);
  
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Historia_Clinica_${record.identificationNumber}.pdf`);
      
      // Eliminar el clon del body
      document.body.removeChild(element);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'No especificada';
    return format(new Date(date), 'dd/MM/yyyy');
  };

  // Función para mostrar guiones bajos cuando no hay datos
  const formatField = (value: string | null | undefined) => {
    return value ? value : '__________';
  };

  // Renderizar casillas de verificación para tipo de identificación
  const renderIdentificationType = (type: string) => {
    return (
      <span className="inline-flex items-center mr-4">
        {type} 
        <span className="inline-block w-6 h-6 border border-black ml-1 flex items-center justify-center">
          {record.identificationType === type ? '✓' : ''}
        </span>
      </span>
    );
  };

  // Renderizar checkbox para cotizante/beneficiario
  const renderEPSStatus = (type: string) => {
    const isChecked = 
      (type === 'Cotizante' && record.isBeneficiary) || 
      (type === 'Beneficiario' && record.isBeneficiary);
    
    return (
      <span className="inline-flex items-center mr-6">
        {type}
        <span className="inline-block w-6 h-6 border border-black ml-1 flex items-center justify-center">
          {isChecked ? '✓' : ''}
        </span>
      </span>
    );
  };

  // Renderizar campo con subrayado
  const renderField = (label: string, value: string | null | undefined, width: string = 'full') => {
    return (
      <div className={`mb-4 ${width}`}>
        <div className="flex items-center">
          <span className="font-semibold mr-2">{label}:</span>
          <span className="border-b border-black flex-1 min-w-[100px] px-2">
            {formatField(value)}
          </span>
        </div>
      </div>
    );
  };

  // Renderizar campo de texto largo
  const renderLongField = (label: string, value: string | null | undefined) => {
    return (
      <div className="mb-4">
        <div className="font-semibold">{label}:</div>
        <div className="border-b border-black min-h-[24px] px-2">
          {formatField(value)}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {isGenerating && <SpinnerPDF />}

      {/* Modal principal */}
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-[#19334c]">
            Detalles de Historia Clínica
          </h2>
          <div className="flex items-center space-x-4">
            <button 
              aria-label='Imprimir'
              onClick={generatePDF}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-[#19334c] text-white px-4 py-2 rounded-lg hover:bg-[#c77914] transition-colors disabled:opacity-50"
            >
              <FaPrint /> {isGenerating ? 'Generando...' : 'Generar PDF'}
            </button>
            <button 
              aria-label='Cerrar modal'
              onClick={onClose}
              className="hover:text-[#c77914] transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Sección de información básica */}
          <div className="border border-[#e0e7ff] rounded-xl overflow-hidden">
            <div className="bg-[#19334c] p-4">
              <h3 className="font-semibold text-lg text-white">Información Básica</h3>
            </div>
            <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Nombre del paciente</label>
                <p className="mt-1 text-sm text-gray-900">{record.patientName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Tipo de identificación</label>
                <p className="mt-1 text-sm text-gray-900">{record.identificationType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Número de identificación</label>
                <p className="mt-1 text-sm text-gray-900">{record.identificationNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Fecha de nacimiento</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(record.birthDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Edad</label>
                <p className="mt-1 text-sm text-gray-900">{record.age || 'No especificada'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Escolaridad</label>
                <p className="mt-1 text-sm text-gray-900">{record.educationLevel || 'No especificada'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Ocupación</label>
                <p className="mt-1 text-sm text-gray-900">{record.occupation || 'No especificada'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Lugar de nacimiento</label>
                <p className="mt-1 text-sm text-gray-900">{record.birthPlace || 'No especificado'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Nacionalidad</label>
                <p className="mt-1 text-sm text-gray-900">{record.nationality || 'No especificada'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Religión</label>
                <p className="mt-1 text-sm text-gray-900">{record.religion || 'No especificada'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Dirección de residencia</label>
                <p className="mt-1 text-sm text-gray-900">{record.address || 'No especificada'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Barrio</label>
                <p className="mt-1 text-sm text-gray-900">{record.neighborhood || 'No especificado'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Ciudad</label>
                <p className="mt-1 text-sm text-gray-900">{record.city || 'No especificada'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Departamento</label>
                <p className="mt-1 text-sm text-gray-900">{record.state || 'No especificado'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Fecha de ingreso</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(record.admissionDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Teléfono fijo</label>
                <p className="mt-1 text-sm text-gray-900">{record.phone || 'No especificado'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Celular</label>
                <p className="mt-1 text-sm text-gray-900">{record.cellPhone || 'No especificado'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <p className="mt-1 text-sm text-gray-900">{record.email || 'No especificado'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">EPS</label>
                <p className="mt-1 text-sm text-gray-900">{record.eps || 'No especificada'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">¿Es beneficiario?</label>
                <p className="mt-1 text-sm text-gray-900">{record.isBeneficiary ? 'Sí' : 'No'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Remitido por</label>
                <p className="mt-1 text-sm text-gray-900">{record.referredBy || 'No especificado'}</p>
              </div>
            </div>
          </div>

          {/* Responsables */}
          <div className="border border-[#e0e7ff] rounded-xl overflow-hidden">
            <div className="bg-[#19334c] p-4">
              <h3 className="font-semibold text-lg text-white">Responsables</h3>
            </div>
            <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Responsable 1</h4>
                <p><span className="font-medium">Nombre:</span> {record.guardian1Name || 'No especificado'}</p>
                <p><span className="font-medium">Parentesco:</span> {record.guardian1Relationship || 'No especificado'}</p>
                <p><span className="font-medium">Teléfono:</span> {record.guardian1Phone || 'No especificado'}</p>
                <p><span className="font-medium">Ocupación:</span> {record.guardian1Occupation || 'No especificada'}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Responsable 2</h4>
                <p><span className="font-medium">Nombre:</span> {record.guardian2Name || 'No especificado'}</p>
                <p><span className="font-medium">Parentesco:</span> {record.guardian2Relationship || 'No especificado'}</p>
                <p><span className="font-medium">Teléfono:</span> {record.guardian2Phone || 'No especificado'}</p>
                <p><span className="font-medium">Ocupación:</span> {record.guardian2Occupation || 'No especificada'}</p>
              </div>
            </div>
          </div>

          {/* Profesional */}
          <div className="border border-[#e0e7ff] rounded-xl overflow-hidden">
            <div className="bg-[#19334c] p-4">
              <h3 className="font-semibold text-lg text-white">Profesional</h3>
            </div>
            <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Atendido por</label>
                <p className="mt-1 text-sm text-gray-900">{record.attendedBy || 'No especificado'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Número de tarjeta profesional</label>
                <p className="mt-1 text-sm text-gray-900">{record.licenseNumber || 'No especificado'}</p>
              </div>
            </div>
          </div>

          {/* Antecedentes personales */}
          <div className="border border-[#e0e7ff] rounded-xl overflow-hidden">
            <div className="bg-[#19334c] p-4">
              <h3 className="font-semibold text-lg text-white">Antecedentes Personales</h3>
            </div>
            <div className="p-4 bg-white space-y-4">
              <div>
                <label className="block text-sm font-medium">Patológicos</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.personalPathological || 'No especificados'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Quirúrgicos</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.personalSurgical || 'No especificados'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Psicopatológicos</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.personalPsychopathological || 'No especificados'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Historia de trauma o abuso</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.traumaHistory || 'No especificada'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Estado del sueño</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.sleepStatus || 'No especificado'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Consumo de sustancias psicoactivas</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.substanceUse || 'No especificado'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Otros</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.personalOther || 'No especificados'}
                </p>
              </div>
            </div>
          </div>

          {/* Antecedentes familiares */}
          <div className="border border-[#e0e7ff] rounded-xl overflow-hidden">
            <div className="bg-[#19334c] p-4">
              <h3 className="font-semibold text-lg text-white">Antecedentes Familiares</h3>
            </div>
            <div className="p-4 bg-white space-y-4">
              <div>
                <label className="block text-sm font-medium">Patológicos</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.familyPathological || 'No especificados'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Quirúrgicos</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.familySurgical || 'No especificados'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Psicopatológicos</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.familyPsychopathological || 'No especificados'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Traumáticos</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.familyTraumatic || 'No especificados'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Consumo de sustancias psicoactivas</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.familySubstanceUse || 'No especificado'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Otros</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.familyOther || 'No especificados'}
                </p>
              </div>
            </div>
          </div>

          {/* Desarrollo */}
          <div className="border border-[#e0e7ff] rounded-xl overflow-hidden">
            <div className="bg-[#19334c] p-4">
              <h3 className="font-semibold text-lg text-white">Desarrollo</h3>
            </div>
            <div className="p-4 bg-white space-y-4">
              <div>
                <label className="block text-sm font-medium">Embarazo</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.pregnancyInfo || 'No especificado'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Parto</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.deliveryInfo || 'No especificado'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Desarrollo psicomotor (sentarse, caminar, hablar, control de esfínteres)</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.psychomotorDevelopment || 'No especificado'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Descripción de la dinámica familiar</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.familyDynamics || 'No especificada'}
                </p>
              </div>
            </div>
          </div>

          {/* Información clínica */}
          <div className="border border-[#e0e7ff] rounded-xl overflow-hidden">
            <div className="bg-[#19334c] p-4">
              <h3 className="font-semibold text-lg text-white">Información Clínica</h3>
            </div>
            <div className="p-4 bg-white space-y-4">
              <div>
                <label className="block text-sm font-medium">Motivo de consulta</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.consultationReason || 'No especificado'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Historia del problema (duración, evolución, frecuencia)</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.problemHistory || 'No especificada'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Expectativas del paciente respecto a la terapia</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.therapyExpectations || 'No especificadas'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Examen Mental</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.mentalExam || 'No especificado'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Evaluación psicológica (estado de ánimo, niveles de ansiedad y estrés, habilidades de afrontamiento, funcionamiento cognitivo, emocional, conductual y social)</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.psychologicalAssessment || 'No especificada'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">IDX O DX (DSM5-CIE 10)</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.diagnosis || 'No especificado'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Objetivos terapéuticos</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.therapeuticGoals || 'No especificados'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Plan Terapéutico</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.treatmentPlan || 'No especificado'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Derivación Y/O Remisión</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.referralInfo || 'No especificada'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Recomendaciones</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.recommendations || 'No especificadas'}
                </p>
              </div>
            </div>
          </div>

          {/* Sección de evolución */}
          {record.evolution && (
            <div className="border border-[#e0e7ff] rounded-xl overflow-hidden">
              <div className="bg-[#19334c] p-4">
                <h3 className="font-semibold text-lg text-white">Evolución</h3>
              </div>
              <div className="p-4 bg-white">
                <p className="text-sm text-gray-900 whitespace-pre-line">
                  {record.evolution}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#19334c] text-white font-medium rounded-lg hover:bg-[#c77914] transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Componente para PDF - Diseño exacto como el documento */}
      <div 
        ref={printableRef} 
        className="absolute top-[10000px] left-0 w-[210mm] bg-white p-8 font-sans text-sm"
      >
        <div className="w-full max-w-4xl mx-auto">
          {/* Encabezado */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold uppercase tracking-wide">HISTORIA CLÍNICA PSICOLÓGICA</h1>
            <p className="text-lg mt-1">Historia Clínica N° {record.recordNumber || '__________'}</p>
          </div>

          {/* Información Personal */}
          <div className="mb-4">
            <h2 className="font-bold text-lg border-b border-black mb-3 pb-1">INFORMACIÓN PERSONAL</h2>
            
            <div className="space-y-3">
              {renderField("Nombre paciente", record.patientName)}
              
              <div className="mb-3">
                <div className="font-medium mb-1">Tipo de identificación:</div>
                <div className="flex flex-wrap">
                  {renderIdentificationType("RC")}
                  {renderIdentificationType("Tl")}
                  {renderIdentificationType("CC")}
                  {renderIdentificationType("Otro")}
                </div>
                <div className="flex mt-1">
                  <div className="w-1/2 pr-2">
                    {renderField("N°", record.identificationNumber)}
                  </div>
                  <div className="w-1/2 pl-2">
                    {renderField("Edad", record.age?.toString())}
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <div className="w-1/2 pr-2">
                  {renderField("Fecha de nacimiento", formatDate(record.birthDate))}
                </div>
                <div className="w-1/2 pl-2">
                  {renderField("Escolaridad", record.educationLevel)}
                </div>
              </div>
              
              {renderField("Ocupación", record.occupation)}
              
              <div className="flex">
                <div className="w-1/2 pr-2">
                  {renderField("Lugar de nacimiento", record.birthPlace)}
                </div>
                <div className="w-1/2 pl-2">
                  {renderField("Nacionalidad", record.nationality)}
                </div>
              </div>
              
              <div className="flex">
                <div className="w-1/2 pr-2">
                  {renderField("Religión", record.religion)}
                </div>
                <div className="w-1/2 pl-2">
                  {renderField("Dirección de Residencia", record.address)}
                </div>
              </div>
              
              <div className="flex">
                <div className="w-1/3 pr-2">
                  {renderField("Barrio", record.neighborhood)}
                </div>
                <div className="w-1/3 px-2">
                  {renderField("Ciudad", record.city)}
                </div>
                <div className="w-1/3 pl-2">
                  {renderField("Departamento", record.state)}
                </div>
              </div>
              
              <div className="flex">
                <div className="w-1/4 pr-2">
                  {renderField("Fecha ingreso", formatDate(record.admissionDate))}
                </div>
                <div className="w-1/4 px-2">
                  {renderField("Celular", record.cellPhone)}
                </div>
                <div className="w-1/4 px-2">
                  {renderField("Teléfono", record.phone)}
                </div>
                <div className="w-1/4 pl-2">
                  {renderField("E- mail", record.email)}
                </div>
              </div>
              
              <div>
                {renderField("EPS", record.eps)}
                <div className="font-medium mb-1">Estado EPS:</div>
                <div className="flex">
                  {renderEPSStatus("Cotizante")}
                  {renderEPSStatus("Beneficiario")}
                </div>
              </div>
              
              {renderField("Remitido por", record.referredBy)}
            </div>
          </div>

          {/* Responsables */}
          <div className="mb-4">
            <h2 className="font-bold text-lg border-b border-black mb-3 pb-1">RESPONSABLES</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                {renderField("Responsable", record.guardian1Name)}
                {renderField("Parentesco", record.guardian1Relationship)}
                {renderField("Celular", record.guardian1Phone)}
                {renderField("Ocupación", record.guardian1Occupation)}
              </div>
              
              <div>
                {renderField("Responsable", record.guardian2Name)}
                {renderField("Parentesco", record.guardian2Relationship)}
                {renderField("Celular", record.guardian2Phone)}
                {renderField("Ocupación", record.guardian2Occupation)}
              </div>
            </div>
          </div>

          {/* Profesional */}
          <div className="mb-4">
            <h2 className="font-bold text-lg border-b border-black mb-3 pb-1">PROFESIONAL</h2>
            
            <div className="flex">
              <div className="w-1/2 pr-2">
                {renderField("Atendido por", record.attendedBy)}
              </div>
              <div className="w-1/2 pl-2">
                {renderField("Tarjeta profesional N°", record.licenseNumber)}
              </div>
            </div>
          </div>

          {/* Información Médico-Psicológica */}
          <div className="mb-4">
            <h2 className="font-bold text-lg border-b border-black mb-3 pb-1">INFORMACIÓN MÉDICO-PSICOLÓGICA</h2>
            
            <div className="mb-4">
              <h3 className="font-bold mb-2">Antecedentes personales</h3>
              <div className="ml-3">
                {renderField("Patológicos", record.personalPathological)}
                {renderField("Quirúrgicos", record.personalSurgical)}
                {renderField("Psicopatológicos", record.personalPsychopathological)}
                {renderMultilineField("Historia de trauma o abuso", record.traumaHistory, 3)}
                {renderField("Estado del Sueño", record.sleepStatus)}
                {renderField("Consumo de sustancias psicoactivas", record.substanceUse)}
                {renderField("Otros", record.personalOther)}
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-bold mb-2">Antecedentes Familiares</h3>
              <div className="ml-3">
                {renderField("Patológicos", record.familyPathological)}
                {renderField("Quirúrgicos", record.familySurgical)}
                {renderField("Psicopatológicos", record.familyPsychopathological)}
                {renderField("Traumáticos", record.familyTraumatic)}
                {renderField("Consumo de sustancias psicoactivas", record.familySubstanceUse)}
                {renderField("Otros", record.familyOther)}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-2">Desarrollo</h3>
              <div className="ml-3">
                {renderField("Embarazo", record.pregnancyInfo)}
                {renderField("Parto", record.deliveryInfo)}
                {renderField("Desarrollo psicomotor (sentarse, caminar, hablar, control de esfínteres)", record.psychomotorDevelopment)}
                {renderField("Descripción de la dinámica familiar", record.familyDynamics)}
              </div>
            </div>
          </div>

          {/* Información Clínica */}
          <div className="mb-4">
            <h2 className="font-bold text-lg border-b border-black mb-3 pb-1">INFORMACIÓN CLÍNICA</h2>
            
            <div className="space-y-3">
              {renderField("Motivo de consulta", record.consultationReason)}
              {renderMultilineField("Historia del problema (duración, evolución, frecuencia)", record.problemHistory, 3)}
              {renderMultilineField("Expectativas del paciente respecto a la terapia", record.therapyExpectations, 2)}
              {renderMultilineField("Examen Mental", record.mentalExam, 3)}
              {renderMultilineField("Evaluación psicológica (estado de ánimo, niveles de ansiedad y estrés, habilidades de afrontamiento, funcionamiento cognitivo, emocional, conductual y social)", record.psychologicalAssessment, 4)}
              {renderMultilineField("IDX O DX (DSMS-CIE 10)", record.diagnosis, 2)}
              {renderMultilineField("Objetivos terapéuticos", record.therapeuticGoals, 2)}
              {renderMultilineField("Plan Terapéutico", record.treatmentPlan, 2)}
              {renderMultilineField("Derivación Y/O Remisión", record.referralInfo, 2)}
              {renderMultilineField("Recomendaciones", record.recommendations, 2)}
            </div>
          </div>

          {/* Evolución */}
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <div className="w-1/2 pr-2">
                {renderField("Nombre", record.patientName)}
              </div>
              <div className="w-1/2 pl-2">
                {renderField("Historia N°", record.recordNumber)}
              </div>
            </div>
            <h2 className="font-bold text-lg border-b border-black mb-3 pb-1">EVOLUCIÓN</h2>
            <div className="border border-gray-400 p-3 min-h-[150px]">
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
          <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs">
            <p>322 8555 682 @mentotmentep MentalMente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordDetailsModal;