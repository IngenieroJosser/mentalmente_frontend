import { useState, useEffect } from 'react';
import { UserData } from '@/lib/type';

export default function useAuth() {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => { 
      try {
        const userData = localStorage.getItem('currentUser');
        
        if (userData) {
          const user = JSON.parse(userData) as UserData;
          
          const response = await fetch('/api/auth/session', {
            headers: { Authorization: `Bearer ${userData}` }
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

  const login = (userData: UserData) => {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return { currentUser, isLoading, login, logout };
}