import { useRef, useEffect, RefObject } from 'react';
import { FloatingElement } from "@/lib/type";
import { elementTypes } from '@/lib/constants';

export const useCanvasAnimation = (canvasRef: RefObject<HTMLCanvasElement | null>) => {
  const animationFrameRef = useRef<number | null>(null);
  const elementsRef = useRef<FloatingElement[]>([]);
  
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
    
    // Crear elementos iniciales
    const createNewElement = (): FloatingElement => {
      const type = elementTypes[Math.floor(Math.random() * elementTypes.length)];
      const alpha = Math.random() * 0.5 + 0.1;
      const life = Math.random() * 100 + 50;
      const maxLife = life * 2;
      
      return {
        type: type.name,
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
      };
    };
    
    // Inicializar elementos
    const maxElements = 12;
    elementsRef.current = [];
    for (let i = 0; i < maxElements; i++) {
      elementsRef.current.push(createNewElement());
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
      
      const elements = elementsRef.current;
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
          elements[i] = createNewElement();
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
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    const handleResize = () => {
      setCanvasSize();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [canvasRef]);
};