import Image from 'next/image';

export default function Spinner() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a1727]/95 backdrop-blur-sm transition-opacity duration-300 ease-out">
      {/* Simplificar contenedor de animación */}
      <div className="relative mb-8 w-32 h-32">
        {/* Anillo exterior */}
        <div className="absolute inset-0 border-4 border-transparent border-t-amber-400 border-r-amber-400 rounded-full animate-[spin_3s_linear_infinite] shadow-lg shadow-amber-400/30" />
        
        {/* Anillo interior */}
        <div className="absolute inset-0 m-4 border-4 border-transparent border-b-blue-700 border-l-blue-700 rounded-full animate-[spinReverse_4s_linear_infinite] shadow-inner shadow-blue-700/30" />
        
        {/* Globo optimizado */}
        <div className="absolute inset-0 m-6 rounded-full bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-slate-500/30" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-slate-500/30" />
        </div>
        
        {/* Logo con carga eficiente */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-14 h-14 animate-pulse">
            <Image
              src="/img/logo.png"
              alt="Mentalmente"
              fill
              sizes="56px"
              className="object-contain opacity-90"
              priority
            />
          </div>
        </div>
      </div>

      {/* Texto optimizado */}
      <div className="mt-6 text-center">
        <p className="text-slate-200 text-lg font-light tracking-wide">
          <span className="inline-block animate-wave">Cargando tu experiencia</span>
        </p>
        <p className="mt-2 text-slate-500 text-sm font-medium">
          Mentalmente - Transformando vidas
        </p>
      </div>
    </div>
  );
}