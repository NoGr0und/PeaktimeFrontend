import { useState, useCallback } from 'react';
import { api, APIError } from '@/services/api';
import { PushTokenResponse } from '@/types/settings';

export function useSettings() {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const registerPushToken = useCallback(async (token: string) => {
    setIsRegistering(true);
    setError(null);
    try {
      const response = await api.post<PushTokenResponse>('/api/settings/push-token', { token });
      return response;
    } catch (err) {
      const message = err instanceof APIError ? err.message : 'Erro ao registrar push token';
      setError(message);
      console.error(err);
      throw err;
    } finally {
      setIsRegistering(false);
    }
  }, []);

  return {
    registerPushToken,
    isRegistering,
    error,
  };
}
