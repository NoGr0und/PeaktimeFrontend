import { useState, useCallback } from 'react';
import { api, APIError } from '@/services/api';
import { Meal, MealType, FoodSearchResult } from '@/types/nutrition';

export function useNutrition() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<FoodSearchResult[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  const fetchMeals = useCallback(async (date: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // date must be formatted YYYY-MM-DD
      const data = await api.get<Meal[]>(`/api/nutrition/meals?date=${date}`);
      setMeals(data);
    } catch (err) {
      const message = err instanceof APIError ? err.message : 'Erro ao carregar o diário de refeições';
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createMeal = useCallback(async (payload: {
    type: MealType;
    date: string; // ISO string format
    items: {
      name: string;
      quantity: number;
      unit: string;
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
    }[];
  }, dateStr: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.post<Meal>('/api/nutrition/meals', payload);
      // Re-fetch meals for the day to keep state synced and avoid discrepancies
      await fetchMeals(dateStr);
      return data;
    } catch (err) {
      const message = err instanceof APIError ? err.message : 'Erro ao registrar a refeição';
      setError(message);
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchMeals]);

  const deleteMeal = useCallback(async (mealId: string, dateStr: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.delete<{ success: boolean }>(`/api/nutrition/meals/${mealId}`);
      // Re-fetch meals for the day
      await fetchMeals(dateStr);
    } catch (err) {
      const message = err instanceof APIError ? err.message : 'Erro ao excluir a refeição';
      setError(message);
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchMeals]);

  const searchFood = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResult([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    try {
      const data = await api.get<FoodSearchResult[]>(`/api/nutrition/search?q=${encodeURIComponent(query)}`);
      setSearchResult(data || []);
    } catch (err) {
      const message = err instanceof APIError ? err.message : 'Erro ao pesquisar alimentos';
      setSearchError(message);
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  return {
    meals,
    isLoading,
    isSearching,
    error,
    searchResult,
    searchError,
    setError,
    setSearchResult,
    fetchMeals,
    createMeal,
    deleteMeal,
    searchFood,
  };
}
