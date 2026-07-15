import { useEffect, useState } from 'react';
import type { WeatherIntel } from '../types/weather';
import { getWeather } from '../services/weatherService';

interface UseWeatherResult {
  weather: WeatherIntel | null;
  loading: boolean;
  error: string | null;
}

export function useWeather(): UseWeatherResult {
  const [weather, setWeather] = useState<WeatherIntel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getWeather()
      .then((data) => {
        if (!cancelled) setWeather(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { weather, loading, error };
}
