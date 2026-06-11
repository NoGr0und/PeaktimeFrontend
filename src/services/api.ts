import { Platform } from 'react-native';
import { storage } from './storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3333/api';

interface ApiOptions extends RequestInit {
  data?: any;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any, message?: string) {
    super(message || 'API Error');
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

export const api = {
  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const token = await storage.getItemAsync('access_token');
    
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Bypass-Tunnel-Reminder': 'true', 
      ...((options.headers as Record<string, string>) || {}),
    };

    if (options.method && !['GET', 'DELETE'].includes(options.method.toUpperCase())) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    if (options.data) {
      config.body = JSON.stringify(options.data);
    }

    // Determine correct URL based on platform if testing locally
    let url = `${API_URL}${endpoint}`;
    if (API_URL.includes('localhost') && Platform.OS === 'android') {
      url = url.replace('localhost', '10.0.2.2');
    }

    try {
      const response = await fetch(url, config);
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        throw new ApiError(response.status, data, data.message || 'An error occurred');
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(error instanceof Error ? error.message : 'Network error');
    }
  },

  get<T>(endpoint: string, options?: Omit<ApiOptions, 'body' | 'method'>) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, data?: any, options?: Omit<ApiOptions, 'body' | 'method'>) {
    return this.request<T>(endpoint, { ...options, method: 'POST', data });
  },

  put<T>(endpoint: string, data?: any, options?: Omit<ApiOptions, 'body' | 'method'>) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', data });
  },

  patch<T>(endpoint: string, data?: any, options?: Omit<ApiOptions, 'body' | 'method'>) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', data });
  },

  delete<T>(endpoint: string, options?: Omit<ApiOptions, 'body' | 'method'>) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};