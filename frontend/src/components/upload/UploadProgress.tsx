import type { ScanStatus } from '../../types/scan';
import { STAGE_LABELS, STAGE_ORDER } from '../../utils/constants';

interface UploadProgressProps {
  status: ScanStatus;
}

export default function UploadProgress({ status }: UploadProgressProps) {
  const activeIndex = STAGE_ORDER.indexOf(status.stage);
  const visibleStages = STAGE_ORDER.filter((s) => s !== 'queued' && s !== 'complete');

  return (
    <div className="scan-progress" aria-live="polite">
      <h3 style={{ marginBottom: 6 }}>{status.message}</h3>
      <p className="muted" style={{ marginBottom: 22 }}>
        Keep this page open — your report opens automatically.
      </p>
      <div className="progress-track" style={{ maxWidth: 420, margin: '0 auto' }}>
        <div className="progress-fill" style={{ width: `${status.progressPct}%` }} />
      </div>
      <ol className="stage-list">
        {visibleStages.map((stage) => {
          const idx = STAGE_ORDER.indexOf(stage);
          const state = idx < activeIndex ? 'done' : idx === activeIndex ? 'active' : '';
          return (
            <li key={stage} className={state}>
              <span className="stage-dot" />
              {STAGE_LABELS[stage]}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
