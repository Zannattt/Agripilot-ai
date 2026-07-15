import Card from '../common/Card';
import Icon from '../common/Icon';
import type { Report } from '../../types/report';

export default function RecommendationCard({ report }: { report: Report }) {
  return (
    <Card>
      <div className="metric__label">AI recommendation</div>
      <p style={{ fontSize: '1.02rem', marginBottom: 10 }}>{report.recommendation}</p>
      <p className="bn muted" style={{ marginBottom: 18 }}>{report.recommendationBn}</p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          fontSize: '0.9rem',
        }}
      >
        <div className="preview-tile">
          <h5>Treatment</h5>
          <strong>{report.pesticide.name}</strong>
          <div className="muted">{report.pesticide.dosage}</div>
        </div>
        <div className="preview-tile">
          <h5>Spray volume</h5>
          <strong>
            {report.pesticide.spotLiters} L{' '}
            <span className="muted" style={{ textDecoration: 'line-through', fontWeight: 400 }}>
              {report.pesticide.fullFieldLiters} L
            </span>
          </strong>
          <div className="muted">spot vs full-field</div>
        </div>
      </div>
      <div className="spray-window" style={{ marginTop: 14 }}>
        <Icon name="cloud" size={17} />
        <span>{report.weatherNote}</span>
      </div>
    </Card>
  );
}
