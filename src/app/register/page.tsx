'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  ChevronRight,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    usuario: '',
    correo: '',
    contrasena: '',
    confirmPassword: '',
    genero: '',
    // role fijo eliminado del estado
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.usuario.trim()) {
      newErrors.usuario = 'El nombre de usuario es requerido';
    } else if (formData.usuario.length < 3) {
      newErrors.usuario = 'Mínimo 3 caracteres';
    }

    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'Correo inválido';
    }

    if (!formData.contrasena) {
      newErrors.contrasena = 'La contraseña es requerida';
    } else if (formData.contrasena.length < 6) {
      newErrors.contrasena = 'Mínimo 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.contrasena !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: formData.usuario,
          correo: formData.correo,
          contrasena: formData.contrasena,
          genero: formData.genero || null,
          role: 'USER' // Rol fijo
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        const errorMessage = data.details 
          ? `${data.message}: ${data.details}`
          : data.message || 'Error en el registro';
        throw new Error(errorMessage);
      }
  
      if (!data.user || !data.token) {
        throw new Error('La respuesta del servidor no contiene los datos esperados');
      }
  
      localStorage.setItem('sanatu_token', data.token);
      localStorage.setItem('sanatu_user', JSON.stringify(data.user));
  
      toast.success('¡Registro exitoso! Redirigiendo...', {
        position: "top-center",
        autoClose: 2000,
        onClose: () => {
          // Redirigir siempre a reception-dashboard (rol USER)
          router.push('/reception-dashboard');
        }
      });
  
    } catch (error) {
      console.error('Register error:', error);
      
      interface ErrorWithMessage {
        message: string;
      }
      
      const err = error as ErrorWithMessage;
      
      let errorMessage = err.message || 'Error en el registro';
      
      if (errorMessage.includes('Database Error') || errorMessage.includes('Prisma')) {
        errorMessage = 'Error de conexión con la base de datos. Por favor, intenta nuevamente.';
      }
      
      toast.error(errorMessage, {
        position: "top-center"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-white to-gray-50">
      <ToastContainer />
      
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Panel izquierdo - Información */}
            <div className="bg-gradient-to-br from-[#bec5a4] to-[#a0a78c] p-8 lg:p-12 text-white">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-8">
                    <ChevronRight className="w-4 h-4 rotate-180 mr-2" />
                    Volver al inicio
                  </Link>
                  
                  <div className="mb-8">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                      <UserPlus className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-light mb-4">
                      Únete a <span className="font-normal">SanaTú Quingar</span>
                    </h1>
                    <p className="text-white/80 font-light">
                      Crea tu cuenta para acceder al sistema de gestión de historias clínicas
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-light mb-1">Acceso Seguro</h3>
                        <p className="text-sm text-white/70 font-light">
                          Encriptación de datos y autenticación JWT
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-light mb-1">Recepción</h3>
                        <p className="text-sm text-white/70 font-light">
                          Acceso para personal de recepción
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/20">
                  <p className="text-sm text-white/70 font-light">
                    ¿Ya tienes una cuenta?{' '}
                    <Link href="/login" className="text-white hover:underline font-medium">
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Panel derecho - Formulario */}
            <div className="p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-light text-gray-900 mb-2">
                    Crear Nueva Cuenta
                  </h2>
                  <p className="text-gray-600 font-light">
                    Completa el formulario para registrarte
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nombre de usuario */}
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">
                      Nombre de Usuario *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        name="usuario"
                        value={formData.usuario}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#bec5a4]/30 focus:border-[#bec5a4] outline-none transition-all ${
                          errors.usuario ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="ej: Josser"
                      />
                    </div>
                    {errors.usuario && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.usuario}
                      </p>
                    )}
                  </div>

                  {/* Correo electrónico */}
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">
                      Correo Electrónico *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#bec5a4]/30 focus:border-[#bec5a4] outline-none transition-all ${
                          errors.correo ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="ej: cordobarivasjoss@sanatu.com"
                      />
                    </div>
                    {errors.correo && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.correo}
                      </p>
                    )}
                  </div>

                  {/* Género (opcional) */}
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">
                      Género
                    </label>
                    <select
                      name="genero"
                      value={formData.genero}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bec5a4]/30 focus:border-[#bec5a4] outline-none transition-all"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                      <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                    </select>
                  </div>

                  {/* Contraseña */}
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">
                      Contraseña *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#bec5a4]/30 focus:border-[#bec5a4] outline-none transition-all ${
                          errors.contrasena ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.contrasena && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.contrasena}
                      </p>
                    )}
                  </div>

                  {/* Confirmar Contraseña */}
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">
                      Confirmar Contraseña *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#bec5a4]/30 focus:border-[#bec5a4] outline-none transition-all ${
                          errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Repite tu contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Términos y condiciones */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        required
                        className="w-4 h-4 text-[#bec5a4] border-gray-300 rounded focus:ring-[#bec5a4]"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="font-light text-gray-700">
                        Acepto los{' '}
                        <a href="#" className="text-[#bec5a4] hover:underline">
                          términos y condiciones
                        </a>{' '}
                        y la{' '}
                        <a href="#" className="text-[#bec5a4] hover:underline">
                          política de privacidad
                        </a>
                      </label>
                    </div>
                  </div>

                  {/* Botón de registro */}
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 px-6 rounded-lg font-light text-white flex items-center justify-center transition-all duration-300 ${
                        loading
                          ? 'bg-[#bec5a4]/80 cursor-not-allowed'
                          : 'bg-[#bec5a4] hover:bg-[#a0a78c] shadow-sm hover:shadow'
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                          Creando cuenta...
                        </>
                      ) : (
                        <>
                          Crear Cuenta
                          <ChevronRight className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Enlace a login */}
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <p className="text-gray-600 font-light">
                    ¿Ya tienes una cuenta?{' '}
                    <Link href="/login" className="text-[#bec5a4] hover:underline font-medium">
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 font-light">
            © {new Date().getFullYear()} SanaTú Quingar. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-400 font-light mt-1">
            Sistema seguro de gestión de historias clínicas
          </p>
        </div>
      </div>
    </div>
  );
}