import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest } from '../types/auth';
import authService from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Session Bootstrap: Check existing token & fetch user profile on load
  useEffect(() => {
    const bootstrapSession = async () => {
      const token = localStorage.getItem('devbraid_access_token');
      if (token) {
        try {
          const data = await authService.me();
          setUser(data.user);
        } catch {
          // Token invalid or expired, clear local tokens
          authService.logout();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    bootstrapSession();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.user) {
        setUser(response.user);
      } else {
        try {
          const meData = await authService.me();
          setUser(meData.user || (meData as any));
        } catch {
          setUser({ id: '1', name: credentials.email.split('@')[0], email: credentials.email });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      if (response.user) {
        setUser(response.user);
      } else {
        try {
          const meData = await authService.me();
          setUser(meData.user || (meData as any));
        } catch {
          setUser({ id: '1', name: data.fullName, email: data.email });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
