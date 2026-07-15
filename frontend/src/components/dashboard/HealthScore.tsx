interface HealthScoreProps {
  score: number; // 0..100
  size?: number;
  label?: string;
}

export default function HealthScore({ score, size = 110, label = 'Crop health' }: HealthScoreProps) {
  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const color = score >= 75 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="health-ring">
      <div className="ring" style={{ width: size, height: size, margin: 0 }}>
        <svg width={size} height={size} role="img" aria-label={`${label}: ${score} out of 100`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--green-50)"
            strokeWidth="9"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.9s var(--ease)' }}
          />
        </svg>
        <span className="ring__value">{score}</span>
      </div>
      <div>
        <div className="metric__label">{label}</div>
        <div className="metric__sub">
          {score >= 75 ? 'Field is in good shape' : score >= 50 ? 'Needs attention soon' : 'Act now'}
        </div>
      </div>
    </div>
  );
}
