export type ScanStage =
  | 'queued'
  | 'uploading'
  | 'analyzing'
  | 'weather'
  | 'deciding'
  | 'generating_audio'
  | 'complete'
  | 'failed';

export interface ScanStartResponse {
  scanId: string;
}

export interface ScanStatus {
  scanId: string;
  stage: ScanStage;
  progressPct: number;
  message: string;
  reportId?: string;
  error?: string;
}
