'use client';

import React, { useRef } from 'react';
import { format } from 'date-fns';
import { FaTimes, FaPrint } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import PrintableHistory from './PrintableHistory';
import { MedicalRecordDetailsModalProps } from '@/lib/type';

const MedicalRecordDetailsModal: React.FC<MedicalRecordDetailsModalProps> = ({ 
  record, 
  onClose 
}) => {
  const printableRef = useRef<HTMLDivElement>(null);

  const handlePrintMedicalRecord = useReactToPrint({
    content: () => printableRef.current,
    documentTitle: `Historia_Clinica_${record.recordNumber}`,
    onBeforeGetContent: () => {
      if (printableRef.current) {
        printableRef.current.classList.remove('hidden');
      }
      return Promise.resolve();
    },
    onAfterPrint: () => {
      if (printableRef.current) {
        printableRef.current.classList.add('hidden');
      }
    }
  } as any);

  const formatDate = (date: Date | null) => {
    if (!date) return 'No especificada';
    return format(new Date(date), 'dd/MM/yyyy');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-[#19334c]">
            Detalles de Historia Clínica
          </h2>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handlePrintMedicalRecord}
              className="p-2 bg-[#19334c] text-white rounded-lg hover:bg-[#c77914] transition-colors"
              aria-label="Imprimir historia clínica"
            >
              <FaPrint size={20} />
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

        {/* Componente para impresión (oculto) */}
        <div className="hidden">
         <div 
          ref={printableRef} 
          className="absolute left-full top-0 hidden"
        >
          <PrintableHistory record={record} />
        </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordDetailsModal;