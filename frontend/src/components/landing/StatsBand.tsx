import { useCountUp } from '../../hooks/useCountUp';

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, value: shown } = useCountUp(value);
  return (
    <div>
      <div className="stat__value">
        <span ref={ref}>{shown}</span>
        {suffix}
      </div>
      <div className="stat__label">{label}</div>
    </div>
  );
}

export default function StatsBand() {
  return (
    <section className="stats-band">
      <div className="container stats-band__grid">
        <Stat value={70} suffix="%" label="Less pesticide" />
        <Stat value={35} suffix="%" label="Lower farming cost" />
        <Stat value={95} suffix="%" label="Faster disease detection" />
        <Stat value={24} suffix="/7" label="AI assistance" />
      </div>
    </section>
  );
}
