import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const storage = {
  async setItemAsync(key: string, value: string): Promise<void> {
    if (isWeb) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  async getItemAsync(key: string): Promise<string | null> {
    if (isWeb) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.error('Local storage is unavailable:', e);
        return null;
      }
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },

  async deleteItemAsync(key: string): Promise<void> {
    if (isWeb) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },

  async clearAllAsync(): Promise<void> {
    if (isWeb) {
      try {
        localStorage.clear();
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
    } else {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('peaktime_user');
    }
  },
};
