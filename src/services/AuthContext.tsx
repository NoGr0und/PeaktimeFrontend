import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from './authService';
import { storage } from './storage';

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  signIn: (user: User) => void;
  signOut: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const token = await storage.getItemAsync('access_token');
        if (token) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        await storage.deleteItemAsync('access_token');
      } finally {
        setIsLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const signIn = (userData: User) => {
    setUser(userData);
  };

  const signOut = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
