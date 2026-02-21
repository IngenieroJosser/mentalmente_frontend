'use client';

import { motion } from 'framer-motion';
import {
  MessageCircle,
  Phone,
  Mail,
  ChevronRight,
  CheckCircle,
  Shield
} from 'lucide-react';

const CallToActionSection = () => {
  const WHATSAPP_NUMBER = '3113266223';

  const WHATSAPP_MESSAGE = encodeURIComponent(
    '¡Hola, Liyiveth! Vengo de tu página SanaTú. Me sentí identificado/a con lo que haces y me gustaría que me acompañaras en mi proceso. ¿Cómo puedo agendar una cita contigo?'
  );

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`, '_blank');
  };

  let services = [
    "Consulta inicial - Psicoterapia Individual",
    "Intervención Psicosocial - Apoyo Especializado",
    "Educación y Bienestar - Talleres/Capacitaciones"
  ];

  return (
    <>
      <section
        id="contacto"
        className="relative min-h-screen py-32 px-6 lg:px-8 bg-white"
      >
        {/* Fondo sutil */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-[#bec5a4]/5 rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-[#bec5a4]/3 rounded-full" />
        </div>

        <div className="relative container mx-auto max-w-5xl">
          {/* Encabezado minimalista */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <div className="inline-block mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-4" />
              <span className="text-xs tracking-widest font-light text-gray-500 uppercase">
                Contacto
              </span>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-4" />
            </div>

            <h2 className="text-5xl lg:text-6xl font-light text-gray-900 mb-8 leading-tight">
              Comienza tu<br />
              <span className="text-[#bec5a4]">transformación</span>
            </h2>

            <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
              Escríbeme directamente por WhatsApp y empecemos tu proceso
            </p>
          </motion.div>

          {/* Contenido principal - una sola columna centrada o dos columnas? 
              Decido mantener dos columnas para mantener la estructura visual,
              pero la segunda columna ahora solo tiene el contenido de WhatsApp */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Panel izquierdo - Información esencial */}
            <div className="space-y-12">
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg border border-gray-200 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-[#bec5a4]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-light text-gray-900 mb-2">
                      WhatsApp Directo
                    </h3>
                    <p className="text-gray-600 font-light">
                      Respuesta inmediata
                    </p>
                  </div>
                </div>

                <div className="pl-16">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-[#bec5a4]" />
                      <span className="text-gray-700 font-light">
                        Mensaje preparado incluido
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-[#bec5a4]" />
                      <span className="text-gray-700 font-light">
                        Cifrado de extremo a extremo
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-[#bec5a4]" />
                      <span className="text-gray-700 font-light">
                        Agenda disponible en tiempo real
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#bec5a4]" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-light">Correo electrónico</p>
                      <p className="text-gray-600 text-sm font-light">hola@sanatuquingar.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Shield className="w-10 h-10 text-gray-400" />
                    <p className="text-gray-600 font-light text-sm">
                      Confidencialidad garantizada por estándares profesionales
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel derecho - Solo WhatsApp */}
            <div>
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="h-full flex flex-col"
              >
                <div className="bg-gradient-to-b from-white to-gray-50/30 border border-gray-200 rounded-2xl p-8 h-full">
                  <div className="mb-8">
                    <h4 className="text-lg font-light text-gray-900 mb-4">
                      Mensaje preparado:
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                      <p className="text-gray-600 font-light italic">
                        &quot;Hola SanaTú Quingar, vi tu página y me gustaría recibir información de tus servicios&quot;
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <motion.button
                      onClick={handleWhatsAppClick}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-[#bec5a4] text-white rounded-xl font-light tracking-wide 
                               hover:bg-[#a0a78c] transition-colors duration-300 flex items-center 
                               justify-center space-x-3"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Iniciar proceso por WhatsApp</span>
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>

                    <p className="text-center text-gray-500 text-sm font-light mt-4">
                      Número: {WHATSAPP_NUMBER}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Separador sutil */}
          <div className="mt-24 pt-16 border-t border-gray-100">
            <div className="text-center">
              <p className="text-sm text-gray-500 font-light mb-2">
                &quot;Sanar es volverte habitable y seguro para ti mismo&quot;
              </p>
              <p className="text-gray-900 font-light">
                — Liyiveth Quintero García
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Botón flotante minimalista */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        onClick={handleWhatsAppClick}
        className="fixed bottom-8 right-8 z-50"
      >
        <div className="relative">
          <div className="w-14 h-14 bg-[#bec5a4] rounded-full shadow-lg hover:shadow-xl 
                       transition-shadow duration-300 flex items-center justify-center 
                       hover:scale-110 transition-transform duration-300">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>

          <div className="absolute -top-10 right-0 bg-white px-4 py-2 rounded-lg shadow-lg 
                       border border-gray-200">
            <span className="text-sm font-light text-gray-700 whitespace-nowrap">
              Iniciar proceso
            </span>
            <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 
                         w-2 h-2 bg-white border-r border-b border-gray-200" />
          </div>
        </div>
      </motion.button>
    </>
  );
};

export default CallToActionSection;