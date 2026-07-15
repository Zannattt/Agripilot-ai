import { request } from './api';
import type { WeatherIntel } from '../types/weather';

export function getWeather(): Promise<WeatherIntel> {
  return request<WeatherIntel>('/weather');
}
