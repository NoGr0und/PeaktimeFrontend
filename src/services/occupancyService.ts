import { api } from './api';
import {
  OccupancyReading,
  OccupancyHistoryResponse,
  OccupancyForecastResponse
} from '../types/occupancy';

export const OccupancyService = {
  getCurrent: async (): Promise<OccupancyReading> => {
    const data = await api.get<OccupancyReading>('/occupancy/current');
    return data;
  },

  getHistory: async (date?: string): Promise<OccupancyHistoryResponse> => {
    const url = date ? `/occupancy/history?date=${date}` : '/occupancy/history';
    return await api.get<OccupancyHistoryResponse>(url);
  },

  getForecast: async (): Promise<OccupancyForecastResponse> => {
    const data = await api.get<OccupancyForecastResponse>('/occupancy/forecast');
    return data;
  }
};
