'use client';

import React, { useRef, useState } from 'react';
import { FaCheck, FaTimes, FaPen } from 'react-icons/fa';

interface InformedConsentProps {
  medicalRecordId?: number; // Si ya existe la historia, pasamos el ID
  patientName: string;
  patientDocument: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const InformedConsent: React.FC<InformedConsentProps> = ({
  medicalRecordId,
  patientName,
  patientDocument,
  onSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setSignature(dataUrl);
  };

  const handleSubmit = async () => {
    if (!signature) {
      alert('Por favor, firme el documento');
      return;
    }
    if (!medicalRecordId) {
      alert('No se ha asociado a una historia clínica');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicalRecordId,
          signedByName: patientName,
          signedByDocument: patientDocument,
          signatureBase64: signature,
        }),
      });
      if (!response.ok) {
        throw new Error('Error al guardar el consentimiento');
      }
      alert('Consentimiento guardado exitosamente');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      alert('Error al guardar el consentimiento');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#bec5a4] to-[#a0a78c] bg-clip-text text-transparent">
            Consentimiento Informado
          </h2>
          <button onClick={onCancel} className="p-2 rounded-full hover:bg-gray-100">
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Texto del consentimiento con datos del paciente */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-center font-bold text-lg mb-4">SANATÚ SAS – CONSENTIMIENTO INFORMADO</h3>
            <p><strong>FECHA:</strong> ____ / ____ / 20____</p>
            <p><strong>CIUDAD:</strong> Quibdó, Chocó</p>
            <p>
              Yo, <strong>{patientName}</strong>, mayor de edad, identificado(a) con la cédula número{' '}
              <strong>{patientDocument}</strong>, por medio de este documento declaro que acepto de manera voluntaria
              recibir atención psicológica por parte de SANATÚ SAS (NIT 902010331-8).
            </p>
            <p>Entiendo y acepto que:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Privacidad:</strong> Todo lo que hablemos es confidencial (secreto profesional). Nadie más sabrá lo que se diga en consulta, a menos que mi vida o la de alguien más esté en peligro grave, según lo manda la ley colombiana.
              </li>
              <li>
                <strong>Voluntad:</strong> Puedo hacer las preguntas que quiera sobre mi proceso y puedo decidir no continuar con la terapia en el momento que lo desee.
              </li>
              <li>
                <strong>Trato Digno:</strong> Recibiré una atención respetuosa, profesional y enfocada en mi bienestar.
              </li>
              <li>
                <strong>Uso de Datos:</strong> Autorizo a SANATÚ SAS para usar mis datos básicos (nombre, teléfono) únicamente para contacto de citas y registro médico, cumpliendo con la ley de protección de datos.
              </li>
            </ol>
            <p className="mt-4">Al firmar, confirmo que he leído (o me han leído) y comprendido este documento y que estoy de acuerdo con lo aquí escrito.</p>
          </div>

          {/* Firma del paciente */}
          <div>
            <label className="block text-sm font-medium mb-2">Firma del paciente / consultante</label>
            <div className="border border-gray-300 rounded-xl p-2 bg-white">
              <canvas
                ref={canvasRef}
                width={500}
                height={200}
                className="w-full h-40 border border-gray-200 rounded-lg cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                onTouchCancel={stopDrawing}
              />
            </div>
            <div className="flex justify-between mt-2">
              <button
                type="button"
                onClick={clearSignature}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
              >
                <FaTimes className="mr-1" /> Limpiar
              </button>
              <button
                type="button"
                onClick={saveSignature}
                className="text-sm bg-[#bec5a4] text-white px-3 py-1 rounded-lg hover:bg-[#a0a78c] flex items-center"
              >
                <FaCheck className="mr-1" /> Guardar firma
              </button>
            </div>
            {signature && (
              <p className="text-sm text-green-600 mt-2">✓ Firma guardada</p>
            )}
          </div>

          {/* Firma del profesional (se puede agregar después) */}
          <div className="border-t pt-4">
            <p className="text-center text-gray-600">
              _____________________________________
            </p>
            <p className="text-center text-sm">Firma del Profesional (SANATÚ SAS)</p>
            <p className="text-center text-sm">Psicóloga – T.P. No. 229742</p>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-[#bec5a4] to-[#a0a78c] text-white rounded-xl hover:from-[#a0a78c] hover:to-[#8a9379] disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Aceptar y Firmar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformedConsent;