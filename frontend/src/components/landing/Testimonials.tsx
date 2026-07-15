import Card from '../common/Card';
import { useReveal } from '../../hooks/useReveal';

const testimonials = [
  {
    quote:
      'Before, I sprayed the whole field every time I saw spots. Now I treat two corners and the rest stays chemical-free. My cost dropped by a third.',
    name: 'Rahim Uddin',
    role: 'Rice farmer, Bogura',
  },
  {
    quote:
      'The severity estimates line up with what I find on field visits. For remote farmers, this is the closest thing to having an agronomist on call.',
    name: 'Dr. Salma Khatun',
    role: 'Agricultural extension officer',
  },
  {
    quote:
      'We piloted it across 40 smallholder farms. Pesticide purchases fell measurably, and adoption was fast because farmers just talk to it.',
    name: 'Tanvir Hasan',
    role: 'Program lead, rural development NGO',
  },
];

export default function Testimonials() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="section" style={{ background: 'var(--surface)' }}>
      <div className="container reveal" ref={ref}>
        <div className="section-head center">
          <span className="eyebrow">Voices from the field</span>
          <h2>Trusted by the people who grow our food</h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((t) => (
            <Card hover className="testimonial-card" key={t.name}>
              <blockquote>“{t.quote}”</blockquote>
              <div className="who">
                <span className="avatar">{t.name.charAt(0)}</span>
                <div>
                  <strong>{t.name}</strong>
                  <small>{t.role}</small>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
