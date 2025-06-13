'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, UserCircle, Lock, ShieldCheck, HeartHandshake, Scale, Leaf, Star } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

// Tipo para los elementos flotantes
type FloatingElement = {
  type: string;
  icon: any;
  color: string;
  size: number;
  x: number;
  y: number;
  sizeActual: number;
  speedX: number;
  speedY: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  direction: number;
  rotation: number;
  rotationSpeed: number;
  pulseDirection: number;
};

export default function MentalmenteLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animación de elementos de salud mental que aparecen y desaparecen
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Función para establecer el tamaño del canvas
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize();
    
    // Tipos de elementos con sus propiedades
    const elementTypes = [
      { name: 'brain', icon: Brain, color: '#19334c', size: 40 },
      { name: 'heart', icon: HeartHandshake, color: '#c77914', size: 35 },
      { name: 'scale', icon: Scale, color: '#2a4b6c', size: 45 },
      { name: 'leaf', icon: Leaf, color: '#a56611', size: 30 },
      { name: 'star', icon: Star, color: '#c77914', size: 25 }
    ];
    
    const elements: FloatingElement[] = [];
    const maxElements = 12;
    
    // Crear elementos iniciales
    const createNewElement = () => {
      const type = elementTypes[Math.floor(Math.random() * elementTypes.length)];
      const alpha = Math.random() * 0.5 + 0.1;
      const life = Math.random() * 100 + 50;
      const maxLife = life * 2;
      
      elements.push({
        type: type.name,
        icon: type.icon,
        color: type.color,
        size: type.size,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        sizeActual: type.size,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        alpha,
        maxAlpha: alpha,
        life,
        maxLife,
        direction: Math.random() > 0.5 ? 1 : -1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.02 - 0.01,
        pulseDirection: 1
      });
    };
    
    for (let i = 0; i < maxElements; i++) {
      createNewElement();
    }
    
    const drawElement = (element: FloatingElement) => {
      const { type, x, y, sizeActual, alpha, rotation, color } = element;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;
      
      // Dibujar un círculo de fondo para el icono
      ctx.beginPath();
      ctx.arc(0, 0, sizeActual * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = `${color}20`; // Color con transparencia
      ctx.fill();
      
      // Dibujar el icono simbólico
      ctx.beginPath();
      
      // Cada tipo tiene un dibujo especial
      switch(type) {
        case 'brain':
          // Forma de cerebro
          ctx.moveTo(0, -15);
          ctx.bezierCurveTo(10, -20, 20, -15, 25, -10);
          ctx.bezierCurveTo(30, -5, 30, 5, 25, 10);
          ctx.bezierCurveTo(20, 15, 10, 20, 0, 20);
          ctx.bezierCurveTo(-10, 20, -20, 15, -25, 10);
          ctx.bezierCurveTo(-30, 5, -30, -5, -25, -10);
          ctx.bezierCurveTo(-20, -15, -10, -20, 0, -15);
          break;
          
        case 'heart':
          // Forma de corazón
          ctx.moveTo(0, -sizeActual/3);
          ctx.bezierCurveTo(
            sizeActual/2, -sizeActual/2,
            sizeActual, sizeActual/3,
            0, sizeActual/2
          );
          ctx.bezierCurveTo(
            -sizeActual, sizeActual/3,
            -sizeActual/2, -sizeActual/2,
            0, -sizeActual/3
          );
          break;
          
        case 'scale':
          // Forma de balanza
          ctx.moveTo(-15, 10);
          ctx.lineTo(15, 10);
          ctx.moveTo(0, 10);
          ctx.lineTo(0, -10);
          ctx.moveTo(-12.5, -10);
          ctx.lineTo(12.5, -10);
          ctx.arc(-12.5, -10, 4, 0, Math.PI * 2);
          ctx.arc(12.5, -10, 4, 0, Math.PI * 2);
          break;
          
        case 'leaf':
          // Forma de hoja
          ctx.moveTo(0, sizeActual/2);
          ctx.lineTo(0, -sizeActual/2);
          ctx.moveTo(0, -sizeActual/3);
          ctx.quadraticCurveTo(-sizeActual/2, -sizeActual/4, 0, sizeActual/3);
          ctx.moveTo(0, -sizeActual/3);
          ctx.quadraticCurveTo(sizeActual/2, -sizeActual/4, 0, sizeActual/3);
          break;
          
        case 'star':
          // Forma de estrella
          const spikes = 5;
          const outerRadius = sizeActual / 2;
          const innerRadius = outerRadius / 2;
          
          let rot = Math.PI / 2 * 3;
          let xPos = 0;
          let yPos = 0;
          
          for (let i = 0; i < spikes; i++) {
            xPos = Math.cos(rot) * outerRadius;
            yPos = Math.sin(rot) * outerRadius;
            ctx.lineTo(xPos, yPos);
            rot += Math.PI / spikes;
            
            xPos = Math.cos(rot) * innerRadius;
            yPos = Math.sin(rot) * innerRadius;
            ctx.lineTo(xPos, yPos);
            rot += Math.PI / spikes;
          }
          ctx.closePath();
          break;
      }
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    };
    
    const animate = () => {
      if (!ctx) return;
      
      // Fondo degradado
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0a1727');
      gradient.addColorStop(1, '#102235');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Actualizar y dibujar elementos
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        
        // Actualizar posición
        element.x += element.speedX;
        element.y += element.speedY;
        element.rotation += element.rotationSpeed;
        
        // Actualizar vida y alpha
        element.life--;
        
        if (element.life <= 0) {
          // Reiniciar elemento cuando se desvanece
          elements.splice(i, 1);
          createNewElement();
          continue;
        }
        
        // Efecto de pulso (cambio de tamaño)
        element.sizeActual += 0.05 * element.pulseDirection;
        if (element.sizeActual > element.size * 1.2 || element.sizeActual < element.size * 0.8) {
          element.pulseDirection *= -1;
        }
        
        // Calcular alpha basado en el ciclo de vida
        const halfLife = element.maxLife / 2;
        if (element.life > halfLife) {
          // Fase de desvanecimiento
          element.alpha = element.maxAlpha * (element.life - halfLife) / halfLife;
        } else {
          // Fase de aparición
          element.alpha = element.maxAlpha * (1 - element.life / halfLife);
        }
        
        // Rebotar en los bordes
        if (element.x < 0 || element.x > canvas.width) element.speedX *= -1;
        if (element.y < 0 || element.y > canvas.height) element.speedY *= -1;
        
        // Dibujar elemento
        drawElement(element);
      }
      
      // Dibujar conexiones entre elementos cercanos
      ctx.strokeStyle = 'rgba(199, 121, 20, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < elements.length; i++) {
        for (let j = i + 1; j < elements.length; j++) {
          const dx = elements[i].x - elements[j].x;
          const dy = elements[i].y - elements[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(elements[i].x, elements[i].y);
            ctx.lineTo(elements[j].x, elements[j].y);
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      setCanvasSize();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0a1727]">
      {/* Fondo con elementos de salud mental */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Degradado suave */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#19334c]/80 to-[#0a1727]/90" />
      
      {/* Elementos decorativos fijos */}
      <div className="absolute top-10 left-10 opacity-10">
        <Scale className="h-24 w-24 text-[#c77914]" strokeWidth={1} />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10">
        <Star className="h-24 w-24 text-[#c77914]" strokeWidth={1} />
      </div>
      
      <ToastContainer position="top-right" />
      
      <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm bg-white/5 border border-white/10">
        {/* Panel izquierdo - Bienvenida e ilustración */}
        <div className="w-full md:w-2/5 bg-gradient-to-br from-[#19334c] to-[#12263d] p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-8">
              <div className="bg-[rgba(199,121,20,.2)] p-3 rounded-xl mr-3 flex items-center justify-center">
                {/* Contenedor de imagen con tamaño fijo y calidad máxima */}
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
              <h1 className="text-3xl font-bold text-white font-serif tracking-tight">Mentalmente</h1>
            </div>
            
            <h2 className="text-2xl font-bold text-white mt-16 mb-6">Su espacio seguro para el bienestar mental</h2>
            <p className="text-[#a0b1c5] mb-8">
              Transformando vidas a través del cuidado especializado con altos estándares de calidad y ética profesional.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-[#c77914]/20 flex items-center justify-center">
                  <HeartHandshake className="h-6 w-6 text-[#c77914]" />
                </div>
                <div>
                  <p className="text-white font-medium">Atención personalizada</p>
                  <p className="text-[#a0b1c5] text-sm">Individual, parejas, familiar y grupal</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-[#c77914]/20 flex items-center justify-center">
                  <Scale className="h-6 w-6 text-[#c77914]" />
                </div>
                <div>
                  <p className="text-white font-medium">Ética profesional</p>
                  <p className="text-[#a0b1c5] text-sm">Cumplimos con los más altos estándares</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-[#c77914]/20 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-[#c77914]" />
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
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                <ShieldCheck className="h-5 w-5 text-[#c77914]" />
              </div>
              <p className="text-xs text-[#a0b1c5]">
                Tus datos están protegidos con los más altos estándares de confidencialidad y ética profesional
              </p>
            </div>
          </div>
        </div>
        
        {/* Panel derecho - Formulario de login */}
        <div className="w-full md:w-3/5 bg-white p-10">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="bg-[#19334c] p-2 rounded-full">
                <Lock className="h-6 w-6 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[#19334c] uppercase">Inicio de sesión</h2>
            <p className="text-[#6b7280] mt-2">Accede a tu espacio profesional seguro</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
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
              />
            </div>
            
            {/* Campo Contraseña */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#c77914]" />
              </div>
              <input
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#c77914]/50 focus:border-[#c77914] outline-none transition-all"
                placeholder="••••••••"
              />
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
            <div className="mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-xl font-medium text-white flex items-center justify-center transition-all duration-300 transform ${
                  isLoading ? 'bg-[#c77914]/80' : 'bg-[#c77914] hover:bg-[#a56611] hover:scale-[1.02] shadow-lg'
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
                    <svg 
                      className={`ml-2 h-5 w-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>
          
          {/* Solicitar acceso */}
          <div className="mt-10 pt-6 border-t border-gray-100 text-center">
            <p className="text-[#6b7280]">
              ¿Primera vez en Mentalmente?{' '}
              <button 
                onClick={handleRequestAccess}
                className="font-medium text-[#c77914] hover:text-[#a56611] transition-colors"
              >
                Solicita tu acceso profesional
              </button>
            </p>
          </div>
          
          {/* Sello de calidad */}
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center bg-[#f9fafb] px-4 py-2 rounded-full border border-[#e5e7eb]">
              <ShieldCheck className="h-4 w-4 text-[#c77914] mr-2" />
              <span className="text-xs text-[#6b7280]">Sistema certificado con estándares de calidad</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-[#a0b1c5] z-10">
        © {new Date().getFullYear()} Mentalmente. Todos los derechos reservados. Ética · Calidad · Confidencialidad
      </div>
    </div>
  );
}