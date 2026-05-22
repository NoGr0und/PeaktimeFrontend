export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  order: number;
  loadKg?: number;
  restSeconds?: number;
  notes?: string;
}

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface DayPlan {
  id: string;
  dayOfWeek: DayOfWeek;
  name: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  studentId: string;
  name: string;
  days: DayPlan[];
}

export interface DailyWorkoutLog {
  id: string;
  studentId: string;
  dayPlanId: string;
  date: string;
}
