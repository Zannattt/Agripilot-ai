import { useNavigate } from 'react-router-dom';
import Badge, { severityTone } from '../common/Badge';
import type { ReportSummary } from '../../types/report';
import { formatBdt, formatDate } from '../../utils/formatter';

interface HistoryCardProps {
  reports: ReportSummary[];
  emptyHint?: string;
}

export default function HistoryCard({ reports, emptyHint }: HistoryCardProps) {
  const navigate = useNavigate();

  if (reports.length === 0) {
    return <p className="muted">{emptyHint ?? 'No scans yet. Run your first scan to see reports here.'}</p>;
  }

  return (
    <div className="table-wrap">
      <table className="history">
        <thead>
          <tr>
            <th>Date</th>
            <th>Crop</th>
            <th>Disease</th>
            <th>Severity</th>
            <th>Health</th>
            <th>Saved</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr
              key={r.id}
              onClick={() => navigate(`/report/${r.id}`)}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/report/${r.id}`)}
            >
              <td>{formatDate(r.createdAt)}</td>
              <td style={{ textTransform: 'capitalize' }}>{r.crop}</td>
              <td>{r.disease}</td>
              <td>
                <Badge tone={severityTone(r.severity)}>{r.severity}</Badge>
              </td>
              <td>{r.healthScore}/100</td>
              <td>{formatBdt(r.moneySavedBdt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
