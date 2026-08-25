'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, User, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ usuario: '', correo: '', contrasena: '', confirmPassword: '', genero: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.usuario.trim()) nextErrors.usuario = 'El nombre es obligatorio.';
    else if (formData.usuario.trim().length < 3) nextErrors.usuario = 'Usa al menos 3 caracteres.';
    if (!formData.correo.trim()) nextErrors.correo = 'El correo es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) nextErrors.correo = 'Ingresa un correo válido.';
    if (!formData.contrasena) nextErrors.contrasena = 'La contraseña es obligatoria.';
    else if (formData.contrasena.length < 6) nextErrors.contrasena = 'Usa al menos 6 caracteres.';
    if (!formData.confirmPassword) nextErrors.confirmPassword = 'Confirma la contraseña.';
    else if (formData.contrasena !== formData.confirmPassword) nextErrors.confirmPassword = 'Las contraseñas no coinciden.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error('Revisa los campos marcados.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: formData.usuario,
          correo: formData.correo,
          contrasena: formData.contrasena,
          genero: formData.genero || null,
          role: 'USER',
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.details ? `${data.message}: ${data.details}` : data.message || 'No fue posible crear la cuenta.');
      if (!data.user || !data.token) throw new Error('La respuesta del servidor no es válida.');
      localStorage.setItem('sanatu_token', data.token);
      localStorage.setItem('sanatu_user', JSON.stringify(data.user));
      toast.success('Cuenta creada. Redirigiendo al panel...');
      window.setTimeout(() => router.push('/reception-dashboard'), 1000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible crear la cuenta.';
      toast.error(message.includes('Prisma') || message.includes('Database') ? 'No fue posible conectar con la base de datos.' : message);
    } finally {
      setLoading(false);
    }
  };

  const update = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }));
  };

  const ErrorMessage = ({ name }: { name: string }) => errors[name] ? <p className="auth-error"><AlertCircle />{errors[name]}</p> : null;

  return (
    <main className="sanatu-auth-page">
      <ToastContainer position="top-center" autoClose={3500} />
      <motion.section className="auth-shell" initial={{ opacity: 0, scale: .965, y: 28 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }}>
        <aside className="auth-visual">
          <Link href="/" className="brand-mark" aria-label="Volver al inicio">
            <span className="brand-mark-image"><Image src="/logo-sana-tu-icon.png" alt="SanaTú" fill sizes="58px" priority /></span>
            <span className="brand-mark-copy"><strong>SANATÚ</strong><small>Orientación Psicológica</small></span>
          </Link>
          <motion.div className="auth-visual-orb" animate={{ rotate: -360 }} transition={{ duration: 46, repeat: Infinity, ease: 'linear' }} />
          <div className="auth-visual-copy">
            <span className="eyebrow"><Sparkles size={14} /> Registro de recepción</span>
            <h1>Una entrada simple a una orientación <em>más ordenada.</em></h1>
            <p>La cuenta creada desde esta pantalla recibe el rol de recepción y permite trabajar sobre los flujos autorizados del sistema.</p>
          </div>
          <div className="auth-proof">
            <span><ShieldCheck /> Control por rol</span>
            <span><Users /> Flujo de recepción</span>
          </div>
        </aside>

        <div className="auth-panel">
          <Link href="/login" className="text-link" style={{ alignSelf: 'flex-start', marginBottom: 30 }}><ArrowLeft /> Volver al acceso</Link>
          <header className="auth-panel-header">
            <small>NUEVA CUENTA / 02</small>
            <h2>Crear cuenta.</h2>
            <p>Completa los datos para habilitar un nuevo acceso de recepción.</p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-grid-two">
              <div className="auth-field">
                <label htmlFor="usuario">Nombre de usuario</label>
                <div className="auth-input-wrap"><User /><input id="usuario" name="usuario" value={formData.usuario} onChange={update} placeholder="Nombre completo" /></div>
                <ErrorMessage name="usuario" />
              </div>
              <div className="auth-field">
                <label htmlFor="genero">Género</label>
                <div className="auth-input-wrap"><Users /><select id="genero" name="genero" value={formData.genero} onChange={update}><option value="">Seleccionar</option><option value="Masculino">Masculino</option><option value="Femenino">Femenino</option><option value="Otro">Otro</option><option value="Prefiero no decirlo">Prefiero no decirlo</option></select></div>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="correo">Correo electrónico</label>
              <div className="auth-input-wrap"><Mail /><input id="correo" name="correo" type="email" autoComplete="email" value={formData.correo} onChange={update} placeholder="nombre@correo.com" /></div>
              <ErrorMessage name="correo" />
            </div>

            <div className="auth-grid-two">
              <div className="auth-field">
                <label htmlFor="contrasena">Contraseña</label>
                <div className="auth-input-wrap"><Lock /><input id="contrasena" name="contrasena" type={showPassword ? 'text' : 'password'} value={formData.contrasena} onChange={update} placeholder="Mínimo 6 caracteres" /><button type="button" className="auth-input-action" onClick={() => setShowPassword((current) => !current)} aria-label="Mostrar u ocultar contraseña">{showPassword ? <EyeOff /> : <Eye />}</button></div>
                <ErrorMessage name="contrasena" />
              </div>
              <div className="auth-field">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <div className="auth-input-wrap"><Lock /><input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={update} placeholder="Repite la contraseña" /><button type="button" className="auth-input-action" onClick={() => setShowConfirmPassword((current) => !current)} aria-label="Mostrar u ocultar confirmación">{showConfirmPassword ? <EyeOff /> : <Eye />}</button></div>
                <ErrorMessage name="confirmPassword" />
              </div>
            </div>

            <label className="auth-check" style={{ fontSize: 11, color: 'rgba(35,39,10,.6)' }}><input type="checkbox" required /> Acepto el tratamiento responsable de los datos y las condiciones de uso.</label>

            <button className="auth-submit" type="submit" disabled={loading}>
              <span>{loading ? 'Creando cuenta...' : 'Crear cuenta de recepción'}</span>
              {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <ArrowRight />}
            </button>
          </form>

          <p className="auth-alt">¿Ya tienes una cuenta? <Link href="/login">Iniciar sesión</Link></p>
        </div>
      </motion.section>
    </main>
  );
}
