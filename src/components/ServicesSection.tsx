'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  Monitor,
  Home,
  BellOff,
  HeartCrack,
  Shield,
  Hand,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';

const WHATSAPP_NUMBER = '573113266223';
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hola Psic. Liyiveth, quiero iniciar mi terapia virtual o domiciliaria.'
);

const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.5]);
  const y = useTransform(scrollYProgress, [0, 0.5], [80, 0]);

  const services = [
    {
      id: 1,
      title: 'Psicoterapia Virtual',
      subtitle: 'Desde cualquier lugar',
      icon: <Monitor className="w-7 h-7" />,
      description:
        'Sesiones en línea con total privacidad y comodidad, sin importar en qué parte del mundo estés.',
      color: '#bec5a4',
      lightColor: 'rgba(190, 197, 164, 0.08)',
      accentIcon: <Monitor className="w-5 h-5" />,
    },
    {
      id: 2,
      title: 'Atención Domiciliaria',
      subtitle: 'Exclusivo Quibdó - Chocó',
      icon: <Home className="w-7 h-7" />,
      description:
        'Acompañamiento clínico directo, humano y seguro en la comodidad de tu hogar o tu entorno.',
      color: '#d1d6b9',
      lightColor: 'rgba(209, 214, 185, 0.08)',
      accentIcon: <Home className="w-5 h-5" />,
    },
  ];

  const processItems = [
    {
      title: 'Aprender a apagar la alarma del estrés',
      description:
        'Identificaremos las razones por las cuales su mente y su cuerpo se mantienen en un estado de alerta e insomnio constante, devolviéndole el control y la calma a su día a día.',
      icon: <BellOff className="w-5 h-5" />,
    },
    {
      title: 'Sanar la ansiedad por rupturas o conflictos afectivos',
      description:
        'Encontraremos herramientas prácticas para que usted pueda gestionar el dolor, el sobrepensar y la desesperación que generan las crisis de pareja, las separaciones o el distanciamiento.',
      icon: <HeartCrack className="w-5 h-5" />,
    },
    {
      title: 'Romper con la necesidad de aprobación y el miedo al rechazo',
      description:
        'Trabajaremos en fortalecer su seguridad interna para que deje de depender de las acciones de los demás para sentirse tranquilo y en paz.',
      icon: <Shield className="w-5 h-5" />,
    },
    {
      title: 'Construcción de límites firmes y amor propio',
      description:
        'Diseñaremos un plan de acción real para que usted aprenda a decir No, recupere su dignidad y reconstruya una vida autónoma, libre de apegos que lastiman.',
      icon: <Hand className="w-5 h-5" />,
    },
  ];

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`, '_blank');
  };

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity }}
      id="servicios"
      className="relative min-h-screen py-32 px-6 lg:px-8 overflow-hidden bg-white"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#bec5a4]/10 to-transparent" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, ${services[0].lightColor} 0%, transparent 50%),
                            radial-gradient(circle at 75% 75%, ${services[1].lightColor} 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="relative container mx-auto max-w-7xl">
        <motion.div
          style={{ y }}
          className="text-center max-w-4xl mx-auto mb-24"
        >
          <div className="inline-flex items-center justify-center space-x-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-300" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-sm tracking-[0.3em] font-light text-gray-500 uppercase"
            >
              La Solución
            </motion.span>
            <div className="h-px w-16 bg-gradient-to-r from-gray-300 to-transparent" />
          </div>

          <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4">Mis Servicios</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-32 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.23, 1, 0.32, 1],
              }}
              whileHover={{ y: -12 }}
              onHoverStart={() => setHoveredCard(service.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative group"
            >
              <div
                className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(circle at center, ${service.lightColor}, transparent 70%)`,
                  filter: 'blur(20px)',
                }}
              />

              <div
                className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50
                            group-hover:border-gray-300/50 transition-all duration-500 overflow-hidden
                            shadow-[0_8px_32px_rgba(0,0,0,0.04)] group-hover:shadow-[0_20px_60px_rgba(190,197,164,0.1)]"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        animate={{
                          rotate: hoveredCard === service.id ? 360 : 0,
                          scale: hoveredCard === service.id ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                      >
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${service.color}15, ${service.color}05)`,
                            border: `1px solid ${service.color}20`,
                          }}
                        >
                          <div className="text-[#bec5a4]">{service.icon}</div>
                        </div>
                        <div className="absolute -top-2 -right-2">{service.accentIcon}</div>
                      </motion.div>

                      <div>
                        <span className="text-xs tracking-widest font-light text-gray-500 uppercase block mb-1">
                          {service.subtitle}
                        </span>
                        <h3 className="text-2xl font-light text-gray-900">{service.title}</h3>
                      </div>
                    </div>

                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{
                        x: hoveredCard === service.id ? 0 : 20,
                        opacity: hoveredCard === service.id ? 1 : 0,
                      }}
                      className="text-[#bec5a4]"
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.div>
                  </div>

                  <p className="text-gray-600 font-light leading-relaxed">{service.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto mb-32"
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center space-x-4 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300" />
              <span className="text-sm tracking-[0.3em] font-light text-gray-500 uppercase">
                Tu Proceso
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300" />
            </div>
            <h3 className="text-3xl lg:text-4xl font-light text-gray-900">
              Lo que trabajaremos en su proceso terapéutico
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {processItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl border border-gray-200/50 bg-white/80 hover:border-[#bec5a4]/30 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-[#bec5a4]/10 border border-[#bec5a4]/20">
                    <div className="text-[#bec5a4]">{item.icon}</div>
                  </div>
                  <div>
                    <h4 className="text-lg font-light text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-600 font-light leading-relaxed text-sm">{item.description}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-[#bec5a4] flex-shrink-0 opacity-40" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#bec5a4]/5 via-white to-[#d1d6b9]/5 rounded-3xl" />
          <div className="absolute inset-0 border border-gray-200/30 rounded-3xl" />

          <div className="relative p-12 text-center">
            <h3 className="text-3xl font-light text-gray-900 mb-6">
              Su salud mental y la paz de sus vínculos no pueden esperar más.
            </h3>

            <p className="text-gray-600 font-light mb-10 max-w-2xl mx-auto text-lg">Hablemos.</p>

            <motion.button
              onClick={handleWhatsAppClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center space-x-3 px-8 py-4 bg-[#bec5a4] text-white rounded-xl
                       font-light tracking-wide hover:bg-[#a0a78c] transition-colors duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Iniciar mi terapia virtual o domiciliaria</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-12">
          <a
            href="#inicio"
            className="text-xs tracking-widest font-light text-gray-400 hover:text-[#bec5a4]
                     transition-colors duration-500 group"
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -left-6">←</span>
            Inicio
          </a>

          <div className="flex items-center space-x-2">
            {[...Array(services.length)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: hoveredCard === i + 1 ? 1.2 : 1,
                  backgroundColor: hoveredCard === i + 1 ? services[i].color : '#E5E7EB',
                }}
                className="w-2 h-2 rounded-full transition-colors duration-300"
              />
            ))}
          </div>

          <a
            href="#sobre-mi"
            className="text-xs tracking-widest font-light text-gray-400 hover:text-[#bec5a4]
                     transition-colors duration-500 group"
          >
            Sobre mí
            <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-6">→</span>
          </a>
        </div>
      </div>

      <AnimatePresence>
        {hoveredCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-0"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-[2px] h-[2px] rounded-full"
                style={{
                  backgroundColor: services.find((s) => s.id === hoveredCard)?.color,
                  left: `${(i * 13 + 7) % 100}%`,
                  top: `${(i * 17 + 11) % 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 2 + (i % 3) * 0.5,
                  repeat: Infinity,
                  delay: i * 0.25,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default ServicesSection;
