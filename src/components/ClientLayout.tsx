'use client';

import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Spinner from './Spinner';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [booting, setBooting] = useState(true);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 28, mass: 0.25 });
  const isDashboard = pathname.includes('dashboard');

  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), 720);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.route = isDashboard ? 'dashboard' : pathname === '/' ? 'home' : 'public';
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, isDashboard]);

  if (booting) return <Spinner />;

  return (
    <div className={`sanatu-route ${isDashboard ? 'sanatu-route-dashboard' : ''}`}>
      <motion.div className="sanatu-scroll-progress" style={{ scaleX: progress }} />
      <div className="sanatu-noise" aria-hidden="true" />
      <div className="sanatu-ambient sanatu-ambient-one" aria-hidden="true" />
      <div className="sanatu-ambient sanatu-ambient-two" aria-hidden="true" />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
          transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
          className="sanatu-route-content"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        <motion.div
          key={`wipe-${pathname}`}
          className="sanatu-route-wipe"
          initial={{ scaleX: 1, transformOrigin: 'left' }}
          animate={{ scaleX: 0, transformOrigin: 'right' }}
          transition={{ duration: 0.62, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        />
      </AnimatePresence>
    </div>
  );
}
