import type { CropType } from './crop';

export type Severity = 'low' | 'moderate' | 'high';

export interface SprayZone {
  row: number;
  col: number;
  intensity: number; // 0..1
}

export interface ReportSavings {
  pesticideSavedPct: number;
  moneySavedBdt: number;
  co2SavedKg: number;
  waterProtectedL: number;
}

export interface Report {
  id: string;
  createdAt: string;
  crop: CropType;
  disease: string;
  diseaseBn: string;
  confidencePct: number;
  severity: Severity;
  affectedAreaPct: number;
  healthScore: number; // 0..100
  recommendation: string;
  recommendationBn: string;
  pesticide: {
    name: string;
    dosage: string;
    fullFieldLiters: number;
    spotLiters: number;
  };
  gridSize: { rows: number; cols: number };
  sprayZones: SprayZone[];
  savings: ReportSavings;
  weatherNote: string;
  audioUrl: string | null;
  imageCount: number;
}

export interface ReportSummary {
  id: string;
  createdAt: string;
  crop: CropType;
  disease: string;
  severity: Severity;
  healthScore: number;
  moneySavedBdt: number;
}

export interface DashboardData {
  healthScore: number;
  totalScans: number;
  pesticideSavedPct: number;
  moneySavedBdt: number;
  co2SavedKg: number;
  recentReports: ReportSummary[];
}
