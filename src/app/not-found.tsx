'use client';

import { useRouter } from 'next/navigation';
import { Brain, Home, HeartHandshake, Leaf, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0a1727] to-[#102235] relative overflow-hidden">
      {/* Elementos decorativos flotantes */}
      <div className="absolute top-20 left-20 animate-pulse">
        <HeartHandshake className="h-16 w-16 text-[#c77914]/20" />
      </div>
      <div className="absolute bottom-20 right-20 animate-pulse animation-delay-300">
        <Leaf className="h-16 w-16 text-[#19334c]/20" />
      </div>
      <div className="absolute top-1/3 right-1/4 animate-pulse animation-delay-500">
        <Sparkles className="h-12 w-12 text-[#c77914]/20" />
      </div>
      <div className="absolute bottom-1/3 left-1/4 animate-pulse animation-delay-700">
        <Brain className="h-14 w-14 text-[#19334c]/20" />
      </div>
      
      <div className="relative z-10 w-full max-w-3xl bg-gradient-to-br from-[#19334c] to-[#12263d] rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm border border-white/10">
        <div className="p-12 text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-[rgba(199,121,20,.2)] p-4 rounded-full w-32 h-32 flex items-center justify-center">
              <div className="relative w-24 h-24">
                <Image
                  src="/img/logo.png"
                  alt="Logo de Mentalmente"
                  layout="fill"
                  objectFit="contain"
                  quality={100}
                  priority
                />
              </div>
            </div>
          </div>
          
          <h1 className="text-8xl font-bold text-white mb-6">404</h1>
          <h2 className="text-3xl font-bold text-white mb-8">Página no encontrada</h2>
          
          <p className="text-[#a0b1c5] mb-10 max-w-2xl mx-auto">
            Lo sentimos, la página que estás buscando no existe o ha sido movida. 
            Parece que te has perdido en el camino hacia el bienestar mental. 
            Por favor, verifica la URL o regresa a la página principal.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center bg-[#2a4b6c] hover:bg-[#1e3a5a] text-white font-medium py-3 px-6 rounded-full transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver atrás
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center bg-[#c77914] hover:bg-[#a56611] text-white font-medium py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <Home className="mr-2 h-5 w-5" />
              Volver al inicio
            </button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-[#2a4b6c]">
            <p className="text-sm text-[#a0b1c5]">
              Si crees que esto es un error, por favor contacta a nuestro equipo de soporte
            </p>
            <button 
              onClick={() => router.push('/contacto')}
              className="mt-2 text-[#c77914] hover:text-[#a56611] transition-colors font-medium"
            >
              Contactar soporte
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-[#a0b1c5] z-10">
        © {new Date().getFullYear()} Mentalmente. Todos los derechos reservados.
      </div>
      
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        .animation-delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
}