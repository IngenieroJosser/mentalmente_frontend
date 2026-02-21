// components/FullPageSpinner.tsx
import Image from 'next/image';

export default function FullPageSpinner() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-white to-[#f2f2f2]">
      {/* Logo con pulso sutil */}
      <div className="relative w-20 h-20 mb-6 animate-pulse-subtle">
        <Image
          src="/logo-sana-tu.png"
          alt="SanaTú Quingar"
          fill
          sizes="80px"
          className="object-contain"
          priority
        />
      </div>
      
      {/* Texto con efecto de aparición */}
      <div className="text-center space-y-3">
        <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-[#bec5a4]/30 to-transparent" />
        <p className="text-[#666666] font-light tracking-wide">
          Preparando tu espacio de bienestar
        </p>
        <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-[#bec5a4]/30 to-transparent" />
      </div>
      
      {/* Indicador de progreso sutil */}
      <div className="mt-8 w-48 h-1 bg-[#e0e0e0] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-transparent via-[#bec5a4] to-transparent animate-[shimmer_2s_infinite] w-1/2" />
      </div>
    </div>
  );
}