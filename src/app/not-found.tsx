'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Search, 
  AlertCircle, 
  ArrowLeft,
  Brain,
  Heart
} from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mt-28 min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-white px-6">
      {/* Fondo sutil */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-[#bec5a4]/5 rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-[#bec5a4]/3 rounded-full" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
          <Brain className="h-48 w-48 text-[#bec5a4]" />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Código de error */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="mb-12"
        >
          <div className="relative">
            <div className="text-[12rem] font-light text-[#bec5a4]/10 leading-none">404</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <AlertCircle className="h-32 w-32 text-[#bec5a4]" strokeWidth={1} />
            </div>
          </div>
        </motion.div>

        {/* Mensaje */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
            Página no encontrada
          </h1>
          
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#bec5a4] to-transparent mx-auto mb-8" />
          
          <p className="text-xl text-gray-600 font-light leading-relaxed mb-8 max-w-md mx-auto">
            La página que buscas no existe o ha sido movida a otra ubicación.
          </p>
          
          <div className="inline-flex items-center space-x-2 text-gray-500 font-light">
            <Heart className="h-4 w-4" />
            <span className="text-sm">SanaTú Quingar</span>
          </div>
        </motion.div>

        {/* Botones de acción */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden px-8 py-4 bg-[#bec5a4] text-white rounded-xl 
                       font-light tracking-wide flex items-center justify-center space-x-3"
            >
              <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
              <span>Volver al inicio</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </motion.button>
          </Link>
          
          <Link href="#buscar">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl 
                       hover:border-[#bec5a4] hover:text-[#bec5a4] transition-all duration-300 
                       font-light tracking-wide flex items-center justify-center space-x-3"
            >
              <Search className="w-5 h-5" />
              <span>Buscar contenido</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Enlaces rápidos */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <p className="text-gray-500 font-light mb-6">También puedes visitar:</p>
          
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: 'Inicio', href: '/' },
              { label: 'Sobre mí', href: '/#sobre-mi' },
              { label: 'Servicios', href: '/#servicios' },
              { label: 'Contacto', href: '/#contacto' },
              { label: 'Área Clínica', href: '/login' }
            ].map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="group relative px-4 py-2"
              >
                <span className="text-gray-600 font-light group-hover:text-[#bec5a4] transition-colors">
                  {link.label}
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#bec5a4] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Búsqueda */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar en SanaTú Quingar..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl 
                       focus:border-[#bec5a4] focus:ring-1 focus:ring-[#bec5a4]/30 
                       outline-none transition-all font-light placeholder-gray-400"
            />
          </div>
        </motion.div>

        {/* Mensaje final */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-8 border-t border-gray-100"
        >
          <p className="text-sm text-gray-500 font-light max-w-md mx-auto">
            Si crees que esto es un error, por favor contáctanos a{' '}
            <a href="mailto:hola@sanatuquingar.com" className="text-[#bec5a4] hover:underline">
              hola@sanatuquingar.com
            </a>
          </p>
        </motion.div>
      </div>

      {/* Elementos decorativos flotantes */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1px] h-[1px] bg-[#bec5a4] rounded-full"
            style={{
              left: `${(i * 8.33) + Math.sin(Date.now() * 0.001 + i) * 5}%`,
              top: `${Math.cos(Date.now() * 0.001 + i) * 10 + 50}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 w-full text-center">
        <p className="text-xs text-gray-400 font-light">
          © {new Date().getFullYear()} SanaTú Quingar. Psicología & Bienestar Integral.
        </p>
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mt-2" />
      </footer>
    </div>
  );
}