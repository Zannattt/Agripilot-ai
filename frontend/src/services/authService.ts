import { request } from './api';
import { STORAGE_KEYS } from '../utils/constants';
import type { AuthResponse, Credentials, RegisterPayload, User } from '../types/user';

export async function login(credentials: Credentials): Promise<AuthResponse> {
  const res = await request<AuthResponse>('/auth/login', { method: 'POST', body: credentials });
  persist(res);
  return res;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await request<AuthResponse>('/auth/register', { method: 'POST', body: payload });
  persist(res);
  return res;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
}

export function restoreSession(): User | null {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  const raw = localStorage.getItem(STORAGE_KEYS.user);
  if (!token || !raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function persist(res: AuthResponse): void {
  localStorage.setItem(STORAGE_KEYS.token, res.token);
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(res.user));
}
