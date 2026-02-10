import { motion } from "framer-motion";
import Image from "next/image";

export default function SpinnerPDF() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[rgba(0,0,0,0.5)] backdrop-blur-md">
      {/* Animated Orbital System */}
      <div className="relative mb-8 w-44 h-44">
        {/* Outer orbit - verde claro */}
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-[#bec5a4]/30"
          animate={{ 
            rotate: 360,
          }}
          transition={{ 
            duration: 12, 
            ease: "linear",
            repeat: Infinity
          }}
        >
          <motion.div 
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#bec5a4] shadow-[0_0_15px_3px_rgba(190,197,164,0.7)]"
            animate={{
              rotate: -360
            }}
            transition={{
              duration: 12,
              ease: "linear",
              repeat: Infinity
            }}
          />
        </motion.div>
        
        {/* Middle orbit - verde claro más oscuro */}
        <motion.div 
          className="absolute inset-4 rounded-full border-2 border-[#9fa68c]/30"
          animate={{ 
            rotate: -360,
          }}
          transition={{ 
            duration: 8, 
            ease: "linear",
            repeat: Infinity
          }}
        >
          <motion.div 
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#9fa68c] shadow-[0_0_10px_3px_rgba(159,166,140,0.7)]"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 8,
              ease: "linear",
              repeat: Infinity
            }}
          />
        </motion.div>
        
        {/* Inner orbit - blend */}
        <motion.div 
          className="absolute inset-8 rounded-full border-2 border-[#bec5a4]/20"
          animate={{ 
            rotate: 360,
          }}
          transition={{ 
            duration: 6, 
            ease: "linear",
            repeat: Infinity
          }}
        >
          <motion.div 
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#bec5a4] to-[#8e957a] shadow-[0_0_8px_2px_rgba(190,197,164,0.5)]"
            animate={{
              rotate: -360
            }}
            transition={{
              duration: 6,
              ease: "linear",
              repeat: Infinity
            }}
          />
        </motion.div>
        
        {/* Central logo with gradient glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-16 h-16 z-10">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#bec5a4] to-[#8e957a] animate-pulse opacity-80 blur-sm" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/logo-sana-tu.png"
                alt="SanaTú Quingar"
                width={64}
                height={64}
                className="object-contain opacity-90"
                priority
              />
            </div>
          </div>
        </div>
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#bec5a4]"
            style={{
              top: `${Math.sin((i * Math.PI) / 4) * 40 + 50}%`,
              left: `${Math.cos((i * Math.PI) / 4) * 40 + 50}%`,
              transform: 'translate(-50%, -50%)'
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
      
      {/* Animated text */}
      <div className="mt-6 text-center max-w-md">
        <motion.p 
          className="text-xl font-light text-slate-100 tracking-wide"
          animate={{ 
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity 
          }}
        >
          Generando PDF
          <motion.span
            animate={{ 
              opacity: [0, 1, 0],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatDelay: 0.5
            }}
          >
            ...
          </motion.span>
        </motion.p>
        
        <motion.p 
          className="mt-4 text-slate-300 text-sm font-medium tracking-wider"
          animate={{ 
            y: [0, -3, 0],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          SanaTú Quingar - Transformando vidas
        </motion.p>
        
        {/* Subtle brand gradient line */}
        <motion.div 
          className="mt-4 mx-auto h-0.5 w-32 rounded-full bg-gradient-to-r from-transparent via-[#bec5a4] to-transparent"
          animate={{ 
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
};