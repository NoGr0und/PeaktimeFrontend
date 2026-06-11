import { api } from './api';

export interface FoodItem {
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}

export type MealType = 'BREAKFAST' | 'LUNCH' | 'SNACK' | 'DINNER';

export interface MealItemLog {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealLog {
  id: string;
  studentId: string;
  type: MealType;
  date: string;
  items: MealItemLog[];
}

export interface CreateMealRequest {
  type: MealType;
  date: string; // ISO date format YYYY-MM-DD
  items: {
    name: string;
    quantity: number;
    unit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
}

export const nutritionService = {
  async searchFood(query: string): Promise<FoodItem[]> {
    return await api.get<FoodItem[]>(`/nutrition/search?q=${encodeURIComponent(query)}`);
  },

  async logMeal(data: CreateMealRequest): Promise<MealLog> {
    return await api.post<MealLog>('/nutrition/meals', data);
  },

  async getDailyMeals(date: string): Promise<MealLog[]> {
    return await api.get<MealLog[]>(`/nutrition/meals?date=${date}`);
  },

  async deleteMeal(id: string): Promise<void> {
    await api.delete(`/nutrition/meals/${id}`);
  }
};
