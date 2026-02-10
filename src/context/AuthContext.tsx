'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  usuario: string;
  correo: string;
  genero: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User, rememberMe?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    // Limpiar ambos almacenamientos
    localStorage.removeItem('sanatu_token');
    localStorage.removeItem('sanatu_user');
    sessionStorage.removeItem('sanatu_token');
    sessionStorage.removeItem('sanatu_user');
    setUser(null);
    router.push('/login');
  }, [router]);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem('sanatu_token') || sessionStorage.getItem('sanatu_token');
      const userData = localStorage.getItem('sanatu_user') || sessionStorage.getItem('sanatu_user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [logout]);

  const login = useCallback((token: string, userData: User, rememberMe = true) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('sanatu_token', token);
    storage.setItem('sanatu_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}