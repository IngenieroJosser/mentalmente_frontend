'use client';

import { motion } from 'framer-motion';
import { Heart, Lock, Phone, Mail, MapPin, ArrowUp } from 'lucide-react';
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
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#bec5a4]/30 to-transparent" />

      <div className="container mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-[1.5fr_1fr_1fr] gap-12 mb-20">
          {/* Columna 1: Marca */}
          <div className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center lg:justify-start"
            >
              <Image
                src="/arco-logo-footer.png"
                alt="SanaTú - Consultorio Psicológico"
                width={260}
                height={260}
                className="object-contain w-[220px] sm:w-[240px] lg:w-[280px] h-auto"
                priority
              />
            </motion.div>
          </div>

          {/* Columna 2: Navegación */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <h4 className="text-sm tracking-widest font-light text-gray-900 uppercase">
                Navegación
              </h4>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
            </div>

            <nav className="space-y-3">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="block text-gray-500 hover:text-[#bec5a4] font-light text-sm transition-colors duration-300 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-[#bec5a4] transition-colors duration-300" />
                    <span>{item.label}</span>
                  </div>
                </motion.a>
              ))}
            </nav>

            <div className="pt-6 border-t border-gray-100">
              <a
                href="https://tu-software-clinico.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Acceder al software clínico"
                className="inline-flex items-center space-x-2 text-gray-400 hover:text-[#bec5a4] transition-colors duration-300 group"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="font-light text-xs tracking-wide">
                  Acceso Clínico
                </span>
                <ArrowUp className="w-3 h-3 transform rotate-45 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          {/* Columna 3: Contacto */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <h4 className="text-sm tracking-widest font-light text-gray-900 uppercase">
                Contacto
              </h4>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
            </div>

            <div className="space-y-5">
              <a
                href="https://wa.me/573113266223"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contactar por WhatsApp"
                className="flex items-center space-x-3 group"
              >
                <div className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center group-hover:border-[#bec5a4]/50 group-hover:bg-[#bec5a4]/5 transition-all duration-300">
                  <Phone className="w-4 h-4 text-gray-400 group-hover:text-[#bec5a4] transition-colors" />
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-light">WhatsApp</p>
                  <p className="text-gray-400 text-xs">+57 311 326 6223</p>
                </div>
              </a>

              <a
                href="mailto:liyivethq@gmail.com"
                aria-label="Enviar correo electrónico"
                className="flex items-center space-x-3 group"
              >
                <div className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center group-hover:border-[#bec5a4]/50 group-hover:bg-[#bec5a4]/5 transition-all duration-300">
                  <Mail className="w-4 h-4 text-gray-400 group-hover:text-[#bec5a4] transition-colors" />
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-light">Email</p>
                  <p className="text-gray-400 text-xs">liyivethq@gmail.com</p>
                </div>
              </a>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-gray-300" />
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-light">Ubicación</p>
                  <p className="text-gray-400 text-xs">Quibdó - Chocó, Colombia</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <Heart className="w-3.5 h-3.5 text-[#bec5a4]" />
                <span className="text-xs text-gray-400 font-light">
                  Atención presencial y virtual
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer inferior */}
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 border-t border-gray-100 pt-8">
          <div className="text-center lg:text-left">
            <p className="text-xs text-gray-400 font-light">
              © {currentYear} Psicóloga Liyiveth Quintero García. Todos los
              derechos reservados.
            </p>
            <p className="text-xs text-gray-300 font-light mt-1">
              Psicología profesional con enfoque cognitivo conductual
            </p>
          </div>

          <motion.button
            type="button"
            onClick={scrollToTop}
            whileHover={{ y: -2 }}
            aria-label="Volver arriba"
            className="flex items-center space-x-2 text-gray-400 hover:text-[#bec5a4] transition-colors duration-300 group"
          >
            <span className="text-xs font-light">Volver arriba</span>
            <div className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#bec5a4]/50 transition-colors duration-300">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </motion.button>
        </div>
      </div>

      <div className="h-px w-20 mx-auto bg-gradient-to-r from-transparent via-[#bec5a4] to-transparent" />
    </footer>
  );
};

export default Footer;