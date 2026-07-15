import { useMemo } from 'react';
import Icon, { type IconName } from '../common/Icon';
import { useReveal } from '../../hooks/useReveal';

const problems: Array<{ icon: IconName; title: string; text: string }> = [
  { icon: 'droplet', title: 'Excess pesticide', text: 'Whole fields get sprayed when only patches are sick.' },
  { icon: 'wallet', title: 'Higher costs', text: 'Chemicals are often a farmer\u2019s single biggest input expense.' },
  { icon: 'alert', title: 'Environmental pollution', text: 'Runoff contaminates water, soil, and pollinators.' },
  { icon: 'shield', title: 'Pesticide resistance', text: 'Over-spraying breeds resistant pests and diseases.' },
  { icon: 'clock', title: 'Late detection', text: 'By the time damage is visible everywhere, it\u2019s expensive to fix.' },
];

const steps: Array<{ icon: IconName; label: string }> = [
  { icon: 'mic', label: 'Voice question' },
  { icon: 'camera', label: 'Upload crop images' },
  { icon: 'brain', label: 'Gemini Vision analysis' },
  { icon: 'cloud', label: 'Weather intelligence' },
  { icon: 'grid', label: 'AI decision engine' },
  { icon: 'target', label: 'Spot treatment plan' },
  { icon: 'leaf', label: 'Impact report' },
];

export default function ProblemSolution() {
  const problemRef = useReveal<HTMLDivElement>();
  const solutionRef = useReveal<HTMLDivElement>();

  // stable demo pattern: blanket spraying vs 7 spot cells
  const cells = useMemo(() => {
    const spots = new Set([4, 5, 14, 27, 41, 52, 53]);
    return Array.from({ length: 60 }, (_, i) => (spots.has(i) ? 'spot' : 'sprayed'));
  }, []);

  return (
    <>
      <section className="section" id="about">
        <div className="container problem__grid reveal" ref={problemRef}>
          <div className="field-illustration">
            <h3 style={{ color: '#fff' }}>Today: spray everything</h3>
            <p style={{ color: 'rgba(232,245,233,0.7)', fontSize: '0.9rem' }}>
              A typical field where the whole area is treated even though only a few zones are
              actually infected.
            </p>
            <div className="field-grid">
              {cells.map((cls, i) => (
                <span key={i} className={cls === 'sprayed' ? 'sprayed' : 'spot'} />
              ))}
            </div>
            <p className="field-caption">
              Red = sprayed unnecessarily · Amber = actually infected zones
            </p>
          </div>
          <div>
            <span className="eyebrow">The problem</span>
            <h2>Blanket spraying wastes money and poisons fields</h2>
            <div className="problem__cards" style={{ marginTop: 26 }}>
              {problems.map((p) => (
                <div className="problem-card" key={p.title}>
                  <Icon name={p.icon} size={19} />
                  <div>
                    <h4>{p.title}</h4>
                    <p>{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="how-it-works" style={{ paddingTop: 0 }}>
        <div className="container reveal" ref={solutionRef}>
          <div className="section-head center">
            <span className="eyebrow">The solution</span>
            <h2>From a spoken question to a precise treatment plan</h2>
            <p>Seven steps, fully automated — the farmer only speaks and takes photos.</p>
          </div>
          <div className="timeline">
            {steps.map((step) => (
              <div className="timeline__step" key={step.label}>
                <div className="step-icon">
                  <Icon name={step.icon} size={20} />
                </div>
                {step.label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
