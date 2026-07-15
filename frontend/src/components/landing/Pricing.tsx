import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import Icon from '../common/Icon';
import { useReveal } from '../../hooks/useReveal';

const plans = [
  {
    name: 'Free',
    price: '৳0',
    period: 'forever',
    features: ['5 scans per month', 'Voice assistant in Bangla', 'Basic weather forecast', 'Community support'],
    cta: 'Start free',
    popular: false,
  },
  {
    name: 'Premium Farmer',
    price: '৳299',
    period: 'per month',
    features: [
      'Unlimited scans',
      'Spot-spray zone maps',
      'Spray-window alerts',
      'Season savings reports',
      'Priority support',
    ],
    cta: 'Go premium',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'for co-ops & NGOs',
    features: [
      'Multi-farm dashboards',
      'Field officer accounts',
      'API & data export',
      'Training & onboarding',
    ],
    cta: 'Talk to us',
    popular: false,
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="section" id="pricing">
      <div className="container reveal" ref={ref}>
        <div className="section-head center">
          <span className="eyebrow">Pricing</span>
          <h2>Pays for itself in one avoided spray</h2>
        </div>
        <div className="pricing-grid">
          {plans.map((p) => (
            <Card className={`price-card ${p.popular ? 'popular' : ''}`} key={p.name}>
              {p.popular && <span className="popular-tag">Most popular</span>}
              <h3>{p.name}</h3>
              <div className="price">{p.price}</div>
              <span className="muted" style={{ fontSize: '0.85rem' }}>{p.period}</span>
              <ul>
                {p.features.map((f) => (
                  <li key={f}>
                    <Icon name="check" size={15} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                block
                variant={p.popular ? 'primary' : 'secondary'}
                onClick={() => navigate('/register')}
              >
                {p.cta}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
