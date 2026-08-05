'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  MessageCircle,
  ChevronRight,
  User,
  HeartPulse,
  Smile,
  Heart,
  Users,
  MessageSquare,
  Compass,
  GraduationCap
} from 'lucide-react';

const WHATSAPP_NUMBER = '573113266223';
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hola Psic. Liyiveth, quiero recibir orientación.'
);

const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [, setHoveredCard] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.5]);
  const y = useTransform(scrollYProgress, [0, 0.5], [80, 0]);

  const services = [
    {
      id: 1,
      title: 'Espacio De Orientación Psicológica',
      icon: <User className="w-6 h-6" />,
      description: 'La orientación psicológica es un espacio de escucha, reflexión y acompañamiento profesional dirigido a personas que desean comprender mejor una situación específica de su vida y encontrar herramientas para afrontarla de manera saludable. Durante este proceso te ayudaré a analizar lo que estás viviendo, identificar alternativas, fortalecer tus recursos personales y tomar decisiones con mayor claridad.',
    },
    {
      id: 2,
      title: 'Primeros Auxilios Psicológicos (PAP)',
      icon: <HeartPulse className="w-6 h-6" />,
      description: 'Los Primeros Auxilios Psicológicos son una intervención inmediata dirigida a personas que atraviesan una situación emocional difícil o inesperada. Mi propósito es brindarte apoyo inicial, ayudarte a recuperar la calma, organizar tus pensamientos y orientarte sobre los pasos más adecuados para afrontar la situación.',
    },
    {
      id: 3,
      title: 'Orientación para el Bienestar Emocional',
      icon: <Smile className="w-6 h-6" />,
      description: 'Las emociones forman parte de la vida y, en ocasiones, pueden resultar difíciles de comprender o manejar. En este espacio te brindaré orientación para identificar lo que estás sintiendo, comprender el origen de tus emociones y desarrollar herramientas que favorezcan tu bienestar emocional.',
    },
    {
      id: 4,
      title: 'Orientación en Relaciones de Pareja',
      icon: <Heart className="w-6 h-6" />,
      description: 'Las relaciones pueden generar bienestar, pero también dudas, conflictos y momentos de confusión. Te acompañaré para comprender las situaciones que estás viviendo, mejorar la comunicación, fortalecer el respeto mutuo y favorecer la toma de decisiones conscientes.',
    },
    {
      id: 5,
      title: 'Orientación en Relaciones Familiares',
      icon: <Users className="w-6 h-6" />,
      description: 'La convivencia familiar puede presentar retos que afectan el bienestar emocional. Este espacio está diseñado para ayudarte a comprender las dinámicas familiares, fortalecer la comunicación y encontrar estrategias que favorezcan relaciones más saludables.',
    },
    {
      id: 6,
      title: 'Desarrollo de Habilidades Sociales',
      icon: <MessageSquare className="w-6 h-6" />,
      description: 'Las relaciones interpersonales se fortalecen cuando aprendemos a comunicarnos de forma clara y respetuosa. Trabajaremos habilidades como: Comunicación asertiva, Escucha activa, Expresión adecuada de emociones, Resolución de conflictos y Establecimiento de límites saludables.',
    },
    {
      id: 7,
      title: 'Orientación para la Toma de Decisiones',
      icon: <Compass className="w-6 h-6" />,
      description: 'Existen momentos en los que tomar una decisión puede resultar difícil. Te acompañaré a analizar diferentes alternativas, identificar tus prioridades y tomar decisiones de manera consciente, respetando tus valores y objetivos personales.',
    }
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
      </div>

      <div className="relative container mx-auto max-w-7xl">
        <motion.div
          style={{ y }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div className="inline-flex items-center justify-center space-x-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-300" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-sm tracking-[0.3em] font-light text-gray-500 uppercase"
            >
              Mis Servicios
            </motion.span>
            <div className="h-px w-16 bg-gradient-to-r from-gray-300 to-transparent" />
          </div>

          <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4">¿Cómo puedo ayudarte?</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-32 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.23, 1, 0.32, 1],
              }}
              onHoverStart={() => setHoveredCard(service.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative p-8 rounded-2xl border border-gray-200/60 bg-white hover:border-[#bec5a4]/40 transition-all duration-300 group shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-[#bec5a4]/10 border border-[#bec5a4]/20 text-[#bec5a4] group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-light text-gray-900 mb-4 leading-snug">{service.title}</h3>
              <p className="text-gray-600 font-light leading-relaxed text-sm">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          id="talleres"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto mb-32"
        >
          <div className="relative p-10 lg:p-14 rounded-3xl bg-gray-50 border border-gray-200/50">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
              <div className="lg:w-1/2">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-white border border-gray-200 shadow-sm text-[#bec5a4]">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-light text-gray-900 mb-4">Talleres y Charlas Psicoeducativas</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  También desarrollo espacios educativos dirigidos a instituciones, empresas, grupos comunitarios y población general. Los talleres buscan promover el bienestar emocional mediante actividades participativas y herramientas prácticas sobre diferentes temas relacionados con la salud mental.
                </p>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-light text-gray-900 mb-4">Algunos temas son:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['Manejo del estrés', 'Regulación emocional', 'Comunicación asertiva', 'Relaciones saludables', 'Resolución de conflictos', 'Habilidades para la vida', 'Promoción de la salud mental', 'Primeros Auxilios Psicológicos'].map((tema, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#bec5a4]" />
                        <span className="text-gray-600 font-light text-sm">{tema}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-3xl mx-auto text-center"
        >
          <motion.button
            onClick={handleWhatsAppClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center space-x-3 px-8 py-4 bg-[#bec5a4] text-white rounded-xl
                     font-light tracking-wide hover:bg-[#a0a78c] transition-colors duration-300 shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Quiero recibir orientación</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ServicesSection;
