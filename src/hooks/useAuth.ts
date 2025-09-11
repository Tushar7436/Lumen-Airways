import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth(requireAuth = true) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('jwt_token');
    const userId = localStorage.getItem('user_id');
    
    if (!token || !userId) {
      setIsAuthenticated(false);
      if (requireAuth) {
        router.push('/auth/login');
      }
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_id');
    setIsAuthenticated(false);
    router.push('/auth/login');
  };

  return { isAuthenticated, isLoading, logout };
}
