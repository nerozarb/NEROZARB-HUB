'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'CEO' | 'TEAM' | null;

interface AuthContextType {
  role: UserRole;
  login: (passphrase: string) => boolean;
  logout: () => void;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedRole = sessionStorage.getItem('nerozarb_role') as UserRole;
    if (savedRole) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRole(savedRole);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsInitialized(true);
  }, []);

  const login = (passphrase: string) => {
    // In a real app, these would be environment variables or hashed in storage
    // For this prototype, we'll use the requested logic
    const ceoPass = 'platinumceo';
    const teamPass = 'platinumteam';

    if (passphrase === ceoPass) {
      setRole('CEO');
      sessionStorage.setItem('nerozarb_role', 'CEO');
      return true;
    } else if (passphrase === teamPass) {
      setRole('TEAM');
      sessionStorage.setItem('nerozarb_role', 'TEAM');
      return true;
    }
    return false;
  };

  const logout = () => {
    setRole(null);
    sessionStorage.removeItem('nerozarb_role');
  };

  return (
    <AuthContext.Provider value={{ role, login, logout, isInitialized }}>
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
