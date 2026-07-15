import HealthScore from '../dashboard/HealthScore';
import { useReveal } from '../../hooks/useReveal';

const bars = [42, 66, 54, 78, 62, 88, 74, 95];

export default function DashboardPreview() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="section" id="dashboard">
      <div className="container reveal" ref={ref}>
        <div className="section-head center">
          <span className="eyebrow">Dashboard</span>
          <h2>Every scan becomes a clear, actionable report</h2>
          <p>Health score, confidence, spray zones, forecast, and savings — at a glance.</p>
        </div>

        <div className="preview-shell">
          <div className="preview-tile span-4">
            <h5>Crop health score</h5>
            <HealthScore score={82} size={96} label="Rice · plot 3" />
          </div>
          <div className="preview-tile span-4">
            <h5>Disease confidence</h5>
            <div className="metric__value">92%</div>
            <div className="metric__sub">Bacterial Leaf Blight</div>
            <div className="progress-track" style={{ marginTop: 12 }}>
              <div className="progress-fill" style={{ width: '92%' }} />
            </div>
          </div>
          <div className="preview-tile span-4">
            <h5>Affected area</h5>
            <div className="metric__value">18%</div>
            <div className="metric__sub">11 of 60 field zones</div>
            <div className="progress-track" style={{ marginTop: 12 }}>
              <div className="progress-fill" style={{ width: '18%' }} />
            </div>
          </div>

          <div className="preview-tile span-8">
            <h5>Pesticide savings — last 8 scans (liters avoided)</h5>
            <div className="bar-row">
              {bars.map((h, i) => (
                <span key={i} style={{ height: `${h}%`, animationDelay: `${i * 0.07}s` }} />
              ))}
            </div>
          </div>
          <div className="preview-tile span-4">
            <h5>Money saved</h5>
            <div className="metric__value">৳12,480</div>
            <div className="metric__sub">this season</div>
            <h5 style={{ marginTop: 18 }}>Environmental impact</h5>
            <div className="metric__sub">37 kg CO₂ · 1,890 L water protected</div>
          </div>
        </div>
      </div>
    </section>
  );
}
