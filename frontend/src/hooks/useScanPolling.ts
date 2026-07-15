import { useEffect, useState } from 'react';
import type { ScanStatus } from '../types/scan';
import { getScanStatus } from '../services/aiService';
import { POLL_INTERVAL_MS } from '../utils/constants';

interface UseScanPollingResult {
  status: ScanStatus | null;
  error: string | null;
}

/** Polls scan status until the pipeline completes or fails. */
export function useScanPolling(scanId: string | null): UseScanPollingResult {
  const [status, setStatus] = useState<ScanStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scanId) return;
    let cancelled = false;
    let timer = 0;

    async function poll() {
      try {
        const next = await getScanStatus(scanId as string);
        if (cancelled) return;
        setStatus(next);
        if (next.stage !== 'complete' && next.stage !== 'failed') {
          timer = window.setTimeout(poll, POLL_INTERVAL_MS);
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      }
    }
    poll();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [scanId]);

  return { status, error };
}
