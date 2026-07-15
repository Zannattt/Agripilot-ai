import Card from '../common/Card';
import Icon, { type IconName } from '../common/Icon';

interface ImpactCardProps {
  icon: IconName;
  label: string;
  value: string;
  sub?: string;
}

export default function ImpactCard({ icon, label, value, sub }: ImpactCardProps) {
  return (
    <Card hover>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: 'var(--green-600)',
          marginBottom: 10,
        }}
      >
        <Icon name={icon} size={19} />
        <span className="metric__label" style={{ margin: 0 }}>{label}</span>
      </div>
      <div className="metric__value">{value}</div>
      {sub && <div className="metric__sub">{sub}</div>}
    </Card>
  );
}
