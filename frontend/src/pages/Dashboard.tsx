import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Icon from '../components/common/Icon';
import HealthScore from '../components/dashboard/HealthScore';
import WeatherCard from '../components/dashboard/WeatherCard';
import ImpactCard from '../components/dashboard/ImpactCard';
import HistoryCard from '../components/dashboard/HistoryCard';
import { getDashboard } from '../services/reportService';
import type { DashboardData } from '../types/report';
import { useAuth } from '../hooks/useAuth';
import { formatBdt } from '../utils/formatter';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getDashboard()
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="app-main">
      <div className="container">
        <div className="page-head">
          <div>
            <h1>Hello, {user?.name?.split(' ')[0] ?? 'farmer'} 🌱</h1>
            <p>Here's how your fields are doing.</p>
          </div>
          <Button size="lg" onClick={() => navigate('/scan')}>
            <Icon name="mic" size={17} />
            New scan
          </Button>
        </div>

        {error && <p className="form-error">Could not load the dashboard: {error}</p>}
        {!data && !error && <Loader label="Loading your farm data…" />}

        {data && data.totalScans === 0 && (
          <Card style={{ textAlign: 'center', padding: '56px 24px' }}>
            <h2 style={{ marginBottom: 8 }}>Welcome! No scans yet 🌾</h2>
            <p className="muted" style={{ maxWidth: 420, margin: '0 auto 22px' }}>
              Run your first scan to get your crop health score, spray-zone map,
              weather guidance, and savings.
            </p>
            <Button size="lg" onClick={() => navigate('/scan')}>
              <Icon name="mic" size={17} />
              Start your first scan
            </Button>
          </Card>
        )}

        {data && data.totalScans > 0 && (
          <div className="dash-grid">
            <Card className="col-4">
              <HealthScore score={data.healthScore} />
            </Card>
            <div className="col-8 dash-grid" style={{ gridColumn: 'span 8' }}>
              <div className="col-4">
                <ImpactCard icon="droplet" label="Pesticide saved" value={`${data.pesticideSavedPct}%`} sub="average per scan" />
              </div>
              <div className="col-4">
                <ImpactCard icon="wallet" label="Money saved" value={formatBdt(data.moneySavedBdt)} sub="this season" />
              </div>
              <div className="col-4">
                <ImpactCard icon="leaf" label="CO₂ avoided" value={`${data.co2SavedKg} kg} sub={${data.totalScans} scans total`} />
              </div>
            </div>

            <div className="col-6">
              <WeatherCard />
            </div>
            <Card className="col-6">
              <div className="metric__label">Recent AI reports</div>
              <HistoryCard reports={data.recentReports} />
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}