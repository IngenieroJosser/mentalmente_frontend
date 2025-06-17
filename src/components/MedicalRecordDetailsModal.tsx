'use client';
import React from 'react';
import { MedicalRecord } from '@prisma/client';
import { format } from 'date-fns';
import { FaTimes } from 'react-icons/fa';

interface MedicalRecordDetailsModalProps {
  record: MedicalRecord;
  onClose: () => void;
}

const MedicalRecordDetailsModal: React.FC<MedicalRecordDetailsModalProps> = ({ record, onClose }) => {
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
          <button 
            aria-label='Detalles de la historia clinica'
            onClick={onClose}
            className="hover:text-[#c77914] transition-colors"
          >
            <FaTimes size={24} />
          </button>
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
                <label className="block text-sm font-medium">EPS</label>
                <p className="mt-1 text-sm text-gray-900">{record.eps || 'No especificada'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Fecha de ingreso</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(record.admissionDate)}</p>
              </div>
            </div>
          </div>

          {/* Sección de antecedentes */}
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
            </div>
          </div>

          {/* Sección de diagnóstico */}
          <div className="border border-[#e0e7ff] rounded-xl overflow-hidden">
            <div className="bg-[#19334c] p-4">
              <h3 className="font-semibold text-lg text-white">Diagnóstico y Tratamiento</h3>
            </div>
            <div className="p-4 bg-white space-y-4">
              <div>
                <label className="block text-sm font-medium">Diagnóstico</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.diagnosis || 'No especificado'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium">Plan de tratamiento</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {record.treatmentPlan || 'No especificado'}
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
    </div>
  );
};

export default MedicalRecordDetailsModal;