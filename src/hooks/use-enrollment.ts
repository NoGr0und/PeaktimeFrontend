import { useState, useCallback } from 'react';
import { api, APIError } from '@/services/api';
import { Enrollment, InviteCode } from '@/types/enrollment';

export function useEnrollment() {
  const [activeStudents, setActiveStudents] = useState<Enrollment[]>([]);
  const [linkedProfessor, setLinkedProfessor] = useState<Enrollment | null>(null);
  const [inviteCode, setInviteCode] = useState<InviteCode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<Enrollment[]>('/api/enrollment/students');
      setActiveStudents(data);
    } catch (err) {
      const message = err instanceof APIError ? err.message : 'Erro ao carregar lista de alunos';
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProfessor = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<Enrollment | null>('/api/enrollment/professor');
      setLinkedProfessor(data);
    } catch (err) {
      const message = err instanceof APIError ? err.message : 'Erro ao carregar vínculo com professor';
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateInviteCode = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.post<InviteCode>('/api/enrollment/invite');
      setInviteCode(data);
      return data;
    } catch (err) {
      const message = err instanceof APIError ? err.message : 'Erro ao gerar código de convite';
      setError(message);
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const joinWithCode = useCallback(async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.post<Enrollment>('/api/enrollment/join', { code });
      setLinkedProfessor(data);
      return data;
    } catch (err) {
      const message = err instanceof APIError ? err.message : 'Código de convite inválido ou expirado';
      setError(message);
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    activeStudents,
    linkedProfessor,
    inviteCode,
    isLoading,
    error,
    setError,
    fetchStudents,
    fetchProfessor,
    generateInviteCode,
    joinWithCode,
  };
}
