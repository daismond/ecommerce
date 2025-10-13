import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import api from '../services/api';

// This should match the User schema from the backend
export interface User {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    is_active: boolean;
    role: 'customer' | 'admin' | 'manager';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email, password) => Promise<void>;
  logout: () => void;
}

// ...

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await api.get('/users/me');
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user, token might be invalid", error);
          logout();
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ... (login and logout functions)

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
