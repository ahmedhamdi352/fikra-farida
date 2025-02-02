'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  setAuth: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = Cookies.get('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const setAuth = (newToken: string | null) => {
    if (newToken) {
      Cookies.set('token', newToken, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      localStorage.setItem('token', newToken);
    }
    setToken(newToken);
  };

  const logout = () => {
    Cookies.remove('token');
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!token,
      token,
      setAuth,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
