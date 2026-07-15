import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Badge, { severityTone } from '../components/common/Badge';
import Icon from '../components/common/Icon';
import HealthScore from '../components/dashboard/HealthScore';
import SprayZoneMap from '../components/dashboard/SprayZoneMap';
import RecommendationCard from '../components/dashboard/RecommendationCard';
import ImpactCard from '../components/dashboard/ImpactCard';
import VoicePlayer from '../components/voice/VoicePlayer';
import { getReport } from '../services/reportService';
import type { Report as ReportType } from '../types/report';
import { formatBdt, formatDate } from '../utils/formatter';

export default function Report() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getReport(id)
      .then((r) => {
        if (!cancelled) setReport(r);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <main className="app-main">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1>Report not found</h1>
          <p className="muted">{error}</p>
          <Button onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
        </div>
      </main>
    );
  }
  if (!report) {
    return (
      <main className="app-main">
        <div className="container">
          <Loader label="Opening report…" />
        </div>
      </main>
    );
  }

  return (
    <main className="app-main">
      <div className="container">
        <div className="report-hero">
          <div>
            <p className="metric__label" style={{ marginBottom: 4 }}>
              AI report · {formatDate(report.createdAt)} · {report.imageCount} photos
            </p>
            <h1 style={{ margin: 0 }}>{report.disease}</h1>
            <p className="bn muted" style={{ margin: '4px 0 10px' }}>{report.diseaseBn}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Badge tone={severityTone(report.severity)}>{report.severity} severity</Badge>
              <Badge tone="neutral">{report.confidencePct}% confidence</Badge>
              <Badge tone="neutral" >{report.affectedAreaPct}% of field affected</Badge>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}>
            <VoicePlayer audioUrl={report.audioUrl} fallbackTextBn={report.recommendationBn} />
            <Button variant="secondary" size="sm" onClick={() => navigate('/scan')}>
              <Icon name="camera" size={15} /> Scan again
            </Button>
          </div>
        </div>

        <div className="dash-grid">
          <Card className="col-4">
            <HealthScore score={report.healthScore} />
          </Card>
          <Card className="col-8">
            <div className="metric__label">Recommended spray zones</div>
            <p className="muted" style={{ margin: '0 0 4px', fontSize: '0.9rem' }}>
              Treat only {report.sprayZones.length} of {report.gridSize.rows * report.gridSize.cols}{' '}
              field zones — the rest stays chemical-free.
            </p>
            <SprayZoneMap report={report} />
          </Card>

          <div className="col-12">
            <RecommendationCard report={report} />
          </div>

          <div className="col-3">
            <ImpactCard icon="droplet" label="Pesticide saved" value={`${report.savings.pesticideSavedPct}%`} />
          </div>
          <div className="col-3">
            <ImpactCard icon="wallet" label="Money saved" value={formatBdt(report.savings.moneySavedBdt)} />
          </div>
          <div className="col-3">
            <ImpactCard icon="leaf" label="CO₂ avoided" value={`${report.savings.co2SavedKg} kg`} />
          </div>
          <div className="col-3">
            <ImpactCard icon="shield" label="Water protected" value={`${report.savings.waterProtectedL} L`} />
          </div>
        </div>
      </div>
    </main>
  );
}
