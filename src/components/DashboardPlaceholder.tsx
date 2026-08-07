'use client';

import Link from 'next/link';
import { ArrowLeft, BellRing, FileStack, LockKeyhole, Palette, ShieldCheck, SlidersHorizontal, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const content = {
  settings: {
    eyebrow: 'SISTEMA / CONFIGURACIÓN',
    title: 'Configuración',
    description: 'Centraliza preferencias operativas, seguridad, identidad visual y notificaciones del entorno clínico.',
    options: [
      { icon: SlidersHorizontal, title: 'Preferencias operativas', text: 'Ajusta parámetros generales para la experiencia de trabajo.' },
      { icon: ShieldCheck, title: 'Seguridad y acceso', text: 'Gestiona controles relacionados con sesión y protección de datos.' },
      { icon: BellRing, title: 'Notificaciones', text: 'Define qué alertas deben priorizarse dentro del panel.' },
      { icon: Palette, title: 'Experiencia visual', text: 'Mantén una interfaz consistente con la identidad de SanaTú.' },
    ],
  },
  templates: {
    eyebrow: 'SISTEMA / RECURSOS',
    title: 'Plantillas clínicas',
    description: 'Organiza formatos reutilizables para reducir tareas repetitivas sin sacrificar calidad documental.',
    options: [
      { icon: FileStack, title: 'Historia clínica', text: 'Estructuras base para registrar información de forma consistente.' },
      { icon: LockKeyhole, title: 'Consentimientos', text: 'Formatos controlados para procesos informados y trazables.' },
      { icon: Sparkles, title: 'Notas de evolución', text: 'Bloques editables para agilizar el seguimiento profesional.' },
      { icon: ShieldCheck, title: 'Documentos protegidos', text: 'Recursos preparados para flujos clínicos responsables.' },
    ],
  },
};

export default function DashboardPlaceholder({ type, backHref }: { type: keyof typeof content; backHref: string }) {
  const page = content[type];
  return (
    <main className="sanatu-simple-page">
      <motion.section className="sanatu-simple-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
        <Link href={backHref} className="text-link" style={{ marginBottom: 44 }}><ArrowLeft /> Volver al panel</Link>
        <small style={{ display: 'block', marginBottom: 14, color: 'var(--sanatu-olive)', letterSpacing: '.18em', fontSize: 9 }}>{page.eyebrow}</small>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
        <div className="simple-grid">
          {page.options.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.article key={option.title} className="simple-option" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 * index }}>
                <Icon />
                <h2>{option.title}</h2>
                <p>{option.text}</p>
              </motion.article>
            );
          })}
        </div>
      </motion.section>
    </main>
  );
}
