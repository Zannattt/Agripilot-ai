import { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import HistoryCard from '../components/dashboard/HistoryCard';
import { getHistory } from '../services/reportService';
import type { ReportSummary } from '../types/report';

export default function History() {
  const [reports, setReports] = useState<ReportSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getHistory()
      .then((list) => {
        if (!cancelled) setReports(list);
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
            <h1>Scan history</h1>
            <p>Every report from your fields, newest first.</p>
          </div>
        </div>
        {error && <p className="form-error">Could not load history: {error}</p>}
        {!reports && !error && <Loader label="Loading history…" />}
        {reports && (
          <Card>
            <HistoryCard reports={reports} />
          </Card>
        )}
      </div>
    </main>
  );
}
