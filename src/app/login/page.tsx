'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircle, Lock, ShieldCheck, ArrowRight, Eye, EyeOff, Brain, Heart } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

export default function SanatuLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeField, setActiveField] = useState('');
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles: Array<{x: number, y: number, size: number, speed: number}> = [];
    
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.3 + 0.05
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        particle.y -= particle.speed;
        
        if (particle.y < -10) {
          particle.y = canvas.height + 10;
          particle.x = Math.random() * canvas.width;
        }
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = '#bec5a4';
        ctx.globalAlpha = 0.1;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const getRedirectPathByRole = (role: string) => {
    console.log('DEBUG - Role recibido:', role);
    if (!role) return '/dashboard';
    
    const normalizedRole = role.toString().toUpperCase().trim();
    console.log('DEBUG - Role normalizado:', normalizedRole);
    
    switch(normalizedRole) {
      case 'PSYCHOLOGIST':
        return '/psychologist-dashboard';
      case 'MANAGEMENT':
        return '/management-dashboard';
      case 'USER':
        return '/reception-dashboard';
      default:
        console.warn(`Role desconocido: ${normalizedRole}`);
        return '/dashboard';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      toast.error('Por favor completa todos los campos');
      return;
    }
  
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Error en el inicio de sesión');
      }
  
      if (!data.success || !data.token || !data.user) {
        throw new Error('Estructura de respuesta inválida');
      }
  
      console.log('Login exitoso - Usuario:', data.user);
      console.log('Rol:', data.user.role);

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('sanatu_token', data.token);
      storage.setItem('sanatu_user', JSON.stringify(data.user));
      
      toast.success(`¡Bienvenido/a ${data.user.usuario} a SanaTú!`, {
        position: "top-center",
        autoClose: 1500
      });

      const redirectPath = getRedirectPathByRole(data.user.role);
      console.log('Redirigiendo a:', redirectPath);

      setTimeout(() => {
        try {
          router.push(redirectPath);
        } catch (routerError) {
          console.error('Error con router.push, usando window.location:', routerError);
          window.location.href = redirectPath;
        }
      }, 1500);
      
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error en el inicio de sesión';
      toast.error(errorMessage, { position: "top-center", autoClose: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setTimeout(() => passwordRef.current?.focus(), 0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-white">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50/30" />
      <div className="absolute top-10 left-10 opacity-5">
        <Brain className="h-24 w-24 text-[#bec5a4]" strokeWidth={1} />
      </div>
      <div className="absolute bottom-10 right-10 opacity-5">
        <Heart className="h-24 w-24 text-[#bec5a4]" strokeWidth={1} />
      </div>
      
      <ToastContainer position="top-center" autoClose={5000} />
      
      <div className="relative z-10 w-full max-w-4xl flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white">
        {/* Panel izquierdo */}
        <div className="w-full lg:w-1/2 p-8 md:p-10 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50/50">
          <div>
            <div className="flex flex-col items-center mb-8">
              <div className="mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#bec5a4]/20 to-[#bec5a4]/10 flex items-center justify-center border border-[#bec5a4]/20">
                  <div className="relative w-16 h-16">
                    <Image
                      src="/logo-sana-tu.png"
                      alt="SanaTú Logo"
                      fill
                      sizes="64px"
                      className="object-contain"
                      priority
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `
                          <div class="w-16 h-16 flex items-center justify-center">
                            <span class="text-[#bec5a4] text-2xl font-light">SQ</span>
                          </div>
                        `;
                      }}
                    />
                  </div>
                </div>
              </div>
              <h1 className="text-2xl font-light text-gray-900 text-center mb-2">
                Sana<span className="text-[#bec5a4]">Tú</span> Quingar
              </h1>
              <p className="text-gray-500 text-sm text-center font-light">
                Psicología & Bienestar Integral
              </p>
            </div>
            
            <div className="mt-10">
              <div className="flex items-center justify-center mb-8">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300" />
                <span className="mx-4 text-sm text-gray-500 font-light tracking-wider">
                  Espacio Profesional
                </span>
                <div className="h-px w-12 bg-gradient-to-r from-gray-300 to-transparent" />
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-[#bec5a4]" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-light">Atención Humanizada</p>
                    <p className="text-gray-500 text-sm font-light">Enfoque personalizado</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-[#bec5a4]" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-light">Ética Profesional</p>
                    <p className="text-gray-500 text-sm font-light">Confidencialidad garantizada</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-100">
            <div className="flex items-center">
              <ShieldCheck className="h-4 w-4 text-[#bec5a4] mr-3" />
              <p className="text-sm text-gray-500 font-light">
                Sistema seguro con encriptación de datos
              </p>
            </div>
          </div>
        </div>
        
        {/* Panel derecho */}
        <div className="w-full lg:w-1/2 p-8 md:p-10 bg-white">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#bec5a4]/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-[#bec5a4]" />
              </div>
            </div>
            <h2 className="text-2xl font-light text-gray-900">Acceso Profesional</h2>
            <p className="text-gray-500 font-light mt-2">Ingresa a tu cuenta segura</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all ${
                activeField === 'email' ? 'text-[#bec5a4]' : 'text-gray-400'
              }`}>
                <UserCircle className="h-5 w-5" />
              </div>
              <input
                type="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                onFocus={() => setActiveField('email')}
                onBlur={() => setActiveField('')}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-[#bec5a4] focus:ring-1 focus:ring-[#bec5a4]/30 outline-none transition-all bg-white text-gray-800 placeholder-gray-400 font-light"
                placeholder="correo@sanatuquingar.com"
                autoComplete="username"
              />
            </div>
            
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all ${
                activeField === 'password' ? 'text-[#bec5a4]' : 'text-gray-400'
              }`}>
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
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:border-[#bec5a4] focus:ring-1 focus:ring-[#bec5a4]/30 outline-none transition-all bg-white text-gray-800 placeholder-gray-400 font-light"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#bec5a4] transition-colors"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border border-gray-300 flex items-center justify-center transition-colors ${
                    rememberMe ? 'bg-[#bec5a4] border-[#bec5a4]' : 'bg-white'
                  }`}>
                    {rememberMe && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 font-light cursor-pointer select-none">
                    Recordar sesión
                  </label>
                </div>
              </div>
              <button type="button" className="text-sm font-light text-[#bec5a4] hover:text-[#a0a78c] transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg font-light text-white flex items-center justify-center transition-all ${
                isLoading ? 'bg-[#bec5a4]/80 cursor-not-allowed' : 'bg-[#bec5a4] hover:bg-[#a0a78c]'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                <span className="flex items-center">
                  Acceder
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-[#bec5a4]" />
              <span className="text-xs text-gray-400 font-light">Sistema seguro y confidencial</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-400 font-light px-4">
        © {new Date().getFullYear()} SanaTú Quingar. Todos los derechos reservados.
      </div>
    </div>
  );
}