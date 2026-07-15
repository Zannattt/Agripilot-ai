import type { Report, ReportSummary, DashboardData, SprayZone, Severity } from '../../types/report';
import type { WeatherIntel } from '../../types/weather';
import type { User } from '../../types/user';
import { uid } from '../../utils/helpers';
import { STORAGE_KEYS } from '../../utils/constants';

/** The user this browser registered/logged in with (persisted by authService). */
export function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.user);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function buildWeather(region?: string): WeatherIntel {
  const today = new Date();
  const conditions = ['sunny', 'cloudy', 'rain', 'sunny', 'cloudy'] as const;
  return {
    region: region?.trim() || 'Your area',
    updatedAt: new Date().toISOString(),
    sprayWindow: {
      ok: true,
      reason: 'Low wind and no rain expected for the next 6 hours.',
      bestTime: 'Today, 6:00–9:00 AM',
    },
    days: conditions.map((condition, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      return {
        date: d.toISOString(),
        tempMinC: 24 + (i % 3),
        tempMaxC: 31 + (i % 4),
        humidityPct: 68 + i * 3,
        rainChancePct: condition === 'rain' ? 70 : 15 + i * 5,
        windKph: 8 + i * 2,
        condition,
      };
    }),
  };
}

function zones(rows: number, cols: number, count: number): SprayZone[] {
  const out: SprayZone[] = [];
  const used = new Set<string>();
  while (out.length < count) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    const key = `${row}:${col}`;
    if (used.has(key)) continue;
    used.add(key);
    out.push({ row, col, intensity: 0.4 + Math.random() * 0.6 });
  }
  return out;
}

const diseasePool = [
  {
    disease: 'Bacterial Leaf Blight',
    diseaseBn: 'ব্যাকটেরিয়াল লিফ ব্লাইট',
    pesticide: 'Copper oxychloride 50 WP',
    dosage: '2.5 g per liter of water',
  },
  {
    disease: 'Rice Blast',
    diseaseBn: 'রাইস ব্লাস্ট',
    pesticide: 'Tricyclazole 75 WP',
    dosage: '0.6 g per liter of water',
  },
  {
    disease: 'Brown Spot',
    diseaseBn: 'ব্রাউন স্পট',
    pesticide: 'Mancozeb 80 WP',
    dosage: '2 g per liter of water',
  },
];

export function buildReport(id?: string, createdAt?: string): Report {
  const pick = diseasePool[Math.floor(Math.random() * diseasePool.length)];
  const severity: Severity = (['low', 'moderate', 'high'] as const)[Math.floor(Math.random() * 3)];
  const affected = severity === 'low' ? 8 : severity === 'moderate' ? 18 : 34;
  const rows = 6;
  const cols = 10;
  const zoneCount = Math.max(2, Math.round((affected / 100) * rows * cols));
  const fullFieldLiters = 120;
  const spotLiters = Math.round(fullFieldLiters * (affected / 100) * 1.4);
  const savedPct = Math.round(((fullFieldLiters - spotLiters) / fullFieldLiters) * 100);
  return {
    id: id ?? uid('rep'),
    createdAt: createdAt ?? new Date().toISOString(),
    crop: 'rice',
    disease: pick.disease,
    diseaseBn: pick.diseaseBn,
    confidencePct: 88 + Math.floor(Math.random() * 10),
    severity,
    affectedAreaPct: affected,
    healthScore: 100 - affected - 5,
    recommendation:
      `Spot-spray only the highlighted zones (${affected}% of the field) instead of blanket spraying. ` +
      'Spray early morning while wind is below 10 km/h, and re-scan the field after 5 days.',
    recommendationBn:
      'পুরো জমিতে স্প্রে না করে শুধু চিহ্নিত জায়গাগুলোতে স্প্রে করুন। সকাল ৬টা থেকে ৯টার মধ্যে স্প্রে করুন এবং ৫ দিন পর আবার স্ক্যান করুন।',
    pesticide: {
      name: pick.pesticide,
      dosage: pick.dosage,
      fullFieldLiters,
      spotLiters,
    },
    gridSize: { rows, cols },
    sprayZones: zones(rows, cols, zoneCount),
    savings: {
      pesticideSavedPct: savedPct,
      moneySavedBdt: savedPct * 42,
      co2SavedKg: Math.round(savedPct * 0.35),
      waterProtectedL: savedPct * 18,
    },
    weatherNote: 'No rain expected in the next 48 hours — treatment will not wash off.',
    audioUrl: null, // real audio arrives from the backend (ElevenLabs); mock uses browser TTS
    imageCount: 5,
  };
}

export function toSummary(report: Report): ReportSummary {
  return {
    id: report.id,
    createdAt: report.createdAt,
    crop: report.crop,
    disease: report.disease,
    severity: report.severity,
    healthScore: report.healthScore,
    moneySavedBdt: report.savings.moneySavedBdt,
  };
}

export function buildDashboard(reports: Report[]): DashboardData {
  const summaries = reports
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(toSummary);
  const money = reports.reduce((sum, r) => sum + r.savings.moneySavedBdt, 0);
  const co2 = reports.reduce((sum, r) => sum + r.savings.co2SavedKg, 0);
  const avgSaved = reports.length
    ? Math.round(reports.reduce((s, r) => s + r.savings.pesticideSavedPct, 0) / reports.length)
    : 0;
  return {
    healthScore: reports[0]?.healthScore ?? 92,
    totalScans: reports.length,
    pesticideSavedPct: avgSaved,
    moneySavedBdt: money,
    co2SavedKg: co2,
    recentReports: summaries.slice(0, 6),
  };
}
