'use client';

import React, { useRef, useState } from 'react';
import { FaCheck, FaTimes, FaDownload, FaUpload } from 'react-icons/fa';

type ConsentMethod = 'signature' | 'upload';

interface InformedConsentProps {
  medicalRecordId?: number;
  patientName?: string;
  patientDocument?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  onSubmit?: (data: {
    patientName: string;
    patientDocument: string;
    signatureBase64: string;
  }) => void;
  initialName?: string;
  initialDocument?: string;
}

const InformedConsent: React.FC<InformedConsentProps> = ({
  medicalRecordId,
  patientName: propPatientName,
  patientDocument: propPatientDocument,
  onSuccess,
  onCancel,
  onSubmit,
  initialName = '',
  initialDocument = '',
}) => {
  const [method, setMethod] = useState<ConsentMethod>('signature');
  const [localName, setLocalName] = useState(initialName);
  const [localDocument, setLocalDocument] = useState(initialDocument);
  const [signature, setSignature] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isExistingRecord = !!medicalRecordId;

  // Canvas drawing functions (same as before)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (method === 'signature') {
      if (!signature) {
        alert('Por favor, firme el documento');
        return;
      }
    } else {
      if (!file) {
        alert('Por favor, seleccione un archivo');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (isExistingRecord) {
        // Modo con ID: enviar a la API
        if (method === 'signature') {
          // Enviar como JSON
          const response = await fetch('/api/consent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              medicalRecordId,
              signedByName: propPatientName,
              signedByDocument: propPatientDocument,
              signatureBase64: signature,
            }),
          });
          if (!response.ok) throw new Error('Error al guardar el consentimiento');
        } else {
          // Enviar como multipart/form-data
          const formData = new FormData();
          formData.append('medicalRecordId', String(medicalRecordId));
          formData.append('signedByName', propPatientName || '');
          formData.append('signedByDocument', propPatientDocument || '');
          formData.append('file', file as Blob);

          const response = await fetch('/api/consent', {
            method: 'POST',
            body: formData,
          });
          if (!response.ok) throw new Error('Error al subir el archivo');
        }
        alert('Consentimiento guardado exitosamente');
        if (onSuccess) onSuccess();
      } else {
        // Modo sin ID: validar campos
        if (!localName.trim() || !localDocument.trim()) {
          alert('Debe ingresar nombre y documento del paciente');
          setIsSubmitting(false);
          return;
        }
        if (method === 'signature') {
          if (!signature) {
            alert('Debe firmar el documento');
            setIsSubmitting(false);
            return;
          }
          if (onSubmit) {
            onSubmit({
              patientName: localName,
              patientDocument: localDocument,
              signatureBase64: signature,
            });
          }
        } else {
          // Modo sin ID y con archivo: no implementado aún, pero podríamos subir el archivo también
          // Por ahora, simplemente mostramos alerta de que no está soportado
          alert('Modo sin ID con archivo no soportado en esta versión');
          setIsSubmitting(false);
          return;
        }
      }
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
          <div className="flex gap-2">
            <a
              href="/SANATÚ SAS – CONSENTIMIENTO INFORMADO (1).docx"
              download
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors"
              title="Descargar plantilla para diligenciar"
            >
              <FaDownload />
            </a>
            <button onClick={onCancel} className="p-2 rounded-full hover:bg-gray-100">
              <FaTimes className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Selector de método */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              method === 'signature'
                ? 'border-b-2 border-[#bec5a4] text-[#bec5a4]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setMethod('signature')}
          >
            Firma digital
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              method === 'upload'
                ? 'border-b-2 border-[#bec5a4] text-[#bec5a4]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setMethod('upload')}
          >
            Subir archivo firmado
          </button>
        </div>

        <div className="space-y-6">
          {/* Texto del consentimiento (siempre visible) */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-center font-bold text-lg mb-4">SANATÚ SAS – CONSENTIMIENTO INFORMADO</h3>
            <p><strong>FECHA:</strong> ____ / ____ / 20____</p>
            <p><strong>CIUDAD:</strong> Quibdó, Chocó</p>
            <p>
              Yo, <strong>{isExistingRecord ? propPatientName : localName || '____________________'}</strong>, mayor de edad, identificado(a) con la cédula número{' '}
              <strong>{isExistingRecord ? propPatientDocument : localDocument || '____________________'}</strong>, por medio de este documento declaro que acepto de manera voluntaria
              recibir atención psicológica por parte de SANATÚ SAS (NIT 902010331-8).
            </p>
            <p>Entiendo y acepto que:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>Privacidad:</strong> Todo lo que hablemos es confidencial...</li>
              <li><strong>Voluntad:</strong> Puedo hacer las preguntas que quiera...</li>
              <li><strong>Trato Digno:</strong> Recibiré una atención respetuosa...</li>
              <li><strong>Uso de Datos:</strong> Autorizo a SANATÚ SAS para usar mis datos básicos...</li>
            </ol>
            <p className="mt-4">Al firmar, confirmo que he leído (o me han leído) y comprendido este documento y que estoy de acuerdo con lo aquí escrito.</p>
          </div>

          {/* Campos de nombre y documento SOLO si no hay medicalRecordId */}
          {!isExistingRecord && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  Nombre del paciente <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={localName}
                  onChange={(e) => setLocalName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 bg-white text-gray-800"
                  placeholder="Ej. Juan Pérez"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  Documento de identidad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={localDocument}
                  onChange={(e) => setLocalDocument(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 bg-white text-gray-800"
                  placeholder="Ej. 123456789"
                  required
                />
              </div>
            </div>
          )}

          {/* Contenido según método */}
          {method === 'signature' ? (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800">
                Firma del paciente / consultante
              </label>
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
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800">
                Subir archivo del consentimiento firmado (PDF, imagen)
              </label>
              <div className="border border-gray-300 rounded-xl p-4 bg-white">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.docx"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#bec5a4] file:text-white hover:file:bg-[#a0a78c]"
                />
                {file && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ Archivo seleccionado: {file.name}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Firma del profesional (estática) */}
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