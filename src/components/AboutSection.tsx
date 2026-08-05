'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, Heart } from 'lucide-react';
import Image from 'next/image';

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
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
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f8fafc] to-white" />
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-[#bec5a4]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-[#bec5a4]/3 rounded-full blur-3xl" />

      <div className="relative container mx-auto max-w-6xl">
        <motion.div
          style={{ y }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          <div className="relative">
            <div className="relative group">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#bec5a4]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src="/fondo-bg.jpeg"
                    alt="Liyiveth Quintero García - Psicóloga especialista en Ansiedad Relacional"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
                  <div className="space-y-3">
                    <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#bec5a4] to-transparent" />
                    {/* <p className="text-sm text-white font-light tracking-wider">
                      ANSIEDAD RELACIONAL Y MANEJO DEL ESTRÉS
                    </p> */}
                  </div>
                </div>

                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-[#bec5a4]" />
                    <span className="text-xs font-light text-gray-700">Psicóloga Certificada</span>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg border border-gray-100 max-w-xs"
            >
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <Heart className="w-5 h-5 text-[#bec5a4]" />
                </div>
                <div>
                  <h4 className="text-sm font-light text-gray-900 mb-1">Acompañamiento con empatía</h4>
                  <p className="text-xs text-gray-600 font-light">
                    Transformar el caos en calma, con ciencia y diálogo terapéutico
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-px w-12 bg-gradient-to-r from-[#bec5a4] to-transparent" />
                <span className="text-sm tracking-widest font-light text-[#bec5a4] uppercase">
                  Sobre Mí
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-light tracking-tight text-gray-900">
                ¡Hola! Soy Liyiveth <span className="text-[#bec5a4]">☺️</span>
              </h2>

              <div className="h-px w-full bg-gradient-to-r from-[#bec5a4]/30 via-gray-300/50 to-transparent" />
            </div>

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
                <span className="text-sm font-light text-gray-700">Terapia Virtual y Domiciliaria</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-[#bec5a4]/10 border border-[#bec5a4]/20">
                <span className="text-sm font-light text-gray-700">Quibdó - Chocó</span>
              </div>
            </motion.div>

            <div className="space-y-6">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-gray-700 font-light leading-relaxed"
              >
                Hola, soy Liyiveth Quintero García, psicóloga. Elegí esta profesión porque creo en el valor de la escucha, el respeto y la capacidad que tienen las personas para desarrollar recursos que les permitan afrontar las dificultades de la vida.
              </motion.p>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-lg text-gray-700 font-light leading-relaxed"
              >
                A través de SanaTú quiero ofrecerte un espacio donde puedas hablar con tranquilidad sobre aquello que estás viviendo, recibir orientación profesional y adquirir herramientas que favorezcan tu bienestar emocional. Mi forma de trabajar se basa en la empatía, el respeto, la confidencialidad y el compromiso con cada persona que deposita su confianza en mí.
              </motion.p>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.38 }}
                className="text-lg text-gray-700 font-light leading-relaxed"
              >
                Creo que una orientación oportuna puede brindar claridad, fortalecer la toma de decisiones y contribuir al desarrollo de habilidades para afrontar los desafíos cotidianos. Cada persona tiene una historia diferente y merece ser escuchada sin prejuicios. Por eso procuro que cada encuentro sea un espacio seguro, humano y respetuoso.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative p-6 rounded-xl bg-gradient-to-br from-white to-gray-50/50 border border-gray-100 shadow-sm"
              >
                <div className="absolute -top-3 left-8 px-3 py-1 bg-[#bec5a4] rounded-full">
                  <span className="text-xs font-light text-white uppercase">Mi enfoque profesional</span>
                </div>
                <p className="text-gray-700 font-light leading-relaxed mt-2">
                  Está orientado a brindar orientación psicológica, psicoeducación y Primeros Auxilios Psicológicos, promoviendo el bienestar emocional mediante herramientas prácticas para afrontar los desafíos de la vida cotidiana.
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-light text-gray-900 mt-8 mb-4">Mi compromiso contigo</h3>
                <p className="text-gray-700 font-light">Cuando solicitas una orientación conmigo puedes esperar:</p>
                <ul className="space-y-2 text-gray-700 font-light">
                  <li className="flex items-start">
                    <span className="text-[#bec5a4] mr-2">✔</span> Un espacio donde serás escuchado(a) con respeto.
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#bec5a4] mr-2">✔</span> Una atención ética y confidencial.
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#bec5a4] mr-2">✔</span> Información clara y comprensible.
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#bec5a4] mr-2">✔</span> Herramientas prácticas para afrontar la situación que estás viviendo.
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#bec5a4] mr-2">✔</span> Un acompañamiento profesional centrado en tus necesidades.
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-light text-gray-900 mt-8 mb-4">¿Por qué elegir SanaTú?</h3>
                <p className="text-gray-700 font-light leading-relaxed">
                  Porque encontrarás una atención basada en la cercanía, el respeto y la escucha profesional.
                  Mi propósito no es juzgarte ni decirte cómo debes vivir tu vida. Quiero ayudarte a comprender mejor lo que estás viviendo, identificar recursos personales y encontrar estrategias que favorezcan tu bienestar emocional. Cada orientación está enfocada en brindarte herramientas útiles que puedas aplicar en tu vida cotidiana.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="hidden lg:block absolute left-0 top-1/2 transform -translate-y-1/2">
          <div className="flex items-center space-x-4 -rotate-90">
            <span className="text-xs tracking-widest font-light text-gray-400">SOBRE MÍ</span>
            <div className="h-px w-16 bg-gradient-to-r from-[#bec5a4] to-transparent" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-8">
          <a
            href="#servicios"
            className="text-xs tracking-widest font-light text-gray-400 hover:text-[#bec5a4] transition-colors duration-300"
          >
            Servicios
          </a>
          <div className="h-px w-8 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          <a
            href="#contacto"
            className="text-xs tracking-widest font-light text-gray-400 hover:text-[#bec5a4] transition-colors duration-300"
          >
            Contacto
          </a>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
