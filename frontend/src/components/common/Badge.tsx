import type { ReactNode } from 'react';
import type { Severity } from '../../types/report';

interface BadgeProps {
  tone?: 'success' | 'warning' | 'danger' | 'neutral';
  children: ReactNode;
}

export default function Badge({ tone = 'neutral', children }: BadgeProps) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

export function severityTone(severity: Severity): 'success' | 'warning' | 'danger' {
  if (severity === 'low') return 'success';
  if (severity === 'moderate') return 'warning';
  return 'danger';
}
