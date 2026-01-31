'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUser, clearUser, isAuthenticated } from '../services/auth.service';
import type { User } from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  updateUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 [CONTEXT] Initializing AuthContext...');
    const storedUser = getUser();
    console.log('💾 [CONTEXT] Stored user:', storedUser);
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const updateUser = (newUser: User | null) => {
    console.log('🔄 [CONTEXT] Updating user:', newUser);
    setUser(newUser);
    console.log('✅ [CONTEXT] User state updated');
  };

  const logout = () => {
    clearUser();
    setUser(null);
  };

  const authed = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: authed,
        updateUser,
        logout,
      }}
    >
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
