import Card from '../common/Card';
import Icon, { type IconName } from '../common/Icon';
import { useReveal } from '../../hooks/useReveal';

const steps: Array<{ icon: IconName; title: string; text: string }> = [
  { icon: 'mic', title: 'Speak', text: 'Describe the problem in Bangla, out loud.' },
  { icon: 'camera', title: 'Capture', text: 'Take photos from a few spots of the field.' },
  { icon: 'brain', title: 'Analyze', text: 'AI finds the disease, severity, and affected zones.' },
  { icon: 'target', title: 'Treat', text: 'Spray only where needed, at the right time.' },
];

export default function HowItWorks() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="section">
      <div className="container reveal" ref={ref}>
        <div className="section-head center">
          <span className="eyebrow">How it works</span>
          <h2>Four steps. One healthier field.</h2>
        </div>
        <div className="how-grid">
          {steps.map((s, i) => (
            <Card hover key={s.title} style={{ textAlign: 'center' }}>
              <div className="feat-icon" style={{ margin: '0 auto 14px' }}>
                <Icon name={s.icon} size={21} />
              </div>
              <h3>
                {i + 1}. {s.title}
              </h3>
              <p className="muted" style={{ margin: 0, fontSize: '0.92rem' }}>{s.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
