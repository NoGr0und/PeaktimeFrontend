import { api } from './api';

export interface Exercise {
  id?: string;
  name: string;
  sets: number;
  reps: number;
  order: number;
  loadKg?: number;
  restSeconds?: number;
  notes?: string;
}

export interface DayPlan {
  id?: string;
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  name: string;
  exercises: Exercise[];
}

export interface WeeklyPlan {
  id?: string;
  name: string;
  professorId?: string;
  studentId: string;
  active?: boolean;
  days: DayPlan[];
}

export interface WorkoutCompletionResponse {
  id: string;
  studentId: string;
  dayPlanId: string;
  date: string;
}

export interface WeeklyDashboardResponse {
  plans: WeeklyPlan[];
  completions: WorkoutCompletionResponse[];
}

export interface WorkoutHistoryItem {
  id: string;
  studentId: string;
  dayPlanId: string;
  date: string;
  dayPlan: DayPlan;
}

export const workoutService = {
  // Professor methods
  async createPlan(data: WeeklyPlan): Promise<WeeklyPlan> {
    return await api.post<WeeklyPlan>('/workouts/plans', data);
  },

  // Student methods
  async getTodayWorkout(): Promise<DayPlan | null> {
    try {
      const response = await api.get<any>('/workouts/today');
      if (response.message === "No workout today") {
        return null;
      }
      return response as DayPlan;
    } catch (e) {
      return null;
    }
  },

  async getWeeklyDashboard(): Promise<WeeklyDashboardResponse> {
    return await api.get<WeeklyDashboardResponse>('/workouts/weekly');
  },

  async getStudentDashboard(studentId: string): Promise<WeeklyDashboardResponse> {
    return await api.get<WeeklyDashboardResponse>(`/workouts/student/${studentId}/dashboard`);
  },

  async getWorkoutHistory(): Promise<WorkoutHistoryItem[]> {
    try {
      return await api.get<WorkoutHistoryItem[]>('/workouts/history');
    } catch (e) {
      return [];
    }
  },

  async completeWorkout(dayPlanId: string, date: string): Promise<WorkoutCompletionResponse> {
    return await api.post<WorkoutCompletionResponse>('/workouts/complete', { dayPlanId, date });
  }
};
