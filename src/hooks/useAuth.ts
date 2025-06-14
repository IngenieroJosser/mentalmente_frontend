import { useState, useEffect } from 'react';

export default function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = localStorage.getItem('currentUser');
        
        if (userData) {
          const user = JSON.parse(userData);
          
          // Verificar sesión en el backend
          const response = await fetch('/api/auth/session', {
            headers: {
              Authorization: `Bearer ${userData}`
            }
          });
          
          if (response.ok) {
            setCurrentUser(user);
          } else {
            localStorage.removeItem('currentUser');
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (userData: any) => {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return { currentUser, isLoading, login, logout };
}