import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'peaktime_access_token';
const REFRESH_TOKEN_KEY = 'peaktime_refresh_token';
const USER_ROLE_KEY = 'peaktime_user_role';

export async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  } else {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (e) {
      console.error('Error saving to SecureStore', e);
    }
  }
}

export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return null;
    }
  } else {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      console.error('Error reading from SecureStore', e);
      return null;
    }
  }
}

export async function removeItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from localStorage', e);
    }
  } else {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (e) {
      console.error('Error removing from SecureStore', e);
    }
  }
}

export async function saveSession(accessToken: string, refreshToken: string, role?: string): Promise<void> {
  await setItem(ACCESS_TOKEN_KEY, accessToken);
  await setItem(REFRESH_TOKEN_KEY, refreshToken);
  if (role) {
    await setItem(USER_ROLE_KEY, role);
  }
}

export async function getAccessToken(): Promise<string | null> {
  return await getItem(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return await getItem(REFRESH_TOKEN_KEY);
}

export async function getUserRole(): Promise<string | null> {
  return await getItem(USER_ROLE_KEY);
}

export async function clearSession(): Promise<void> {
  await removeItem(ACCESS_TOKEN_KEY);
  await removeItem(REFRESH_TOKEN_KEY);
  await removeItem(USER_ROLE_KEY);
}
