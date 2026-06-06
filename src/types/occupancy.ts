export type OccupancyLevel = 'EMPTY' | 'QUIET' | 'MODERATE' | 'BUSY' | 'FULL';

export interface OccupancyReading {
  id: string;
  count: number;
  capacity: number;
  percentage: number;
  level: OccupancyLevel;
  timestamp: string;
}

export interface OccupancyHistoryPoint {
  hour: number;
  minute: number;
  count: number;
}

export interface OccupancyHistoryResponse {
  date: string;
  capacity: number;
  readings: OccupancyHistoryPoint[];
}

export interface OccupancyForecastPoint {
  hour: number;
  avgCount: number;
  percentage: number;
  level: OccupancyLevel;
}

export interface OccupancyForecastResponse {
  dayOfWeek: string;
  capacity: number;
  forecast: OccupancyForecastPoint[];
}
