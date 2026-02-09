'use client';

import { motion } from 'framer-motion';
import { 
  Heart, 
  Lock, 
  Phone, 
  Mail, 
  MapPin,
  ArrowUp,
  Sparkles
} from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Sobre mí', href: '#sobre-mi' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Contacto', href: '#contacto' },
  ];

  return (
    <footer className="relative bg-white border-t border-gray-100">
      {/* Elemento decorativo sutil */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#bec5a4]/20 to-transparent" />

      <div className="container mx-auto px-6 lg:px-8 py-24">
        {/* Contenido principal */}
        <div className="grid lg:grid-cols-3 gap-16 mb-24">
          {/* Columna 1: Marca */}
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#bec5a4] flex items-center justify-center">
                  <Image 
                    src="/logo-sana-tu.png" 
                    alt="SanaTú Quingar" 
                    width={32} 
                    height={32} 
                    className="object-contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-light text-gray-900">SanaTú Quingar</h3>
                <p className="text-gray-500 text-sm font-light mt-1">
                  Psicología & Bienestar Integral
                </p>
              </div>
            </div>

            <p className="text-gray-600 font-light leading-relaxed">
              Un espacio profesional diseñado para acompañarte en tu camino hacia el bienestar emocional y la transformación personal.
            </p>

            <div className="pt-8 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-gray-500">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-light">
                  "Sanar es volverte habitable y seguro para ti mismo"
                </span>
              </div>
            </div>
          </div>

          {/* Columna 2: Navegación */}
          <div className="space-y-8">
            <h4 className="text-lg font-light text-gray-900">Navegación</h4>
            <nav className="space-y-4">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="block text-gray-600 hover:text-[#bec5a4] font-light transition-colors duration-300 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-[#bec5a4] transition-colors" />
                    <span>{item.label}</span>
                  </div>
                </motion.a>
              ))}
            </nav>

            <div className="pt-8 border-t border-gray-100">
              <a
                href="https://tu-software-clinico.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 text-gray-600 hover:text-[#bec5a4] transition-colors duration-300 group"
              >
                <Lock className="w-4 h-4" />
                <span className="font-light">Clínico</span>
                <ArrowUp className="w-3 h-3 transform rotate-45 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          {/* Columna 3: Contacto */}
          <div className="space-y-8">
            <h4 className="text-lg font-light text-gray-900">Contacto</h4>
            
            <div className="space-y-6">
              <a
                href={`https://wa.me/3113266223`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 group"
              >
                <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center group-hover:border-[#bec5a4] transition-colors">
                  <Phone className="w-5 h-5 text-gray-600 group-hover:text-[#bec5a4] transition-colors" />
                </div>
                <div>
                  <p className="font-light text-gray-900">WhatsApp</p>
                  <p className="text-gray-500 text-sm font-light">+57 311 326 6223</p>
                </div>
              </a>

              <a
                href="mailto:hola@sanatuquingar.com"
                className="flex items-center space-x-4 group"
              >
                <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center group-hover:border-[#bec5a4] transition-colors">
                  <Mail className="w-5 h-5 text-gray-600 group-hover:text-[#bec5a4] transition-colors" />
                </div>
                <div>
                  <p className="font-light text-gray-900">Email</p>
                  <p className="text-gray-500 text-sm font-light">hola@sanatuquingar.com</p>
                </div>
              </a>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-light text-gray-900">Ubicación</p>
                  <p className="text-gray-500 text-sm font-light">Colombia</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 font-light">
                  Consultas disponibles en modalidad presencial y virtual
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Separador sutil */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16" />

        {/* Footer inferior */}
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0">
          <div className="text-center lg:text-left">
            <p className="text-sm text-gray-500 font-light">
              © {currentYear} SanaTú Quingar. Todos los derechos reservados.
            </p>
            <p className="text-xs text-gray-400 font-light mt-2">
              Psicología profesional con enfoque humanista y estratégico
            </p>
          </div>

          <div className="flex items-center space-x-8">
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors duration-300 group"
            >
              <span className="text-sm font-light">Volver arriba</span>
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-gray-300 transition-colors">
                <ArrowUp className="w-4 h-4" />
              </div>
            </button>

            <div className="hidden lg:block h-8 w-px bg-gray-200" />

            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-400 font-light tracking-wider">
                DISEÑADO CON
              </span>
              <Heart className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400 font-light tracking-wider">
                POR Luis Carlos Chaverra Córdoba | Todos los derechos reservados
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Línea final minimalista */}
      <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-[#bec5a4] to-transparent" />
    </footer>
  );
};

export default Footer;