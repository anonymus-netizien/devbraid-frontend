import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest, UserProfileResponseData } from '../types/auth';
import authService from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapProfileToUser(profile: UserProfileResponseData): User {
  return { id: profile.id, fullName: profile.fullName, email: profile.email, role: profile.role as User['role'], createdAt: profile.createdAt };
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const bootstrapSession = async () => {
      try {
        const profile = await authService.me();
        setUser(mapProfileToUser(profile));
      } catch {
        try {
          await authService.refresh();
          const profile = await authService.me();
          setUser(mapProfileToUser(profile));
        } catch {
          await authService.logout();
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    bootstrapSession();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      await authService.login(credentials);
      const profile = await authService.me();
      setUser(mapProfileToUser(profile));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendOtp = useCallback(async (email: string) => {
    await authService.sendOtp(email);
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    await authService.verifyOtp(email, otp);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    await authService.register(data);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const contextValue = useMemo(
    () => ({ user, isAuthenticated: !!user, isLoading, login, register, sendOtp, verifyOtp, logout }),
    [user, isLoading, login, register, sendOtp, verifyOtp, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>
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

