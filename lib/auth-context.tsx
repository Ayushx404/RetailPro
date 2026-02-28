import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  pin: string;
  role: 'ADMIN' | 'CASHIER' | 'STOCK_CLERK';
  status: string;
  joinedDate: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  isAdmin: boolean;
  logout: () => void;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('retailpro_user').then(stored => {
      if (stored) {
        try {
          setUserState(JSON.parse(stored));
        } catch (e) { }
      }
      setIsLoaded(true);
    });
  }, []);

  const setUser = (newUser: AuthUser | null) => {
    setUserState(newUser);
    if (newUser) {
      AsyncStorage.setItem('retailpro_user', JSON.stringify(newUser));
    } else {
      AsyncStorage.removeItem('retailpro_user');
    }
  };

  const logout = () => setUser(null);

  const value = useMemo(() => ({
    user,
    setUser,
    isAdmin: user?.role === 'ADMIN',
    logout,
    isLoaded,
  }), [user, isLoaded]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
