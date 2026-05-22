import { useState, useCallback } from 'react';
import { api, APIError } from '@/services/api';
import { DayPlan, DailyWorkoutLog, WorkoutPlan } from '@/types/workout';

export function useWorkouts() {
  const [todayWorkout, setTodayWorkout] = useState<DayPlan | null>(null);
  const [isCompletedToday, setIsCompletedToday] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodayWorkout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<any>('/api/workouts/today');
      
      // Check if there is no workout for today
      if (data && (data.message === 'No workout today' || data.message === 'Nenhum treino planejado para hoje')) {
        setTodayWorkout(null);
        setIsCompletedToday(false);
      } else if (data && data.id) {
        setTodayWorkout(data as DayPlan);
        // Some backends might include a completed field or we can check completedToday
        setIsCompletedToday(!!data.completed || !!data.completedToday);
      } else {
        setTodayWorkout(null);
        setIsCompletedToday(false);
      }
    } catch (err) {
      if (err instanceof APIError && err.status === 404) {
        setTodayWorkout(null);
        setIsCompletedToday(false);
      } else {
        const message = err instanceof APIError ? err.message : 'Erro ao carregar o treino de hoje';
        setError(message);
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const completeWorkout = useCallback(async (dayPlanId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const todayISO = new Date().toISOString();
      const data = await api.post<DailyWorkoutLog>('/api/workouts/complete', {
        dayPlanId,
        date: todayISO,
      });
      setIsCompletedToday(true);
      return data;
    } catch (err) {
      if (err instanceof APIError && (err.code === 'ALREADY_COMPLETED' || err.status === 409)) {
        setIsCompletedToday(true);
        // Already completed today, return null to signal it's done
        return null;
      }
      const message = err instanceof APIError ? err.message : 'Erro ao concluir o treino';
      setError(message);
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createWorkoutPlan = useCallback(async (payload: { studentId: string; name: string; days: any[] }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.post<WorkoutPlan>('/api/workouts/plans', payload);
      return data;
    } catch (err) {
      const message = err instanceof APIError ? err.message : 'Erro ao criar o plano de treino';
      setError(message);
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    todayWorkout,
    isCompletedToday,
    isLoading,
    error,
    setError,
    fetchTodayWorkout,
    completeWorkout,
    createWorkoutPlan,
  };
}
