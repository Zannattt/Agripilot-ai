import { request, isMockMode } from './api';

export interface TranscriptResponse {
  transcript: string;
}

export function transcribe(voice: Blob): Promise<TranscriptResponse> {
  const form = new FormData();
  form.append('voice', voice, 'question.webm');
  return request<TranscriptResponse>('/voice', { method: 'POST', body: form });
}

/**
 * Plays report audio. With the real backend, audioUrl points to an
 * ElevenLabs-generated file. In mock mode we fall back to the browser's
 * speech synthesis (Bangla voice, when the OS provides one).
 */
export function speakFallback(textBn: string): boolean {
  if (!isMockMode()) return false;
  if (!('speechSynthesis' in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(textBn);
  utterance.lang = 'bn-BD';
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}
