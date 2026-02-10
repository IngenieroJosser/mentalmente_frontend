'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { 
  Brain, 
  Users, 
  TrendingUp,
  CheckCircle2,
  Sparkle,
  ArrowRight,
  Heart,
  Shield,
  Target,
  Zap,
  Star
} from 'lucide-react';

const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.5]);
  const y = useTransform(scrollYProgress, [0, 0.5], [80, 0]);

  const services = [
    {
      id: 1,
      title: "Psicoterapia Individual",
      subtitle: "Sanación Personal",
      icon: <Brain className="w-7 h-7" />,
      description: "Espacios seguros para el autodescubrimiento y transformación emocional",
      color: "#bec5a4",
      lightColor: "rgba(190, 197, 164, 0.08)",
      features: [
        { text: "Psicoterapia para jóvenes y adultos", icon: <Heart className="w-4 h-4" /> },
        { text: "Acompañamiento en embarazo y posparto", icon: <Sparkle className="w-4 h-4" /> },
        { text: "Enfoque de género y diversidad (LGTBIQ+)", icon: <Users className="w-4 h-4" /> },
        { text: "Apoyo psicológico frente al estigma de ITS", icon: <Shield className="w-4 h-4" /> }
      ],
      accentIcon: <Star className="w-5 h-5" />
    },
    {
      id: 2,
      title: "Intervención Psicosocial",
      subtitle: "Transformación Colectiva",
      icon: <Users className="w-7 h-7" />,
      description: "Reconstrucción de proyectos de vida y sanación comunitaria",
      color: "#d1d6b9",
      lightColor: "rgba(209, 214, 185, 0.08)",
      features: [
        { text: "Atención a víctimas del conflicto armado", icon: <Shield className="w-4 h-4" /> },
        { text: "Reconstrucción de proyecto de vida", icon: <Target className="w-4 h-4" /> },
        { text: "Intervención en crisis y procesos de duelo", icon: <Heart className="w-4 h-4" /> },
        { text: "Primeros auxilios psicológicos", icon: <Zap className="w-4 h-4" /> }
      ],
      accentIcon: <Target className="w-5 h-5" />
    },
    {
      id: 3,
      title: "Educación y Bienestar",
      subtitle: "Crecimiento Continuo",
      icon: <TrendingUp className="w-7 h-7" />,
      description: "Desarrollo de competencias emocionales y organizacionales",
      color: "#a8b08c",
      lightColor: "rgba(168, 176, 140, 0.08)",
      features: [
        { text: "Talleres de inteligencia emocional y salud mental", icon: <Brain className="w-4 h-4" /> },
        { text: "Charlas de prevención de la discriminación", icon: <Users className="w-4 h-4" /> },
        { text: "Capacitaciones en clima laboral y bienestar humano", icon: <TrendingUp className="w-4 h-4" /> },
        { text: "Conferencias psicoeducativas", icon: <Sparkle className="w-4 h-4" /> }
      ],
      accentIcon: <Sparkle className="w-5 h-5" />
    }
  ];

  const handleWhatsAppClick = () => {
    const phoneNumber = '+573001234567';
    const message = encodeURIComponent('Hola SanaTú Quingar, vi tu página y me gustaría recibir información de tus servicios');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity }}
      id="servicios"
      className="relative min-h-screen py-32 px-6 lg:px-8 overflow-hidden bg-white"
    >
      {/* Fondo de lujo con gradientes sutiles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#bec5a4]/10 to-transparent" />
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, ${services[0].lightColor} 0%, transparent 50%),
                            radial-gradient(circle at 75% 75%, ${services[1].lightColor} 0%, transparent 50%),
                            radial-gradient(circle at 50% 20%, ${services[2].lightColor} 0%, transparent 50%)`
          }}
        />
      </div>

      <div className="relative container mx-auto max-w-7xl">
        {/* Encabezado exquisito */}
        <motion.div
          style={{ y }}
          className="text-center max-w-4xl mx-auto mb-24"
        >
          <div className="inline-flex items-center justify-center space-x-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-300" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-sm tracking-[0.3em] font-light text-gray-500 uppercase"
            >
              Servicios Exclusivos
            </motion.span>
            <div className="h-px w-16 bg-gradient-to-r from-gray-300 to-transparent" />
          </div>

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl lg:text-6xl font-light tracking-tight text-gray-900 mb-8"
          >
            Tres <span className="relative">
              <span className="text-[#bec5a4]">frentes</span>
              <span className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-[#bec5a4] to-transparent" />
            </span> de<br />transformación
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto"
          >
            Un ecosistema integral de servicios diseñados para acompañar cada etapa de tu camino hacia el bienestar
          </motion.p>
        </motion.div>

        {/* Grid de servicios - Masterpiece */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-32">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15,
                ease: [0.23, 1, 0.32, 1]
              }}
              whileHover={{ y: -12 }}
              onHoverStart={() => setHoveredCard(service.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative group"
            >
              {/* Efecto de aura */}
              <div 
                className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ 
                  background: `radial-gradient(circle at center, ${service.lightColor}, transparent 70%)`,
                  filter: 'blur(20px)'
                }}
              />

              {/* Tarjeta principal */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 
                            group-hover:border-gray-300/50 transition-all duration-500 overflow-hidden
                            shadow-[0_8px_32px_rgba(0,0,0,0.04)] group-hover:shadow-[0_20px_60px_rgba(190,197,164,0.1)]">
                
                {/* Header elegante de la tarjeta */}
                <div className="p-8 border-b border-gray-100/50">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        animate={{ 
                          rotate: hoveredCard === service.id ? 360 : 0,
                          scale: hoveredCard === service.id ? 1.1 : 1
                        }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                      >
                        <div 
                          className="w-14 h-14 rounded-xl flex items-center justify-center"
                          style={{ 
                            background: `linear-gradient(135deg, ${service.color}15, ${service.color}05)`,
                            border: `1px solid ${service.color}20`
                          }}
                        >
                          <div className="text-[#bec5a4]">
                            {service.icon}
                          </div>
                        </div>
                        <div className="absolute -top-2 -right-2">
                          {service.accentIcon}
                        </div>
                      </motion.div>
                      
                      <div>
                        <span className="text-xs tracking-widest font-light text-gray-500 uppercase block mb-1">
                          {service.subtitle}
                        </span>
                        <h3 className="text-2xl font-light text-gray-900">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Indicador de interacción */}
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ 
                        x: hoveredCard === service.id ? 0 : 20,
                        opacity: hoveredCard === service.id ? 1 : 0
                      }}
                      className="text-[#bec5a4]"
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.div>
                  </div>
                  
                  <p className="text-gray-600 font-light leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Lista de características - Exquisita */}
                <div className="p-8">
                  <div className="space-y-5">
                    {service.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + idx * 0.1 }}
                        whileHover={{ x: 4 }}
                        className="flex items-center group/item"
                      >
                        <div className="flex-shrink-0 mr-4">
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ 
                              background: `linear-gradient(135deg, ${service.color}15, ${service.color}05)`,
                              border: `1px solid ${service.color}15`
                            }}
                          >
                            <div className="text-[#bec5a4]" style={{ color: service.color }}>
                              {feature.icon}
                            </div>
                          </motion.div>
                        </div>
                        
                        <span className="text-gray-700 font-light flex-1 group-hover/item:text-gray-900 transition-colors">
                          {feature.text}
                        </span>
                        
                        <CheckCircle2 
                          className="w-5 h-5 text-[#bec5a4] opacity-0 group-hover/item:opacity-100 transition-opacity ml-2" 
                          style={{ color: service.color }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Footer sutil */}
                <div className="px-8 pb-6">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200/50 to-transparent mb-6" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-light text-gray-500">
                      Personalizado
                    </span>
                    <span className="text-xs tracking-widest font-light text-gray-400 uppercase">
                      {index + 1}/3
                    </span>
                  </div>
                </div>
              </div>

              {/* Línea decorativa inferior */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: hoveredCard === service.id ? 1 : 0 }}
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-0.5"
                style={{ 
                  background: `linear-gradient(to right, transparent, ${service.color}, transparent)`,
                  originX: 0.5
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA de lujo */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative max-w-3xl mx-auto"
        >
          {/* Fondo del CTA */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#bec5a4]/5 via-white to-[#d1d6b9]/5 rounded-3xl" />
          <div className="absolute inset-0 border border-gray-200/30 rounded-3xl" />
          
          <div className="relative p-12 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-full opacity-5"
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-[#bec5a4] rounded-full" />
            </motion.div>
            
            <h3 className="text-3xl font-light text-gray-900 mb-6">
              Tu transformación comienza aquí
            </h3>
            
            <p className="text-gray-600 font-light mb-10 max-w-2xl mx-auto">
              Agenda una consulta inicial para diseñar un camino personalizado hacia tu bienestar emocional
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={handleWhatsAppClick}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(190, 197, 164, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden group px-10 py-5 rounded-xl"
              >
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-[#bec5a4] to-[#d1d6b9] rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#bec5a4] to-[#a8b08c] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                
                <div className="relative flex items-center justify-center space-x-3">
                  <span className="text-white font-light tracking-wide text-lg">
                    Iniciar proceso
                  </span>
                  <ArrowRight className="w-5 h-5 text-white transform group-hover:translate-x-2 transition-transform" />
                </div>
                
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                              translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </motion.button>
              
              <motion.a
                href="#contacto"
                whileHover={{ scale: 1.05 }}
                className="px-10 py-5 border border-gray-300 text-gray-700 rounded-xl 
                         hover:border-[#bec5a4] hover:text-[#bec5a4] transition-all duration-300 
                         font-light tracking-wide bg-white/50 backdrop-blur-sm"
              >
                Más información
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navegación sutil entre secciones */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-12">
          <a 
            href="#sobre-mi" 
            className="text-xs tracking-widest font-light text-gray-400 hover:text-[#bec5a4] 
                     transition-colors duration-500 group"
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -left-6">←</span>
            Sobre mí
          </a>
          
          <div className="flex items-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: hoveredCard === i + 1 ? 1.2 : 1,
                  backgroundColor: hoveredCard === i + 1 ? services[i].color : "#E5E7EB"
                }}
                className="w-2 h-2 rounded-full transition-colors duration-300"
              />
            ))}
          </div>
          
          <a 
            href="#contacto" 
            className="text-xs tracking-widest font-light text-gray-400 hover:text-[#bec5a4] 
                     transition-colors duration-500 group"
          >
            Contacto
            <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-6">→</span>
          </a>
        </div>
      </div>

      {/* Partículas decorativas */}
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
                  backgroundColor: services.find(s => s.id === hoveredCard)?.color,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2,
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