import { api } from './api';

export interface FoodItem {
  id: string;
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type MealType = 'BREAKFAST' | 'LUNCH' | 'SNACK' | 'DINNER';

export interface MealLog {
  id: string;
  studentId: string;
  foodId: string;
  mealType: MealType;
  quantity: number;
  date: string;
  food: FoodItem;
}

export interface CreateMealRequest {
  foodId: string;
  mealType: MealType;
  quantity: number;
  date: string; // ISO date format YYYY-MM-DD
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
