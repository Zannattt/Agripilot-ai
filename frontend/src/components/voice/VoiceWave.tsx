import { useMemo } from 'react';

interface VoiceWaveProps {
  /** live input level 0..1; when undefined the wave idles with a CSS loop */
  level?: number;
  bars?: number;
  active?: boolean;
}

export default function VoiceWave({ level, bars = 24, active = true }: VoiceWaveProps) {
  // stable per-bar variation so live levels look organic
  const seeds = useMemo(() => Array.from({ length: bars }, () => 0.4 + Math.random() * 0.6), [bars]);
  const idle = level === undefined;

  return (
    <div className={`voice-wave ${idle && active ? 'idle' : ''}`} aria-hidden="true">
      {seeds.map((seed, i) => {
        const height = idle
          ? undefined
          : `${Math.max(8, Math.min(100, (level ?? 0) * 100 * seed + 8))}%`;
        return <span key={i} style={height ? { height } : undefined} />;
      })}
    </div>
  );
}
