import { request } from './api';
import type { Report, ReportSummary, DashboardData } from '../types/report';

export function getReport(id: string): Promise<Report> {
  return request<Report>(`/report/${id}`);
}

export function getHistory(): Promise<ReportSummary[]> {
  return request<ReportSummary[]>('/history');
}

export function getDashboard(): Promise<DashboardData> {
  return request<DashboardData>('/dashboard');
}
