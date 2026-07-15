import type { Report } from '../../types/report';

/** Field grid highlighting only the zones the AI recommends treating. */
export default function SprayZoneMap({ report }: { report: Report }) {
  const { rows, cols } = report.gridSize;
  const zoneMap = new Map(report.sprayZones.map((z) => [`${z.row}:${z.col}`, z.intensity]));

  return (
    <div>
      <div
        className="zone-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        role="img"
        aria-label={`Spray zone map: ${report.sprayZones.length} of ${rows * cols} field zones need treatment`}
      >
        {Array.from({ length: rows * cols }, (_, i) => {
          const key = `${Math.floor(i / cols)}:${i % cols}`;
          const intensity = zoneMap.get(key);
          const cls = intensity === undefined ? '' : intensity > 0.75 ? 'zone hot' : 'zone';
          return <span key={key} className={cls} />;
        })}
      </div>
      <div className="legend">
        <span><i style={{ background: 'var(--green-50)' }} /> Healthy — do not spray</span>
        <span><i style={{ background: 'var(--warning)' }} /> Treat</span>
        <span><i style={{ background: 'var(--danger)' }} /> Treat first</span>
      </div>
    </div>
  );
}
