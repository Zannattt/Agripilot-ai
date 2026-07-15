import { API_BASE, STORAGE_KEYS } from '../utils/constants';
import { handleMockRequest } from './mock/mockHandlers';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Mock mode resolution order:
 * 1. Runtime override in localStorage (set from the UI toggle).
 * 2. VITE_USE_MOCKS env var — only the literal string "false" disables mocks.
 * Default is ON because the FastAPI backend does not exist yet.
 */
export function isMockMode(): boolean {
  const override = localStorage.getItem(STORAGE_KEYS.mockMode);
  if (override === 'true') return true;
  if (override === 'false') return false;
  return import.meta.env.VITE_USE_MOCKS !== 'false';
}

export function setMockMode(on: boolean): void {
  localStorage.setItem(STORAGE_KEYS.mockMode, String(on));
}

interface RequestOptions {
  method?: string;
  body?: object | FormData;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (isMockMode()) {
    return handleMockRequest<T>(path, options);
  }

  const headers: Record<string, string> = {};
  let body: BodyInit | undefined;
  if (options.body instanceof FormData) {
    body = options.body;
  } else if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.body);
  }
  const token = localStorage.getItem(STORAGE_KEYS.token);
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = data.detail ?? data.message ?? message;
    } catch {
      /* keep statusText */
    }
    throw new ApiError(res.status, message);
  }
  return res.json() as Promise<T>;
}
