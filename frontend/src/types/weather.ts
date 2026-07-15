export type WeatherCondition = 'sunny' | 'cloudy' | 'rain' | 'storm';

export interface DailyForecast {
  date: string; // ISO date
  tempMinC: number;
  tempMaxC: number;
  humidityPct: number;
  rainChancePct: number;
  windKph: number;
  condition: WeatherCondition;
}

export interface SprayWindow {
  ok: boolean;
  reason: string;
  bestTime: string;
}

export interface WeatherIntel {
  region: string;
  updatedAt: string;
  sprayWindow: SprayWindow;
  days: DailyForecast[];
}
