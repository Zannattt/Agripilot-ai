import Card from '../common/Card';
import Icon, { type IconName } from '../common/Icon';
import { useReveal } from '../../hooks/useReveal';

const features: Array<{ icon: IconName; title: string; text: string }> = [
  {
    icon: 'mic',
    title: 'Voice-first Bangla assistant',
    text: 'Ask questions the way you speak in the field — no typing, no menus, no English.',
  },
  {
    icon: 'brain',
    title: 'AI crop diagnosis',
    text: 'Gemini Vision identifies diseases and pests from ordinary phone photos.',
  },
  {
    icon: 'chart',
    title: 'Disease severity detection',
    text: 'Knows the difference between a few spots and a spreading outbreak.',
  },
  {
    icon: 'cloud',
    title: 'Weather-based risk prediction',
    text: 'Times treatment around rain and wind so nothing washes off or drifts.',
  },
  {
    icon: 'target',
    title: 'Precision spray recommendation',
    text: 'Maps the exact zones to treat instead of the whole field.',
  },
  {
    icon: 'leaf',
    title: 'Savings & sustainability calculator',
    text: 'Tracks money saved, chemicals avoided, and environmental impact per scan.',
  },
];

export default function Features() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="section" id="features" style={{ background: 'var(--surface)' }}>
      <div className="container reveal" ref={ref}>
        <div className="section-head center">
          <span className="eyebrow">Features</span>
          <h2>Everything a field agronomist would do — in your pocket</h2>
        </div>
        <div className="feature-grid">
          {features.map((f) => (
            <Card hover className="feature-card" key={f.title}>
              <div className="feat-icon">
                <Icon name={f.icon} size={21} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
