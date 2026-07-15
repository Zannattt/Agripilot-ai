import Card from '../common/Card';
import Icon, { type IconName } from '../common/Icon';
import Loader from '../common/Loader';
import { useWeather } from '../../hooks/useWeather';
import type { WeatherCondition } from '../../types/weather';

const conditionIcon: Record<WeatherCondition, IconName> = {
  sunny: 'sun',
  cloudy: 'cloud',
  rain: 'droplet',
  storm: 'wind',
};

export default function WeatherCard() {
  const { weather, loading, error } = useWeather();

  return (
    <Card>
      <div className="metric__label">Weather intelligence</div>
      {loading && <Loader label="Fetching forecast…" />}
      {error && <p className="form-error">Weather is unavailable: {error}</p>}
      {weather && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>
              {weather.region}
            </strong>
            <span className="metric__sub">5-day outlook</span>
          </div>
          <div className="weather-days">
            {weather.days.map((day) => (
              <div className="weather-day" key={day.date}>
                <span className="muted">
                  {new Date(day.date).toLocaleDateString('en-GB', { weekday: 'short' })}
                </span>
                <div style={{ color: 'var(--green-600)', margin: '4px 0' }}>
                  <Icon name={conditionIcon[day.condition]} size={17} />
                </div>
                <strong>{day.tempMaxC}°</strong>
                <span className="muted">{day.rainChancePct}% rain</span>
              </div>
            ))}
          </div>
          <div className="spray-window">
            <Icon name={weather.sprayWindow.ok ? 'check' : 'alert'} size={17} />
            <div>
              <strong>
                {weather.sprayWindow.ok ? 'Good spray window: ' : 'Hold off spraying: '}
                {weather.sprayWindow.bestTime}
              </strong>
              <div className="muted">{weather.sprayWindow.reason}</div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
