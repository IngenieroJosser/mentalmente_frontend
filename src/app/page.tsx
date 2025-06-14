'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircle, Lock, ShieldCheck, HeartHandshake, Scale, Leaf, Star, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { useCanvasAnimation } from '@/hooks/useCanvasAnimation';

export default function MentalmenteLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Usar el hook de animación del canvas
  useCanvasAnimation(canvasRef);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulación de autenticación
    setTimeout(() => {
      setIsLoading(false);
      
      // Mostrar notificación de éxito
      toast.success('¡Bienvenido a Mentalmente! Redirigiendo a su espacio seguro...', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        onClose: () => router.push('/dashboard')
      });
    }, 1500);
  };

  const handleForgotPassword = () => {
    toast.info('Se ha enviado un enlace de recuperación a tu correo electrónico', {
      position: "top-center",
      autoClose: 3000,
      theme: "colored"
    });
  };

  const handleRequestAccess = () => {
    toast.info('Contacta al administrador para obtener acceso a nuestro sistema', { 
      position: 'top-center',
      autoClose: 4000
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    // Enfocar el campo de contraseña después de cambiar la visibilidad
    setTimeout(() => passwordRef.current?.focus(), 0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#f0f7ff] to-[#0d1f33]">
      {/* Fondo con elementos de salud mental */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Degradado suave */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff]/70 to-[#0d1f33]/90" />
      
      {/* Elementos decorativos fijos */}
      <div className="absolute top-10 left-10 opacity-15">
        <Scale className="h-24 w-24 text-[#c77914]" strokeWidth={1} />
      </div>
      <div className="absolute bottom-10 right-10 opacity-15">
        <Star className="h-24 w-24 text-[#c77914]" strokeWidth={1} />
      </div>
      
      <ToastContainer position="top-right" />
      
      <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm bg-white/5 border border-white/10">
        {/* Panel izquierdo - Bienvenida e ilustración */}
        <div className="w-full md:w-2/5 bg-gradient-to-br from-[#19334c] to-[#12263d] p-8 md:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-center mb-8">
              <div className="bg-[#19334c] p-3 rounded-xl flex items-center justify-center border border-[#c77914]/30">
                <div className="relative w-24 h-24">
                  <Image
                    src="/img/logo.png"
                    alt="Logo de Mentalmente"
                    layout="fill"
                    objectFit="contain"
                    quality={100}
                    priority
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-6 text-center md:text-left">
              Su espacio seguro para el bienestar mental
            </h2>
            <p className="text-[#a0b1c5] mb-8 text-center md:text-left">
              Transformando vidas a través del cuidado especializado con altos estándares de calidad y ética profesional.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#c77914]/20 flex items-center justify-center">
                  <HeartHandshake className="h-5 w-5 md:h-6 md:w-6 text-[#c77914]" />
                </div>
                <div>
                  <p className="text-white font-medium">Atención personalizada</p>
                  <p className="text-[#a0b1c5] text-sm">Individual, parejas, familiar y grupal</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#c77914]/20 flex items-center justify-center">
                  <Scale className="h-5 w-5 md:h-6 md:w-6 text-[#c77914]" />
                </div>
                <div>
                  <p className="text-white font-medium">Ética profesional</p>
                  <p className="text-[#a0b1c5] text-sm">Cumplimos con los más altos estándares</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#c77914]/20 flex items-center justify-center">
                  <Leaf className="h-5 w-5 md:h-6 md:w-6 text-[#c77914]" />
                </div>
                <div>
                  <p className="text-white font-medium">Crecimiento personal</p>
                  <p className="text-[#a0b1c5] text-sm">Ayudamos a desarrollar tu mejor versión</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="flex items-center">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                <ShieldCheck className="h-4 w-4 md:h-5 md:w-5 text-[#c77914]" />
              </div>
              <p className="text-xs text-[#a0b1c5]">
                Tus datos están protegidos con los más altos estándares de confidencialidad y ética profesional
              </p>
            </div>
          </div>
        </div>
        
        {/* Panel derecho - Formulario de login */}
        <div className="w-full md:w-3/5 bg-white p-6 md:p-10">
          <div className="text-center mb-8 md:mb-10">
            <div className="flex justify-center mb-4">
              <div className="bg-[#19334c] p-2 rounded-full">
                <Lock className="h-6 w-6 text-white" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#19334c] uppercase">Inicio de sesión</h2>
            <p className="text-[#6b7280] mt-2">Accede a tu espacio profesional seguro</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5 md:space-y-6">
            {/* Campo Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCircle className="h-5 w-5 text-[#c77914]" />
              </div>
              <input
                type="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c77914]/50 focus:border-[#c77914] outline-none transition-all"
                placeholder="correo@mentalmente.com"
                autoComplete="username"
              />
            </div>
            
            {/* Campo Contraseña con visibilidad */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#c77914]" />
              </div>
              <input
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                required
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c77914]/50 focus:border-[#c77914] outline-none transition-all"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6b7280] hover:text-[#c77914] transition-colors"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            
            {/* Opciones adicionales */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-[#c77914] focus:ring-[#c77914] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#4b5563]">
                  Recordar mi sesión
                </label>
              </div>
              <button 
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-[#c77914] hover:text-[#a56611] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            
            {/* Botón de Login */}
            <div className="mt-6 md:mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 md:py-4 px-6 rounded-xl font-medium text-white flex items-center justify-center transition-all duration-300 transform ${
                  isLoading ? 'bg-[#c77914]/80' : 'bg-gradient-to-r from-[#c77914] to-[#d98a2c] hover:from-[#a56611] hover:to-[#c77914] hover:scale-[1.02] shadow-lg'
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verificando credenciales...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Acceso Seguro
                    <ArrowRight 
                      className={`ml-2 h-5 w-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} 
                    />
                  </span>
                )}
              </button>
            </div>
          </form>
          
          {/* Solicitar acceso */}
          <div className="mt-8 pt-5 border-t border-gray-100 text-center">
            <p className="text-[#6b7280]">
              ¿Primera vez en Mentalmente?{' '}
              <button 
                onClick={handleRequestAccess}
                className="font-medium text-[#c77914] hover:text-[#a56611] transition-colors flex items-center justify-center mx-auto"
              >
                Solicita tu acceso profesional
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </p>
          </div>
          
          {/* Sello de calidad */}
          <div className="mt-6 flex items-center justify-center">
            <div className="flex items-center bg-[#f9fafb] px-4 py-2 rounded-full border border-[#e5e7eb]">
              <ShieldCheck className="h-4 w-4 text-[#c77914] mr-2" />
              <span className="text-xs text-[#6b7280]">Sistema certificado con estándares de calidad</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-[#a0b1c5] z-10 px-4">
        © {new Date().getFullYear()} Mentalmente. Todos los derechos reservados. Ética · Calidad · Confidencialidad
      </div>
    </div>
  );
}