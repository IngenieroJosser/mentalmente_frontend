'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, Target } from 'lucide-react';
import Image from 'next/image';

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0]);

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity }}
      id="sobre-mi"
      className="relative min-h-screen py-24 px-6 lg:px-8 overflow-hidden"
    >
      {/* Fondo con efecto de gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f8fafc] to-white" />

      {/* Elementos decorativos de fondo */}
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-[#bec5a4]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-[#bec5a4]/3 rounded-full blur-3xl" />

      <div className="relative container mx-auto max-w-6xl">
        <motion.div
          style={{ y }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Columna izquierda: Imagen y elementos visuales */}
          <div className="relative">
            {/* Contenedor de la imagen con diseño de tarjeta */}
            <div className="relative group">
              {/* Marco decorativo */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#bec5a4]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Contenedor principal de la imagen */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                {/* Imagen de perfil optimizada */}
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src="/logo-liyi.jpeg"
                    alt="Liyiveth Quintero García - Psicóloga especialista en bienestar emocional"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />

                  {/* Overlay sutil para mejor contraste */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                </div>

                {/* Texto superpuesto */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
                  <div className="space-y-3">
                    <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#bec5a4] to-transparent" />
                    <p className="text-sm text-white font-light tracking-wider">
                      ESPECIALISTA EN BIENESTAR EMOCIONAL
                    </p>
                  </div>
                </div>

                {/* Sello de credibilidad */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-[#bec5a4]" />
                    <span className="text-xs font-light text-gray-700">Psicóloga Certificada</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Elementos flotantes informativos */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg border border-gray-100 max-w-xs"
            >
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <Target className="w-5 h-5 text-[#bec5a4]" />
                </div>
                <div>
                  <h4 className="text-sm font-light text-gray-900 mb-1">Enfoque Integral</h4>
                  <p className="text-xs text-gray-600 font-light">
                    Sanar es volverte habitable y seguro para ti mismo
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Columna derecha: Contenido textual */}
          <div className="space-y-8">
            {/* Encabezado de sección */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-px w-12 bg-gradient-to-r from-[#bec5a4] to-transparent" />
                <span className="text-sm tracking-widest font-light text-[#bec5a4] uppercase">
                  Perfil Profesional
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-light tracking-tight text-gray-900">
                Psic. Liyiveth <span className="text-[#bec5a4]">Quintero García</span>
              </h2>

              <div className="h-px w-full bg-gradient-to-r from-[#bec5a4]/30 via-gray-300/50 to-transparent" />
            </div>

            {/* Credenciales destacadas */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <div className="px-4 py-2 rounded-full bg-[#bec5a4]/10 border border-[#bec5a4]/20">
                <span className="text-sm font-light text-gray-700">Psicóloga</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-[#bec5a4]/10 border border-[#bec5a4]/20">
                <span className="text-sm font-light text-gray-700">Atención Psicológica Online y Presencial.</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-[#bec5a4]/10 border border-[#bec5a4]/20">
                <span className="text-sm font-light text-gray-700">Quibidó</span>
              </div>
            </motion.div>

            {/* Descripción profesional */}
            <div className="space-y-6">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-gray-700 font-light leading-relaxed"
              >
                Brindo un espacio seguro y profesional para el cuidado de tu salud mental. Si te encuentras en Quibdó, podemos coordinar sesiones presenciales; si estás en cualquier otra parte del mundo, mi servicio de psicología virtual está diseñado para ofrecerte la misma calidad y calidez desde la comodidad de tu hogar.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative p-6 rounded-xl bg-gradient-to-br from-white to-gray-50/50 border border-gray-100 shadow-sm"
              >
                <div className="absolute -top-3 left-8 px-3 py-1 bg-[#bec5a4] rounded-full">
                  <span className="text-xs font-light text-white">Propósito</span>
                </div>
                <p className="text-gray-700 font-light leading-relaxed italic">
                  Transformar la frustración y la sensación de incompetencia  en competencia real. No busco calmar síntomas; busco que recuperes el dominio de tu vida y que  aprendas a gestionar el vacío de la era digital y construyas una seguridad interna que no dependa de los resultados inmediatos ni de la aprobación externa.
                </p>
              </motion.div>
            </div>

            {/* Llamada a la acción sutil */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-8"
            >
              <a
                className="inline-flex items-center group text-[#4e2418] font-bold tracking-wide"
              >
                <span className="border-b border-transparent group-hover:border-[#e4f4ae] transition-all duration-300">
                  ¿Sientes que te esfuerzas al máximo, pero nada es suficiente? Te ayudo a vencer la sensación de incompetencia, gestionar la frustración y recuperar el control frente a las pantallas. <br />
                  {/* <br /> */}
                  Psicóloga con experticia en el tratamiento de la frustración y adicciones no sustanciales (redes sociales y juegos).
                </span>
                <svg
                  className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Indicador de sección (para desktop) */}
        <div className="hidden lg:block absolute left-0 top-1/2 transform -translate-y-1/2">
          <div className="flex items-center space-x-4 -rotate-90">
            <span className="text-xs tracking-widest font-light text-gray-400">SOBRE MÍ</span>
            <div className="h-px w-16 bg-gradient-to-r from-[#bec5a4] to-transparent" />
          </div>
        </div>
      </div>

      {/* Navegación entre secciones */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-8">
          <a
            href="#inicio"
            className="text-xs tracking-widest font-light text-gray-400 hover:text-[#bec5a4] transition-colors duration-300"
          >
            Inicio
          </a>
          <div className="h-px w-8 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          <a
            href="#servicios"
            className="text-xs tracking-widest font-light text-gray-400 hover:text-[#bec5a4] transition-colors duration-300"
          >
            Servicios
          </a>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;