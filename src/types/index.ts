export type Role = 'ALUNO' | 'PROFESSOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  dob?: string;
  avatarUrl?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  professorId: string;
  inviteCode: string;
  active: boolean;
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
}

export interface WorkoutDay {
  dayOfWeek: number; // 0 (Sunday) to 6 (Saturday)
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  studentId: string;
  professorId: string;
  days: WorkoutDay[];
  active: boolean;
  createdAt: string;
}

export interface DailyWorkoutLog {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  workoutPlanId: string;
  completed: boolean;
}

export type MealType = 'BREAKFAST' | 'LUNCH' | 'SNACK' | 'DINNER';

export interface FoodItem {
  id: string;
  name: string;
  amountInGrams: number;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Meal {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  type: MealType;
  items: FoodItem[];
  totalMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}
