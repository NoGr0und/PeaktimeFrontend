import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/services/api';
import {
  saveSession,
  clearSession,
  getAccessToken,
  getUserRole,
  setItem,
  getItem,
} from '@/services/storage';
import { User, UserRole, LoginResponse, RegisterResponse } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    email: string;
    name: string;
    birthDate: string;
    role: UserRole;
    phone?: string;
    avatarUrl?: string;
    password?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to decode Base64Url (pure JS, works in React Native)
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function decodeBase64(input: string): string {
  const str = input.replace(/=+$/, '');
  let output = '';
  if (str.length % 4 === 1) {
    throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (let bc = 0, bs = 0, buffer, idx = 0; (buffer = str.charAt(idx++)); ) {
    buffer = chars.indexOf(buffer);
    if (buffer === -1) continue;
    bs = bc % 4 ? bs * 64 + buffer : buffer;
    if (bc++ % 4) {
      output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)));
    }
  }
  return output;
}

function decodeJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = decodeBase64(base64);
    const jsonPayload = decodeURIComponent(
      decoded
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding JWT', e);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and load saved session on mount
  useEffect(() => {
    async function loadSession() {
      try {
        const token = await getAccessToken();
        const cachedUser = await getItem('peaktime_user');
        if (token && cachedUser) {
          setUser(JSON.parse(cachedUser));
        } else if (token) {
          // If we have token but no cached user details, decode token to rebuild profile
          const decoded = decodeJWT(token);
          if (decoded) {
            const role =
              decoded.role ||
              decoded.user_metadata?.role ||
              decoded.app_metadata?.role ||
              (await getUserRole()) ||
              'ALUNO';
            const name =
              decoded.name || decoded.user_metadata?.name || decoded.email?.split('@')[0] || 'Usuário';
            const email = decoded.email || '';
            const id = decoded.sub || '';
            const resolvedUser: User = {
              id,
              name,
              email,
              role: role as UserRole,
              birthDate: decoded.user_metadata?.birthDate || '',
            };
            setUser(resolvedUser);
            await setItem('peaktime_user', JSON.stringify(resolvedUser));
          }
        }
      } catch (e) {
        console.error('Failed to load authentication session', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<LoginResponse>('/api/auth/login', { email, password });
      const { access_token, refresh_token } = response;

      // Decode the access token to read user details
      const decoded = decodeJWT(access_token);
      if (!decoded) {
        throw new Error('Token JWT recebido é inválido');
      }

      const role =
        decoded.role || decoded.user_metadata?.role || decoded.app_metadata?.role || 'ALUNO';
      const name =
        decoded.name || decoded.user_metadata?.name || decoded.email?.split('@')[0] || 'Usuário';

      const loggedUser: User = {
        id: decoded.sub || '',
        name,
        email: decoded.email || email,
        role: role as UserRole,
        birthDate: decoded.user_metadata?.birthDate || '',
      };

      await saveSession(access_token, refresh_token, role);
      await setItem('peaktime_user', JSON.stringify(loggedUser));
      setUser(loggedUser);
    } catch (e) {
      console.error('Login request failed', e);
      throw e;
    }
  };

  const register = async (payload: {
    email: string;
    name: string;
    birthDate: string;
    role: UserRole;
    phone?: string;
    avatarUrl?: string;
    password?: string;
  }) => {
    try {
      const response = await api.post<RegisterResponse>('/api/auth/register', payload);
      const { user: registeredUser, session } = response;

      if (session) {
        await saveSession(session.access_token, session.refresh_token, registeredUser.role);
        await setItem('peaktime_user', JSON.stringify(registeredUser));
        setUser(registeredUser);
      } else {
        // If email confirmation is required, we don't sign in immediately
        console.log('Confirmation email sent');
      }
    } catch (e) {
      console.error('Registration request failed', e);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await clearSession();
      await removeItem('peaktime_user');
    } catch (e) {
      console.error('Error during logout', e);
    } finally {
      setUser(null);
    }
  };

  // Helper inside logout scope to handle storage cleanup
  async function removeItem(key: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
