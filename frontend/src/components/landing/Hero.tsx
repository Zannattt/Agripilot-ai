import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import VoiceWave from '../voice/VoiceWave';
import { useReveal } from '../../hooks/useReveal';

export default function Hero() {
  const navigate = useNavigate();
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="hero">
      <div className="container hero__grid">
        <div className="hero__copy reveal" ref={ref}>
          <span className="eyebrow">Voice-first precision agriculture</span>
          <h1>
            Smarter farming. Less pesticide. <span style={{ color: 'var(--green-600)' }}>Better harvests.</span>
          </h1>
          <p className="lead">
            A voice-first AI copilot that detects crop diseases, estimates severity, recommends
            targeted treatment, and cuts pesticide use — in Bangla, from any phone.
          </p>
          <div className="hero__cta">
            <Button size="lg" onClick={() => navigate('/scan')}>Start free scan</Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/register')}>
              Watch demo
            </Button>
          </div>
          <p className="hero__note">No credit card needed · Works on any smartphone</p>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="phone">
            <div className="phone__screen">
              <VoiceWave bars={26} />
              <div className="chat-bubble chat-bubble--farmer bn">
                <span className="chat-label">Farmer</span>
                আমার ধানের পাতায় দাগ পড়েছে
              </div>
              <div className="chat-bubble chat-bubble--ai bn">
                <span className="chat-label">AgriPilot</span>
                ৫টি ভিন্ন জায়গা থেকে ছবি তুলুন।
              </div>
              <div className="chat-bubble chat-bubble--ai">
                <span className="chat-label">Analysis</span>
                Bacterial Leaf Blight · 92% confidence
                <div className="progress-track" style={{ marginTop: 8, background: 'rgba(255,255,255,0.12)' }}>
                  <div className="progress-fill" style={{ width: '92%' }} />
                </div>
              </div>
              <div className="chat-bubble chat-bubble--ai">
                <span className="chat-label">Recommendation</span>
                Spot-spray 18% of the field only
              </div>
            </div>
          </div>
          <div className="float-card float-card--tl">
            <strong>−70%</strong>
            pesticide used
          </div>
          <div className="float-card float-card--br">
            <strong>৳3,120</strong>
            saved this season
          </div>
          <div className="float-card float-card--bl">
            <strong>12 kg</strong>
            CO₂ avoided
          </div>
        </div>
      </div>
    </section>
  );
}
