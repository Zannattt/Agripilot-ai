import { useReveal } from '../../hooks/useReveal';

const impacts = [
  { label: 'Reduced chemicals', pct: 70 },
  { label: 'Cleaner water', pct: 62 },
  { label: 'Healthier soil', pct: 58 },
  { label: 'Protected bees', pct: 81 },
  { label: 'Lower carbon', pct: 44 },
];

function Ring({ pct, label }: { pct: number; label: string }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <div>
      <div className="ring">
        <svg width="110" height="110" role="img" aria-label={`${label}: ${pct}%`}>
          <circle cx="55" cy="55" r={r} fill="none" stroke="var(--green-50)" strokeWidth="9" />
          <circle
            cx="55"
            cy="55"
            r={r}
            fill="none"
            stroke="var(--green-600)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - pct / 100)}
          />
        </svg>
        <span className="ring__value">{pct}%</span>
      </div>
      <div className="stat__label">{label}</div>
    </div>
  );
}

export default function ImpactSection() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="section" id="impact" style={{ background: 'var(--surface)' }}>
      <div className="container reveal" ref={ref}>
        <div className="section-head center">
          <span className="eyebrow">Sustainability</span>
          <h2>Precision that the environment can measure</h2>
          <p>Average improvement across pilot fields after one growing season.</p>
        </div>
        <div className="impact-grid">
          {impacts.map((i) => (
            <Ring key={i.label} pct={i.pct} label={i.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
