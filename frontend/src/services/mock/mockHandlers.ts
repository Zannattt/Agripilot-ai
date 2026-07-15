// In-memory mock backend. Simulates the FastAPI contract, including the
// asynchronous scan pipeline (start -> poll status -> report ready).
import { sleep, uid } from '../../utils/helpers';
import type { ScanStage, ScanStatus, ScanStartResponse } from '../../types/scan';
import type { Report } from '../../types/report';
import type { AuthResponse, RegisterPayload, Credentials, User } from '../../types/user';
//import { buildDashboard, buildReport, buildWeather, mockUser, toSummary } from './mockData';
import { buildDashboard, buildReport, buildWeather, readStoredUser, toSummary } from './mockData';

interface MockRequestOptions {
  method?: string;
  body?: unknown;
}

const reports = new Map<string, Report>();
// No seeded history: a fresh demo account starts empty, exactly like the
// real backend. Run a scan to populate the dashboard.

interface ScanJob {
  scanId: string;
  startedAt: number;
  reportId?: string;
}
const scans = new Map<string, ScanJob>();

// Each stage lasts STAGE_MS; total mock pipeline ≈ 9s.
const STAGE_MS = 1500;
const PIPELINE: ScanStage[] = ['uploading', 'analyzing', 'weather', 'deciding', 'generating_audio'];

function scanStatus(job: ScanJob): ScanStatus {
  const elapsed = Date.now() - job.startedAt;
  const index = Math.floor(elapsed / STAGE_MS);
  if (index >= PIPELINE.length) {
    if (!job.reportId) {
      const report = buildReport();
      reports.set(report.id, report);
      job.reportId = report.id;
    }
    return {
      scanId: job.scanId,
      stage: 'complete',
      progressPct: 100,
      message: 'Report ready',
      reportId: job.reportId,
    };
  }
  const stage = PIPELINE[index];
  const withinStage = (elapsed % STAGE_MS) / STAGE_MS;
  const progressPct = Math.round(((index + withinStage) / PIPELINE.length) * 100);
  const messages: Record<string, string> = {
    uploading: 'Uploading crop images…',
    analyzing: 'Gemini Vision is examining leaf damage…',
    weather: 'Fetching local weather intelligence…',
    deciding: 'Decision engine is mapping spray zones…',
    generating_audio: 'Generating Bangla voice guidance…',
  };
  return { scanId: job.scanId, stage, progressPct, message: messages[stage] };
}

function login(body: Credentials): AuthResponse {
  // Reuse whatever this browser registered with; otherwise derive from the email.
  const stored = readStoredUser();
  const user: User = {
    id: stored?.id ?? uid('u'),
    name: stored?.name ?? (body.email.split('@')[0] || 'Farmer'),
    email: body.email,
    region: stored?.region,
    primaryCrop: stored?.primaryCrop,
  };
  return { token: `mock_${uid('tok')}`, user };
}

function register(body: RegisterPayload): AuthResponse {
  const user: User = {
    id: uid('u'),
    name: body.name || 'New Farmer',
    email: body.email,
    region: body.region,
  };
  return { token: `mock_${uid('tok')}`, user };
}

// ---- router ----------------------------------------------------------------
export async function handleMockRequest<T>(path: string, options: MockRequestOptions = {}): Promise<T> {
  const method = (options.method ?? 'GET').toUpperCase();
  await sleep(250 + Math.random() * 300); // network feel

  if (method === 'POST' && path === '/auth/login') {
    return login(options.body as Credentials) as T;
  }
  if (method === 'POST' && path === '/auth/register') {
    return register(options.body as RegisterPayload) as T;
  }
  if (method === 'POST' && path === '/scan') {
    const scanId = uid('scan');
    scans.set(scanId, { scanId, startedAt: Date.now() });
    return { scanId } satisfies ScanStartResponse as T;
  }
  if (method === 'GET' && /^\/scan\/[^/]+\/status$/.test(path)) {
    const scanId = path.split('/')[2];
    const job = scans.get(scanId);
    if (!job) throw new Error('Scan not found');
    return scanStatus(job) as T;
  }
  if (method === 'GET' && /^\/report\/[^/]+$/.test(path)) {
    const id = path.split('/')[2];
    const report = reports.get(id);
    if (!report) throw new Error('Report not found');
    return report as T;
  }
  if (method === 'GET' && path === '/history') {
    const list = Array.from(reports.values())
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(toSummary);
    return list as T;
  }
  if (method === 'GET' && path === '/dashboard') {
    return buildDashboard(Array.from(reports.values())) as T;
  }
  if (method === 'GET' && path.startsWith('/weather')) {
    return buildWeather(readStoredUser()?.region) as T;
  }
  if (method === 'POST' && path === '/voice') {
    // Real backend: STT via the voice pipeline. Mock: pretend transcription.
    return { transcript: 'আমার ধানের পাতায় দাগ পড়েছে' } as T;
  }
 if (method === 'POST' && path === '/profile') {
    const current = readStoredUser();
    return { ...(current ?? { id: uid('u'), name: 'Farmer', email: '' }), ...(options.body as Partial<User>) } as T;
  }

  throw new Error(`Mock handler has no route for ${method} ${path}`);
}
