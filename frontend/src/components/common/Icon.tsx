// Minimal inline icon set (stroke style, lucide-like) — no icon dependency.
import type { ReactElement } from 'react';
interface IconProps {
  name: IconName;
  size?: number;
}

export type IconName =
  | 'leaf' | 'mic' | 'camera' | 'brain' | 'cloud' | 'target' | 'chart'
  | 'shield' | 'droplet' | 'sun' | 'alert' | 'check' | 'arrow' | 'moon'
  | 'x' | 'play' | 'pause' | 'home' | 'grid' | 'clock' | 'wallet' | 'wind' | 'stop';

const paths: Record<IconName, ReactElement> = {
  leaf: <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Zm0 0c0-4.5 1.5-8 4-10.5" />,
  mic: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 19v3" /></>,
  camera: <><path d="M4 8h3l2-3h6l2 3h3v12H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  brain: <path d="M12 3a4 4 0 0 0-4 4 4 4 0 0 0-2 7.5A4 4 0 0 0 10 21h4a4 4 0 0 0 4-6.5A4 4 0 0 0 16 7a4 4 0 0 0-4-4Zm0 0v18" />,
  cloud: <path d="M17.5 19a4.5 4.5 0 0 0 .42-8.98 6 6 0 0 0-11.8 1.3A4 4 0 0 0 7 19h10.5Z" />,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  chart: <path d="M4 20V10m6 10V4m6 16v-7m4 7H2" />,
  shield: <path d="M12 2 4 6v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6l-8-4Z" />,
  droplet: <path d="M12 3s6 6.3 6 11a6 6 0 0 1-12 0c0-4.7 6-11 6-11Z" />,
  sun: <><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" /></>,
  alert: <><path d="M12 3 2.5 20h19L12 3Z" /><path d="M12 10v4.5M12 17.5v.5" /></>,
  check: <path d="M4 12.5 9.5 18 20 6.5" />,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  moon: <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 7 7 0 0 0 20 14.5Z" />,
  x: <path d="M5 5l14 14M19 5 5 19" />,
  play: <path d="M7 4.5v15l13-7.5-13-7.5Z" />,
  pause: <path d="M7 4h4v16H7zM13 4h4v16h-4z" />,
  stop: <rect x="6" y="6" width="12" height="12" rx="2" />,
  home: <path d="M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9Z" />,
  grid: <><rect x="3" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  wallet: <><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M16 12.5h.5M3 9.5h18" /></>,
  wind: <path d="M4 8h9a3 3 0 1 0-3-3M4 12h13a3 3 0 1 1-3 3M4 16h6" />,
};

export default function Icon({ name, size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
