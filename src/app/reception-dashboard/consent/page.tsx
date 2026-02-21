'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  FaFileSignature,
  FaSearch,
  FaEye,
  FaTimes,
} from 'react-icons/fa'; // Eliminamos FaDownload porque no se usa

interface ConsentRecord {
  id: number;
  signedByName: string;
  signedByDocument: string;
  documentSnapshot: string;
  signatureBase64: string | null;
  signedAt: string;
  medicalRecord: {
    id: number;
    patientName: string;
    identificationNumber: string;
    recordNumber: string;
  };
  template: {
    title: string;
    version: string;
  };
}

const ConsentsPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConsent, setSelectedConsent] = useState<ConsentRecord | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    fetchConsents();
  }, []);

  const fetchConsents = async () => {
    setIsLoading(true);
    try {
      // CORREGIDO: usar plural /api/consents
      const response = await fetch('/api/consents');
      if (!response.ok) throw new Error('Error al cargar consentimientos');
      const data = await response.json();
      setConsents(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredConsents = consents.filter(
    (c) =>
      c.medicalRecord.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.signedByName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.signedByDocument.includes(searchTerm)
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(',', '');
  };

  const handleView = (consent: ConsentRecord) => {
    setSelectedConsent(consent);
    setShowModal(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bec5a4]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2f2f2] to-[#e8e8e8] p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#2c3e50] tracking-tight">
              Consentimientos Informados
            </h1>
            <p className="text-[#7f8c8d] mt-2 max-w-2xl">
              Visualice y gestione todos los consentimientos firmados por los pacientes.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="bg-white rounded-2xl px-6 py-3 shadow-sm border border-[#bec5a4]/20">
              <div className="text-xs uppercase tracking-wider text-[#7f8c8d]">Total</div>
              <div className="text-3xl font-light text-[#2c3e50]">{consents.length}</div>
            </div>
          </div>
        </div>

        {/* Buscador */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#bec5a4]/20 p-6 mb-8">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#bec5a4]" />
            <input
              type="text"
              placeholder="Buscar por paciente, firmante o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#f9f9f9] border border-gray-200 rounded-xl focus:border-[#bec5a4] focus:ring-2 focus:ring-[#bec5a4]/20 outline-none transition-all text-[#2c3e50] placeholder-[#95a5a6]"
            />
          </div>
        </div>

        {/* Tabla de consentimientos */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#bec5a4]"></div>
          </div>
        ) : filteredConsents.length === 0 ? (
          <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50">
            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
              <FaFileSignature size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No hay consentimientos</h3>
            <p className="text-gray-500 mb-6">Aún no se han registrado consentimientos informados.</p>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Paciente</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Firmado por</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Documento</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Fecha</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredConsents.map((consent) => (
                  <tr key={consent.id} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#bec5a4]/20 to-[#aab38c]/20 flex items-center justify-center">
                          <FaFileSignature className="text-[#bec5a4]" size={14} />
                        </div>
                        <span className="font-medium text-gray-800">{consent.medicalRecord.patientName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{consent.signedByName}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{consent.signedByDocument}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{formatDate(consent.signedAt)}</td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(consent)}
                          className="p-1.5 text-gray-500 hover:text-[#bec5a4] transition-colors"
                          title="Ver detalles"
                        >
                          <FaEye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de detalle */}
        {showModal && selectedConsent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-serif text-[#2c3e50]">Detalle del Consentimiento</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FaTimes className="text-gray-600" size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-[#95a5a6] uppercase mb-1">Paciente</p>
                    <p className="text-lg text-[#2c3e50] font-medium">{selectedConsent.medicalRecord.patientName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#95a5a6] uppercase mb-1">Identificación</p>
                    <p className="text-lg text-[#2c3e50]">{selectedConsent.medicalRecord.identificationNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#95a5a6] uppercase mb-1">Firmado por</p>
                    <p className="text-lg text-[#2c3e50]">{selectedConsent.signedByName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#95a5a6] uppercase mb-1">Documento</p>
                    <p className="text-lg text-[#2c3e50]">{selectedConsent.signedByDocument}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#95a5a6] uppercase mb-1">Fecha firma</p>
                    <p className="text-lg text-[#2c3e50]">{formatDate(selectedConsent.signedAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#95a5a6] uppercase mb-1">Plantilla</p>
                    <p className="text-lg text-[#2c3e50]">{selectedConsent.template.title}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[#95a5a6] uppercase mb-2">Documento firmado</p>
                  <div
                    className="bg-[#f9f9f9] p-6 rounded-xl border border-gray-200 text-[#2c3e50]"
                    dangerouslySetInnerHTML={{ __html: selectedConsent.documentSnapshot }}
                  />
                </div>

                {selectedConsent.signatureBase64 && (
                  <div>
                    <p className="text-xs text-[#95a5a6] uppercase mb-2">Firma del paciente</p>
                    {/* La firma en base64 es una imagen pequeña; no afecta LCP significativamente */}
                    <Image
                      src={selectedConsent.signatureBase64}
                      alt="Firma"
                      width={200}
                      height={80}
                      className="max-h-32 border border-gray-200 rounded-lg p-2 bg-white object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsentsPage;