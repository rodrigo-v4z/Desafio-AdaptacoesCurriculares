import React, { createContext, useContext, useState, useEffect } from 'react';
import { authStorage, initializeDefaultUsers } from '../lib/storage';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize default users if needed
    initializeDefaultUsers();
    
    // Check for existing session
    checkSession();
  }, []);

  function checkSession() {
    try {
      const currentUser = authStorage.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error checking session:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    const userData = authStorage.signIn(email, password);
    
    if (!userData) {
      throw new Error('E-mail ou senha inválidos');
    }
    
    setUser(userData);
  }

  async function signOut() {
    authStorage.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
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
