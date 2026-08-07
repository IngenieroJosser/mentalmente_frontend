'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Compass, LockKeyhole } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#23270a] text-[#fefce9] relative flex items-center justify-center px-6 py-28">
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(254,252,233,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(254,252,233,.18)_1px,transparent_1px)] bg-[size:90px_90px]" />
      <motion.div
        className="absolute w-[62vw] max-w-[760px] aspect-square rounded-full border border-[#ebe0ae]/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 42, ease: 'linear', repeat: Infinity }}
      >
        <div className="absolute inset-[14%] rounded-full border border-dashed border-[#ebe0ae]/20" />
        <div className="absolute inset-[29%] rounded-full bg-[radial-gradient(circle,#858735_0%,#414719_52%,transparent_72%)] blur-sm" />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-4xl text-center"
      >
        <Link href="/" className="inline-flex items-center gap-3 mb-14" aria-label="Volver a SanaTú">
          <span className="relative block w-14 h-14"><Image src="/logo-sana-tu-icon.png" alt="SanaTú" fill sizes="56px" className="object-contain" priority /></span>
          <span className="text-sm tracking-[.18em] font-semibold">SANATÚ</span>
        </Link>

        <span className="text-[10px] tracking-[.28em] text-[#ebe0ae]">ERROR / 404</span>
        <h1 className="mt-6 text-[clamp(64px,13vw,180px)] leading-[.82] font-light tracking-[-.08em]">
          Esta ruta no<br /><em className="font-serif text-[#ebe0ae]">lleva a ningún lugar.</em>
        </h1>
        <p className="max-w-xl mx-auto mt-8 text-sm md:text-base leading-7 text-[#fefce9]/60">
          La página pudo cambiar de ubicación o ya no está disponible. Puedes regresar al inicio o entrar al sistema clínico.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="cinematic-button cinematic-button-primary"><ArrowLeft size={17} /> Volver al inicio</Link>
          <Link href="/login" className="cinematic-button cinematic-button-ghost"><LockKeyhole size={17} /> Acceso clínico</Link>
        </div>

        <div className="mt-20 pt-7 border-t border-[#fefce9]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] tracking-[.1em] text-[#fefce9]/40">
          <span className="inline-flex items-center gap-2"><Compass size={14} /> Quibdó · Chocó · Colombia</span>
          <a href="/#contacto" className="inline-flex items-center gap-2 text-[#ebe0ae]">Contactar a SanaTú <ArrowRight size={14} /></a>
        </div>
      </motion.section>
    </main>
  );
}
