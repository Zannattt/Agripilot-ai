export const APP_NAME = 'AgriPilot AI';

export const API_BASE = '/api';

export const POLL_INTERVAL_MS = 1500;

export const MAX_SCAN_IMAGES = 5;
export const MAX_IMAGE_SIZE_MB = 8;

export const STORAGE_KEYS = {
  token: 'agripilot:token',
  user: 'agripilot:user',
  theme: 'agripilot:theme',
  mockMode: 'agripilot:mockMode',
} as const;

import type { ScanStage } from '../types/scan';

export const STAGE_LABELS: Record<ScanStage, string> = {
  queued: 'Queued',
  uploading: 'Uploading images',
  analyzing: 'AI vision analysis',
  weather: 'Checking weather intelligence',
  deciding: 'Running decision engine',
  generating_audio: 'Generating Bangla audio',
  complete: 'Report ready',
  failed: 'Scan failed',
};

export const STAGE_ORDER: ScanStage[] = [
  'queued',
  'uploading',
  'analyzing',
  'weather',
  'deciding',
  'generating_audio',
  'complete',
];
