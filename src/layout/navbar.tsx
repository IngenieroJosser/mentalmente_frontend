'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, Lock, ChevronRight, Sparkle, Brain } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const headerRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.98]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 8]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['inicio', 'sobre-mi', 'servicios', 'contacto'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleContactClick = () => {
    const phoneNumber = '+573113266223';
    const message = encodeURIComponent('Hola SanaTú Quingar, vi tu página y me gustaría recibir información de tus servicios');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const navItems = [
    { label: 'Inicio', href: '#inicio', id: 'inicio' },
    { label: 'Sobre mí', href: '#sobre-mi', id: 'sobre-mi' },
    { label: 'Servicios', href: '#servicios', id: 'servicios' },
    { label: 'Contacto', href: '#contacto', id: 'contacto' },
  ];

  return (
    <>
      {/* Efecto de Partículas de Luz */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1px] h-[1px] bg-[#bec5a4] rounded-full"
            style={{
              left: `${(i * 12.5) + Math.sin(Date.now() * 0.001 + i) * 5}%`,
              top: `${Math.cos(Date.now() * 0.001 + i) * 20 + 50}%`,
              boxShadow: `0 0 ${8 + Math.sin(Date.now() * 0.002 + i) * 4}px ${2 + Math.sin(Date.now() * 0.002 + i)}px rgba(190, 197, 164, 0.4)`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      <motion.header
        ref={headerRef}
        style={{
          opacity: headerOpacity,
          backdropFilter: `blur(${headerBlur}px)`,
        }}
        className="fixed top-0 w-full z-50"
      >
        {/* Gradiente Dinámico de Fondo */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(190, 197, 164, 0.15), transparent 80%)`
          }}
        />

        {/* Fondo con Borde Sutil */}
        <div className="absolute inset-0 bg-white/85 border-b border-gray-100/30" />

        <div className="relative container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo Arquitectónico */}
            <Link href="/" className="group relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3"
              >
                {/* Símbolo Abstracto */}
                <div className="relative">
                  <div className="w-10 h-10 relative">
                    {/* Forma Principal */}
                    <div className="absolute inset-0 border border-gray-300/50 rounded-lg transform rotate-45 group-hover:rotate-0 transition-all duration-500" />

                    {/* Forma Interna */}
                    <div className="absolute inset-2 border border-[#bec5a4]/40 rounded group-hover:border-[#bec5a4]/60 transition-all duration-500" />

                    {/* Centro */}
                    <div className="absolute inset-3 bg-gradient-to-br from-[#bec5a4]/20 to-transparent rounded opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Punto de Enfoque */}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-1/2 left-1/2 w-1 h-1 bg-[#bec5a4] rounded-full -translate-x-1/2 -translate-y-1/2"
                    />
                  </div>

                  {/* Efecto de Brillo */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-[#bec5a4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Texto con Espaciado Arquitectónico */}
                <div className="flex flex-col">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-lg font-light tracking-[0.2em] text-gray-900">SANATÚ</span>
                    <Sparkle className="w-3 h-3 text-[#bec5a4] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-gray-300/50 to-transparent" />
                  <span className="text-[10px] tracking-[0.3em] text-gray-500 font-light uppercase mt-1">QUINGAR</span>
                </div>
              </motion.div>
            </Link>

            {/* Navegación de Precisión */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -1 }}
                    className="relative"
                  >
                    <a
                      href={item.href}
                      className="px-4 py-2 flex flex-col items-center"
                    >
                      <span className={`text-xs tracking-widest font-light transition-all duration-300 ${isActive ? 'text-[#bec5a4]' : 'text-gray-600 hover:text-gray-900'
                        }`}>
                        {item.label}
                      </span>

                      {/* Indicador Activo */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="mt-1 w-1 h-1 bg-[#bec5a4] rounded-full"
                        />
                      )}
                    </a>

                    {/* Línea de Tiempo */}
                    <div className="absolute bottom-0 left-1/2 w-px h-3 bg-gradient-to-t from-gray-300/50 to-transparent -translate-x-1/2" />
                  </motion.div>
                );
              })}

              {/* Separador Vertical */}
              <div className="w-px h-4 bg-gradient-to-b from-transparent via-gray-300/50 to-transparent mx-4" />

              {/* Acceso Privado - Diseño de Llave */}
              <motion.a
                onClick={() => router.push("/login")}
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="group relative px-4 py-2 flex items-center space-x-2 cursor-pointer"
              >
                <div className="relative">
                  <Brain className="w-4 h-4 text-gray-500 group-hover:text-[#bec5a4] transition-colors duration-300" />
                  <div className="absolute -inset-2 rounded-full border border-gray-300/30 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>

                <span className="text-xs tracking-widest font-light text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                  CLÍNICO
                </span>
              </motion.a>

              {/* Botón de Contacto - Obra Maestra */}
              <motion.div
                className="relative ml-2"
                initial={false}
                animate={{ scale: activeSection === 'contacto' ? 1.02 : 1 }}
              >
                {/* Sombra Dinámica */}
                <div className="absolute -inset-2 bg-gradient-to-r from-[#bec5a4]/20 to-transparent rounded-xl blur opacity-0 hover:opacity-100 transition-opacity duration-500" />

                <motion.button
                  onClick={handleContactClick}
                  whileHover={{
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative overflow-hidden group"
                >
                  {/* Fondo Principal */}
                  <div className="relative px-8 py-2.5 bg-white border border-gray-300/50 rounded-lg 
                               group-hover:border-[#bec5a4]/30 transition-all duration-500">

                    {/* Texto con Efecto */}
                    <div className="relative flex items-center space-x-2">
                      <span className="text-xs tracking-widest font-light text-gray-700 
                                    group-hover:text-[#bec5a4] transition-colors duration-500">
                        CONTACTAR
                      </span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-[#bec5a4] 
                                               transition-colors duration-500" />
                      </motion.div>
                    </div>

                    {/* Efecto de Luz Interior */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                  translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </div>

                  {/* Borde Animado */}
                  <div className="absolute inset-0 rounded-lg border border-[#bec5a4]/0 group-hover:border-[#bec5a4]/30 
                               transition-all duration-500" />
                </motion.button>
              </motion.div>
            </nav>

            {/* Menú Móvil - Icono de Precisión */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center"
              aria-label="Menú"
            >
              {/* Icono Hamburguesa Estilizado */}
              <div className="relative w-6 h-4">
                <motion.span
                  animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  className="absolute top-0 left-0 w-full h-0.5 bg-gray-700 rounded-full"
                />
                <motion.span
                  animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-700 rounded-full -translate-y-1/2"
                />
                <motion.span
                  animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-700 rounded-full"
                />
              </div>
            </motion.button>
          </div>

          {/* Línea de Progreso Elegante */}
          <motion.div
            className="h-[0.5px] bg-gradient-to-r from-transparent via-gray-300/50 to-transparent"
            style={{
              scaleX: useTransform(scrollY, [0, 1000], [0, 1]),
              originX: 0
            }}
          />
        </div>
      </motion.header>

      {/* Menú Móvil - Experiencia Inmersiva */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay con Efecto de Desenfoque */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-md z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Panel de Menú */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white/95 backdrop-blur-xl z-50 lg:hidden 
                       border-l border-gray-200/20 shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Encabezado del Menú */}
                <div className="p-8 border-b border-gray-200/20">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 border border-gray-300/50 rounded flex items-center justify-center">
                        <div className="w-5 h-5 border border-[#bec5a4]/40 rounded" />
                      </div>
                      <div>
                        <h3 className="text-sm tracking-widest font-light text-gray-900">MENÚ</h3>
                        <p className="text-[10px] text-gray-500 tracking-widest">SANATÚ QUINGAR</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 hover:bg-gray-100/50 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Navegación */}
                <div className="flex-1 p-8 overflow-y-auto">
                  <div className="space-y-1">
                    {navItems.map((item, index) => (
                      <motion.a
                        key={item.href}
                        href={item.href}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setIsMenuOpen(false)}
                        className="group flex items-center justify-between py-4 px-4 rounded-lg
                                 hover:bg-gray-100/50 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-1 h-1 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 
                                       group-hover:bg-[#bec5a4] transition-all duration-300" />
                          <span className="text-sm tracking-widest font-light text-gray-700">
                            {item.label.toUpperCase()}
                          </span>
                        </div>
                        <ChevronRight className="w-3 h-3 text-gray-400 transform -rotate-45 
                                               group-hover:rotate-0 group-hover:text-[#bec5a4] 
                                               transition-all duration-300" />
                      </motion.a>
                    ))}

                    {/* Separador */}
                    <div className="my-6 px-4">
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent" />
                    </div>

                    {/* Acceso Privado */}
                    <motion.a
                      href="/login"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      onClick={() => setIsMenuOpen(false)}
                      className="group flex items-center justify-between py-4 px-4 rounded-lg
                               border border-gray-200/50 hover:border-[#bec5a4]/30 
                               hover:bg-gray-100/30 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3">
                        <Brain className="w-3 h-3 text-gray-500 group-hover:text-[#bec5a4] 
                                       transition-colors duration-300" />
                        <span className="text-sm tracking-widest font-light text-gray-700">
                          CLÍNICO
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-light tracking-widest">
                        CLÍNICO
                      </span>
                    </motion.a>
                  </div>
                </div>

                {/* Botón de Contacto Móvil */}
                <div className="p-8 border-t border-gray-200/20">
                  <motion.button
                    onClick={() => {
                      handleContactClick();
                      setIsMenuOpen(false);
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-4 bg-white border border-gray-300/50 rounded-lg
                             hover:border-[#bec5a4]/30 hover:bg-gray-50/50
                             transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-sm tracking-widest font-light text-gray-700 
                                    group-hover:text-[#bec5a4] transition-colors duration-300">
                        INICIAR CONVERSACIÓN
                      </span>
                      <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-[#bec5a4] 
                                             group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Indicador de Sección Activa (Desktop) */}
      <div className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 z-40">
        <div className="flex flex-col items-center space-y-4">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                className="group relative"
              >
                <motion.div
                  animate={{ scale: isActive ? 1.2 : 1 }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${isActive
                      ? 'bg-[#bec5a4]'
                      : 'bg-gray-300 group-hover:bg-gray-400'
                    }`}
                />
                {/* Tooltip */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 
                             transition-opacity duration-300 pointer-events-none">
                  <div className="relative">
                    <span className="text-xs font-light tracking-widest text-gray-600 whitespace-nowrap 
                                   bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded border border-gray-200/50">
                      {item.label}
                    </span>
                    <div className="absolute top-1/2 right-full h-px w-2 bg-gradient-to-l from-gray-300/50 to-transparent" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Header;