'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const dots = Array.from({ length: 10 }, (_, index) => ({
  angle: index * 36,
  delay: index * 0.08,
}));

export default function FullPageSpinner() {
  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center overflow-hidden bg-[#23270a] text-[#fefce9]">
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(254,252,233,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(254,252,233,.16)_1px,transparent_1px)] bg-[size:82px_82px]" />
      <motion.div
        className="absolute w-[min(82vw,680px)] aspect-square rounded-full border border-[#ebe0ae]/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-[14%] rounded-full border border-dashed border-[#ebe0ae]/15" />
        <div className="absolute inset-[29%] rounded-full border border-[#fefce9]/10" />
      </motion.div>

      <div className="relative flex flex-col items-center">
        <div className="relative w-44 h-44 grid place-items-center">
          <motion.div
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_28%,#fefce9_0%,#858735_34%,#414719_70%,#23270a_100%)] shadow-[0_0_90px_rgba(198,185,118,.26)]"
            animate={{ scale: [0.96, 1.04, 0.96], rotate: [0, 8, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="relative w-24 h-24 overflow-hidden rounded-full bg-[#fefce9]/90 shadow-2xl">
            <Image src="/logo-sana-tu-icon.png" alt="SanaTú" fill sizes="96px" className="object-contain" priority />
          </div>
          {dots.map(({ angle, delay }) => (
            <motion.span
              key={angle}
              className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-[#ebe0ae]"
              style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-104px)` }}
              animate={{ opacity: [0.15, 1, 0.15], scale: [0.7, 1.35, 0.7] }}
              transition={{ duration: 1.6, repeat: Infinity, delay }}
            />
          ))}
        </div>

        <motion.p
          className="mt-10 text-[10px] tracking-[.28em] uppercase text-[#ebe0ae]"
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          Preparando tu experiencia
        </motion.p>
        <p className="mt-3 text-xs text-[#fefce9]/40">SanaTú · Orientación Psicológica</p>
      </div>
    </div>
  );
}
