import { request } from './api';
import type { ScanStartResponse, ScanStatus } from '../types/scan';

/**
 * Starts the scan pipeline. The backend responds immediately with ag scanId;
 * the pipeline (Gemini Vision -> weather -> decision engine -> TTS) runs
 * asynchronously and is observed via getScanStatus polling.
 */
export async function startScan(images: File[], voice?: Blob): Promise<ScanStartResponse> {
  const form = new FormData();
  images.forEach((file, i) => form.append('images', file, file.name || `image_${i}.jpg`));
  if (voice) form.append('voice', voice, 'question.webm');
  return request<ScanStartResponse>('/scan', { method: 'POST', body: form });
}

export function getScanStatus(scanId: string): Promise<ScanStatus> {
  return request<ScanStatus>(`/scan/${scanId}/status`);
}
