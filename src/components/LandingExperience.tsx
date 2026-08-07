'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  Brain,
  Check,
  ChevronDown,
  HeartHandshake,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
} from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useRef, useState } from 'react';

const WA_NUMBER = '573113266223';
const WA_MESSAGE = encodeURIComponent('Hola Psic. Liyiveth, vi tu página y quiero agendar mi cita.');
const whatsappUrl = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

const navItems = [
  ['Inicio', '#inicio'],
  ['Sobre mí', '#sobre-mi'],
  ['Orientación', '#ayuda'],
  ['Metodología', '#metodologia'],
  ['Preguntas', '#faq'],
] as const;

const services = [
  {
    number: '01',
    icon: HeartHandshake,
    title: 'Orientación psicológica',
    text: 'Un espacio confidencial para comprender lo que estás viviendo y construir herramientas prácticas para afrontarlo.',
  },
  {
    number: '02',
    icon: UsersRound,
    title: 'Talleres y psicoeducación',
    text: 'Experiencias para grupos, familias y organizaciones enfocadas en prevención, autocuidado y bienestar emocional.',
  },
  {
    number: '03',
    icon: Brain,
    title: 'Primeros auxilios psicológicos',
    text: 'Acompañamiento inicial y responsable ante situaciones de crisis, con escucha activa y orientación clara.',
  },
];

const process = [
  ['Escuchamos', 'Comprendemos tu contexto sin juicios ni respuestas prefabricadas.'],
  ['Comprendemos', 'Identificamos emociones, patrones y necesidades que requieren atención.'],
  ['Construimos', 'Definimos recursos y acciones realistas que puedas integrar a tu vida.'],
  ['Acompañamos', 'Revisamos el proceso con ética, cercanía y respeto por tu ritmo.'],
];

const faqs = [
  ['¿La orientación es confidencial?', 'Sí. La información se maneja bajo principios éticos y de confidencialidad profesional, dentro de los límites establecidos por la ley.'],
  ['¿La atención puede ser virtual?', 'Sí. SanaTú ofrece orientación virtual y atención domiciliaria según disponibilidad y características del caso.'],
  ['¿Necesito estar en crisis para pedir ayuda?', 'No. También puedes solicitar orientación para fortalecer tu bienestar, tomar decisiones o comprender mejor una situación emocional.'],
  ['¿Cómo agendo?', 'Puedes iniciar la conversación por WhatsApp. Allí se valida disponibilidad, modalidad y la información básica de la cita.'],
];

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand-mark">
      <span className={`brand-mark-image ${compact ? 'brand-mark-image-compact' : ''}`}>
        <Image src="/logo-sana-tu-icon.png" alt="SanaTú" fill sizes={compact ? '42px' : '58px'} priority />
      </span>
      <span className="brand-mark-copy">
        <strong>SANATÚ</strong>
        <small>Bienestar psicológico</small>
      </span>
    </span>
  );
}

function PrimaryButton({ children, href = whatsappUrl }: { children: React.ReactNode; href?: string }) {
  return (
    <motion.a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="cinematic-button cinematic-button-primary"
    >
      <span>{children}</span>
      <ArrowRight size={18} />
    </motion.a>
  );
}

export default function LandingExperience() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [storyIndex, setStoryIndex] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });
  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ['start start', 'end end'],
  });

  const orbScale = useTransform(heroProgress, [0, 0.35, 0.72, 1], [0.72, 1.12, 2.25, 3.8]);
  const orbRotate = useTransform(heroProgress, [0, 1], [0, 145]);
  const orbY = useTransform(heroProgress, [0, 0.55, 1], ['4vh', '-3vh', '-17vh']);
  const heroCopyY = useTransform(heroProgress, [0, 0.55], [0, -90]);
  const heroCopyOpacity = useTransform(heroProgress, [0, 0.38, 0.62], [1, 1, 0]);
  const secondCopyOpacity = useTransform(heroProgress, [0.42, 0.65, 0.92], [0, 1, 0]);
  const secondCopyY = useTransform(heroProgress, [0.42, 0.72], [60, 0]);
  const backgroundLight = useTransform(heroProgress, [0, 0.55, 1], [0.25, 0.7, 0.16]);

  const smoothStory = useSpring(storyProgress, { stiffness: 90, damping: 28, mass: 0.4 });
  const storyImageScale = useTransform(smoothStory, [0, 1], [1.12, 1]);
  const storyImageY = useTransform(smoothStory, [0, 1], ['4%', '-4%']);

  useMotionValueEvent(storyProgress, 'change', (value) => {
    const next = Math.min(process.length - 1, Math.floor(value * process.length));
    setStoryIndex(next);
  });

  return (
    <main className="cinematic-site">
      <header className="cinematic-nav">
        <a href="#inicio" aria-label="Ir al inicio"><BrandMark compact /></a>
        <nav className="cinematic-nav-links" aria-label="Navegación principal">
          {navItems.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <div className="cinematic-nav-actions">
          <Link href="/login" className="cinematic-login-link"><LockKeyhole size={15} /> Acceso clínico</Link>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="cinematic-nav-cta">Agendar</a>
          <button type="button" className="cinematic-menu-button" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">
            <span /><span />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="cinematic-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="cinematic-menu-panel" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}>
              <button onClick={() => setMenuOpen(false)} aria-label="Cerrar menú"><X /></button>
              <BrandMark />
              <nav>
                {navItems.map(([label, href], index) => (
                  <motion.a key={href} href={href} onClick={() => setMenuOpen(false)} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.08 * index }}>
                    <small>0{index + 1}</small>{label}<ArrowRight />
                  </motion.a>
                ))}
              </nav>
              <PrimaryButton>Agenda tu orientación</PrimaryButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section id="inicio" ref={heroRef} className="cinematic-hero-track">
        <div className="cinematic-hero-sticky">
          <motion.div className="cinematic-hero-glow" style={{ opacity: backgroundLight }} />
          <div className="cinematic-grid" />

          <motion.div className="mind-orb-wrap" style={{ scale: orbScale, rotate: orbRotate, y: orbY }}>
            <div className="mind-orb-halo mind-orb-halo-one" />
            <div className="mind-orb-halo mind-orb-halo-two" />
            <div className="mind-orb">
              <div className="mind-orb-core">
                <Image src="/logo-sana-tu-icon.png" alt="" fill sizes="360px" className="mind-orb-logo" priority />
              </div>
              <span className="orbital-line orbital-line-one" />
              <span className="orbital-line orbital-line-two" />
              <span className="orbital-dot orbital-dot-one" />
              <span className="orbital-dot orbital-dot-two" />
            </div>
          </motion.div>

          <motion.div className="hero-copy hero-copy-primary" style={{ y: heroCopyY, opacity: heroCopyOpacity }}>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="eyebrow">
              <Sparkles size={15} /> Orientación psicológica humana y responsable
            </motion.div>
            <h1>Lo que sientes<br /><em>también merece espacio.</em></h1>
            <p>Te acompañamos a comprender tus emociones, fortalecer tus recursos y afrontar tus procesos con mayor claridad.</p>
            <div className="hero-actions">
              <PrimaryButton>Agenda tu orientación</PrimaryButton>
              <a href="#sobre-mi" className="cinematic-button cinematic-button-ghost">Conoce el enfoque <ArrowDown size={17} /></a>
            </div>
          </motion.div>

          <motion.div className="hero-copy hero-copy-secondary" style={{ opacity: secondCopyOpacity, y: secondCopyY }}>
            <span className="hero-index">SANATÚ / 01</span>
            <h2>No necesitas tener todas las respuestas para comenzar.</h2>
            <p>Solo necesitas un espacio seguro para mirar lo que está pasando, nombrarlo y avanzar a tu propio ritmo.</p>
          </motion.div>

          <div className="hero-side-note hero-side-note-left">QUINGAR · CHOCÓ · COLOMBIA</div>
          <div className="hero-side-note hero-side-note-right">DESLIZA PARA EXPLORAR</div>
          <div className="scroll-cue"><span /><small>SCROLL</small></div>
        </div>
      </section>

      <section id="sobre-mi" className="cinematic-about">
        <div className="section-heading">
          <span>02 / SOBRE MÍ</span>
          <h2>La escucha clínica puede ser rigurosa<br />sin dejar de ser <em>profundamente humana.</em></h2>
        </div>
        <div className="about-grid">
          <motion.div className="about-portrait" initial={{ clipPath: 'inset(12% 12% 12% 12% round 40px)' }} whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 28px)' }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}>
            <Image src="/fondo-bg.jpeg" alt="Liyiveth Quintero García, psicóloga" fill sizes="(max-width: 900px) 100vw, 52vw" />
            <div className="portrait-overlay" />
            <div className="portrait-caption"><span>Psicóloga</span><strong>Liyiveth Quintero García</strong></div>
          </motion.div>
          <div className="about-copy">
            <div className="about-monogram">LQ</div>
            <p className="about-lead">Acompaño procesos de bienestar emocional desde la empatía, la ética profesional y herramientas psicológicas aplicables a la vida real.</p>
            <p>Mi propósito no es decirte cómo vivir. Es ayudarte a comprender mejor lo que sientes, reconocer tus recursos y tomar decisiones con mayor claridad y autonomía.</p>
            <div className="about-signals">
              <span><ShieldCheck /> Confidencialidad</span>
              <span><HeartHandshake /> Trato humano</span>
              <span><Brain /> Criterio profesional</span>
            </div>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-link">Hablar con Liyiveth <ArrowRight /></a>
          </div>
        </div>
      </section>

      <section id="ayuda" className="services-section">
        <div className="section-heading section-heading-light">
          <span>03 / CÓMO PUEDO AYUDARTE</span>
          <h2>Intervenciones claras para momentos<br />que pueden sentirse <em>complejos.</em></h2>
        </div>
        <div className="service-stack">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article key={service.number} className="service-card" initial={{ opacity: 0, y: 80, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.75, delay: index * 0.08 }}>
                <div className="service-number">{service.number}</div>
                <div className="service-icon"><Icon /></div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <a href={whatsappUrl} target="_blank" rel="noreferrer">Consultar <ArrowRight /></a>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="metodologia" ref={storyRef} className="method-track">
        <div className="method-sticky">
          <motion.div className="method-image" style={{ scale: storyImageScale, y: storyImageY }}>
            <Image src="/logo-liyi.jpeg" alt="Espacio de orientación SanaTú" fill sizes="100vw" />
            <div className="method-image-overlay" />
          </motion.div>
          <div className="method-content">
            <span className="method-kicker">04 / METODOLOGÍA</span>
            <AnimatePresence mode="wait">
              <motion.div key={storyIndex} initial={{ opacity: 0, y: 35, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -25, filter: 'blur(8px)' }} transition={{ duration: 0.48 }} className="method-step-copy">
                <small>0{storyIndex + 1}</small>
                <h2>{process[storyIndex][0]}</h2>
                <p>{process[storyIndex][1]}</p>
              </motion.div>
            </AnimatePresence>
            <div className="method-progress">
              {process.map((item, index) => (
                <div key={item[0]} className={index <= storyIndex ? 'active' : ''}><span /><small>{item[0]}</small></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="values-marquee" aria-label="Principios de SanaTú">
        <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 24, ease: 'linear', repeat: Infinity }}>
          {[...Array(2)].flatMap((_, group) => ['EMPATHY', 'ETHICS', 'CLARITY', 'LISTENING', 'WELLBEING'].map((word) => <span key={`${group}-${word}`}>{word}<i /></span>))}
        </motion.div>
      </section>

      <section id="faq" className="faq-section">
        <div className="section-heading">
          <span>05 / PREGUNTAS FRECUENTES</span>
          <h2>Información clara antes<br />de dar el <em>primer paso.</em></h2>
        </div>
        <div className="faq-layout">
          <div className="faq-aside">
            <div className="faq-orbit"><MessageCircle /><span /></div>
            <p>¿Tu pregunta no está aquí?</p>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">Escríbenos por WhatsApp <ArrowRight /></a>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => (
              <article key={question} className={activeFaq === index ? 'active' : ''}>
                <button type="button" onClick={() => setActiveFaq(activeFaq === index ? null : index)}>
                  <span><small>0{index + 1}</small>{question}</span><ChevronDown />
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }}>
                      <p>{answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="closing-section">
        <div className="closing-rings"><span /><span /><span /></div>
        <div className="closing-copy">
          <span>06 / COMENCEMOS</span>
          <h2>Tu bienestar no tiene que esperar<br />a que todo sea <em>demasiado.</em></h2>
          <p>Conversemos sobre lo que estás viviendo y definamos juntos el siguiente paso.</p>
          <PrimaryButton>Agendar por WhatsApp</PrimaryButton>
        </div>
        <div className="closing-proof">
          <span><Check /> Atención virtual y domiciliaria</span>
          <span><Check /> Quibdó, Chocó</span>
          <span><Check /> Trato confidencial</span>
        </div>
      </section>

      <footer className="cinematic-footer">
        <BrandMark />
        <div className="footer-contact">
          <a href="tel:+573113266223">+57 311 326 6223</a>
          <a href="mailto:liyivethq@gmail.com">liyivethq@gmail.com</a>
          <span>Quibdó · Chocó · Colombia</span>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} SanaTú. Todos los derechos reservados.</span>
          <Link href="/login">Acceso clínico <ArrowRight /></Link>
        </div>
      </footer>

      <motion.a href={whatsappUrl} target="_blank" rel="noreferrer" className="floating-contact" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.1, type: 'spring' }} whileHover={{ scale: 1.08 }} aria-label="Contactar por WhatsApp">
        <MessageCircle />
        <span>Agendar</span>
      </motion.a>
    </main>
  );
}
