'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircle, Lock, ShieldCheck, HeartHandshake, Scale, Leaf, Star, Eye, EyeOff, ArrowRight, Brain, BrainCircuit } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function MentalmenteLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeField, setActiveField] = useState('');
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const { login } = useAuth();

  // Generate floating particles for background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Generate particles
    const particles: Array<{x: number, y: number, size: number, speed: number, color: string}> = [];
    const colors = ['#c77914', '#d98a2c', '#19334c', '#a56611', '#ffffff'];
    
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        // Update position
        particle.y -= particle.speed;
        
        // Reset particle if it goes off screen
        if (particle.y < -10) {
          particle.y = canvas.height + 10;
          particle.x = Math.random() * canvas.width;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
      });
      
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el inicio de sesión');
      }

      // Guardar token y datos de usuario
      login(data.token, data.user);

      // Redireccionar según el rol del usuario
      const redirectPath = getRedirectPathByRole(data.user.role);
      
      toast.success(`¡Bienvenido/a ${data.user.usuario} a Mentalmente!`, {
        onClose: () => router.push(redirectPath)
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error en el inicio de sesión';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para determinar la ruta de redirección según el rol
  const getRedirectPathByRole = (role: string) => {
    const normalizedRole = role.toUpperCase();
    
    switch(normalizedRole) {
      case 'PSYCHOLOGIST':
        return '/psychologist-dashboard';
      case 'MANAGEMENT':
        return '/management-dashboard';
      case 'USER':
        return '/reception-dashboard';
      default:
        return '/';
    }
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
      autoClose: 4000,
      theme: "colored"
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setTimeout(() => passwordRef.current?.focus(), 0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#0d1f33] to-[#07182a]">
      {/* Animated background */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-10"
      />
      
      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f33]/90 to-[#07182a]/90" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 opacity-10">
        <Brain className="h-32 w-32 text-[#c77914]" strokeWidth={1} />
      </div>
      <div className="absolute bottom-20 right-20 opacity-10">
        <BrainCircuit className="h-32 w-32 text-[#c77914]" strokeWidth={1} />
      </div>
      
      <ToastContainer position="top-right" />
      
      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm bg-white/5 border border-white/10">
        {/* Left panel - Welcome and illustration */}
        <div className="w-full lg:w-2/5 bg-gradient-to-br from-[#19334c] to-[#12263d] p-8 md:p-10 flex flex-col justify-between">
          <div>
            <div className="flex flex-col items-center mb-8">
              <div className="bg-gradient-to-br from-[#c77914] to-[#d98a2c] p-1 rounded-full mb-6">
                <div className="bg-[#19334c] p-3 rounded-full flex items-center justify-center border border-[#c77914]/30">
                  <div className="relative w-20 h-20">
                    <div className="rounded-xl w-full h-full flex items-center justify-center">
                      <Image
                      src="/img/logo.png"
                      alt="Mentalmente Logo"
                      layout="fill"
                      objectFit="contain"
                      quality={100}
                      priority
                      className="rounded-lg"
                    />
                    </div>
                  </div>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-white text-center mb-2">
                Mental<span className="text-[#c77914]">mente</span>
              </h1>
              <p className="text-[#a0b1c5] text-center">
                Psicología Clínica & Bienestar Mental
              </p>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-6 text-center">
              Su espacio seguro para el bienestar mental
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c77914]/20 to-[#d98a2c]/20 flex items-center justify-center flex-shrink-0">
                  <HeartHandshake className="h-6 w-6 text-[#c77914]" />
                </div>
                <div>
                  <p className="text-white font-medium">Atención personalizada</p>
                  <p className="text-[#a0b1c5] text-sm">Individual, parejas, familiar y grupal</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c77914]/20 to-[#d98a2c]/20 flex items-center justify-center flex-shrink-0">
                  <Scale className="h-6 w-6 text-[#c77914]" />
                </div>
                <div>
                  <p className="text-white font-medium">Ética profesional</p>
                  <p className="text-[#a0b1c5] text-sm">Cumplimos con los más altos estándares</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c77914]/20 to-[#d98a2c]/20 flex items-center justify-center flex-shrink-0">
                  <Leaf className="h-6 w-6 text-[#c77914]" />
                </div>
                <div>
                  <p className="text-white font-medium">Crecimiento personal</p>
                  <p className="text-[#a0b1c5] text-sm">Ayudamos a desarrollar tu mejor versión</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-[#12263d]/50 p-4 rounded-xl border border-[#c77914]/20">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                <ShieldCheck className="h-5 w-5 text-[#c77914]" />
              </div>
              <p className="text-sm text-[#a0b1c5]">
                Tus datos están protegidos con los más altos estándares de confidencialidad y ética profesional
              </p>
            </div>
          </div>
        </div>
        
        {/* Right panel - Login form */}
        <div className="w-full lg:w-3/5 bg-white p-6 md:p-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-[#19334c] to-[#12263d] p-3 rounded-full">
                <Lock className="h-6 w-6 text-white" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#19334c]">Acceso Profesional</h2>
            <p className="text-[#6b7280] mt-2">Ingresa a tu espacio de trabajo seguro</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email field */}
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform duration-300 ${activeField === 'email' ? 'text-[#c77914] translate-y-1' : 'text-gray-400'}`}>
                <UserCircle className="h-5 w-5" />
              </div>
              <input
                type="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                onFocus={() => setActiveField('email')}
                onBlur={() => setActiveField('')}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c77914]/50 focus:border-[#c77914] outline-none transition-all bg-white text-gray-800 placeholder-gray-500"
                placeholder="correo@mentalmente.com"
                autoComplete="username"
              />
              <div className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#c77914] to-[#d98a2c] transition-all duration-500 ${activeField === 'email' ? 'w-full' : ''}`}></div>
            </div>
            
            {/* Password field */}
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform duration-300 ${activeField === 'password' ? 'text-[#c77914] translate-y-1' : 'text-gray-400'}`}>
                <Lock className="h-5 w-5" />
              </div>
              <input
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                required
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                onFocus={() => setActiveField('password')}
                onBlur={() => setActiveField('')}
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c77914]/50 focus:border-[#c77914] outline-none transition-all bg-white text-gray-800 placeholder-gray-500"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#c77914] transition-colors"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              <div className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#c77914] to-[#d98a2c] transition-all duration-500 ${activeField === 'password' ? 'w-full' : ''}`}></div>
            </div>
            
            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-sm border border-gray-300 flex items-center justify-center transition-colors ${rememberMe ? 'bg-[#c77914] border-[#c77914]' : 'bg-white'}`}>
                    {rememberMe && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-[#4b5563] cursor-pointer select-none">
                    Recordar mi sesión
                  </label>
                </div>
              </div>
              <button 
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-[#c77914] hover:text-[#a56611] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            
            {/* Login button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-xl font-medium text-white flex items-center justify-center transition-all duration-300 overflow-hidden relative ${
                  isLoading 
                    ? 'bg-[#c77914]/80' 
                    : 'bg-gradient-to-r from-[#c77914] to-[#d98a2c] hover:from-[#a56611] hover:to-[#c77914] hover:shadow-lg'
                }`}
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
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                )}
                
                {/* Button hover effect */}
                <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
              </button>
            </div>
          </form>
          
          {/* Request access */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-[#6b7280]">
              ¿Primera vez en Mentalmente?{' '}
              <button 
                onClick={handleRequestAccess}
                className="font-medium text-[#c77914] hover:text-[#a56611] transition-colors flex items-center justify-center mx-auto group"
              >
                Solicita tu acceso profesional
                <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </p>
          </div>
          
          {/* Quality seal */}
          <div className="mt-6 flex items-center justify-center">
            <div className="flex items-center bg-gradient-to-r from-[#f9fafb] to-[#f0f5ff] px-4 py-2 rounded-full border border-[#e5e7eb] shadow-sm">
              <ShieldCheck className="h-4 w-4 text-[#c77914] mr-2" />
              <span className="text-xs text-[#6b7280]">Sistema certificado con estándares de calidad</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-10 right-10 opacity-20">
        <Leaf className="h-16 w-16 text-[#c77914]" strokeWidth={1} />
      </div>
      <div className="absolute bottom-10 left-10 opacity-20">
        <Star className="h-16 w-16 text-[#c77914]" strokeWidth={1} />
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-[#a0b1c5]/70 z-10 px-4">
        © {new Date().getFullYear()} Mentalmente. Todos los derechos reservados. Ética · Calidad · Confidencialidad
      </div>
    </div>
  );
}