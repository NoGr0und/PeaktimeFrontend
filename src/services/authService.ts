import { api } from './api';
import { User, Role } from '../types';
import { storage } from './storage';

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const response = await api.post<{ access_token: string; refresh_token: string; user: User }>('/auth/login', { email, password });
    await storage.setItemAsync('access_token', response.access_token);
    return response.user;
  },

  async register(name: string, email: string, password: string, role: Role, dob: string): Promise<User> {
    const birthDate = new Date(dob.split('/').reverse().join('-')).toISOString();
    
    const response = await api.post<{ session: { access_token: string; refresh_token: string } | null; user: User }>('/auth/register', { 
      name, 
      email, 
      password, 
      role, 
      birthDate 
    });
    
    if (response.session?.access_token) {
      await storage.setItemAsync('access_token', response.session.access_token);
    }
    
    return response.user;
  },

  async logout(): Promise<void> {
    await storage.clearAllAsync();
  },
  
  async getCurrentUser(): Promise<User> {
    const token = await storage.getItemAsync('access_token');
    if (!token) throw new Error("No token");
    
    return await api.get<User>('/auth/me');
  },

  async updateProfile(data: { name?: string; birthDate?: string; phone?: string; avatarUrl?: string }): Promise<User> {
    return await api.put<User>('/auth/me', data);
  }
};
