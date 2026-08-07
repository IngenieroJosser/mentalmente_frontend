'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  const getRedirectPathByRole = (role: string) => {
    switch ((role || '').toUpperCase().trim()) {
      case 'PSYCHOLOGIST': return '/psychologist-dashboard';
      case 'MANAGEMENT': return '/management-dashboard';
      case 'USER': return '/reception-dashboard';
      default: return '/login';
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!credentials.email || !credentials.password) {
      toast.error('Completa el correo y la contraseña.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'No fue posible iniciar sesión.');
      if (!data.success || !data.token || !data.user) throw new Error('La respuesta del servidor no es válida.');

      localStorage.setItem('sanatu_token', data.token);
      localStorage.setItem('sanatu_user', JSON.stringify(data.user));
      if (rememberMe) {
        sessionStorage.setItem('sanatu_token', data.token);
        sessionStorage.setItem('sanatu_user', JSON.stringify(data.user));
      } else {
        sessionStorage.removeItem('sanatu_token');
        sessionStorage.removeItem('sanatu_user');
      }

      toast.success(`Bienvenido/a, ${data.user.usuario}.`);
      window.setTimeout(() => { window.location.href = getRedirectPathByRole(data.user.role); }, 900);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No fue posible iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="sanatu-auth-page">
      <ToastContainer position="top-center" autoClose={3500} />
      <motion.section
        className="auth-shell"
        initial={{ opacity: 0, scale: .965, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }}
      >
        <aside className="auth-visual">
          <Link href="/" className="brand-mark" aria-label="Volver al inicio">
            <span className="brand-mark-image"><Image src="/logo-sana-tu-icon.png" alt="SanaTú" fill sizes="58px" priority /></span>
            <span className="brand-mark-copy"><strong>SANATÚ</strong><small>Bienestar psicológico</small></span>
          </Link>
          <motion.div className="auth-visual-orb" animate={{ rotate: 360 }} transition={{ duration: 42, repeat: Infinity, ease: 'linear' }} />
          <div className="auth-visual-copy">
            <span className="eyebrow"><Sparkles size={14} /> Espacio profesional</span>
            <h1>Gestión clínica con una experiencia <em>más humana.</em></h1>
            <p>Accede a historias, agenda, pacientes y reportes dentro de un entorno seguro y coherente con la identidad de SanaTú.</p>
          </div>
          <div className="auth-proof">
            <span><ShieldCheck /> Datos protegidos</span>
            <span><Lock /> Acceso por rol</span>
          </div>
        </aside>

        <div className="auth-panel">
          <Link href="/" className="text-link" style={{ alignSelf: 'flex-start', marginBottom: 38 }}><ArrowLeft /> Volver al sitio</Link>
          <header className="auth-panel-header">
            <small>ACCESO CLÍNICO / 01</small>
            <h2>Bienvenido de nuevo.</h2>
            <p>Ingresa tus credenciales para continuar al panel correspondiente a tu rol.</p>
          </header>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-field">
              <label htmlFor="email">Correo electrónico</label>
              <div className="auth-input-wrap">
                <Mail />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={credentials.email}
                  onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
                  placeholder="nombre@correo.com"
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password">Contraseña</label>
              <div className="auth-input-wrap">
                <Lock />
                <input
                  ref={passwordRef}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={credentials.password}
                  onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  className="auth-input-action"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => {
                    setShowPassword((current) => !current);
                    window.setTimeout(() => passwordRef.current?.focus(), 0);
                  }}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="auth-row">
              <label className="auth-check"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} /> Mantener sesión</label>
              <span>Acceso protegido</span>
            </div>

            <button type="submit" className="auth-submit" disabled={isLoading}>
              <span>{isLoading ? 'Validando acceso...' : 'Ingresar al sistema'}</span>
              {isLoading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <ArrowRight />}
            </button>
          </form>

          <p className="auth-alt">¿Necesitas una cuenta de recepción? <Link href="/register">Crear cuenta</Link></p>
        </div>
      </motion.section>
    </main>
  );
}
