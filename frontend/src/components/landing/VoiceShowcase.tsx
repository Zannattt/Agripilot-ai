import VoiceWave from '../voice/VoiceWave';
import Icon from '../common/Icon';
import { useReveal } from '../../hooks/useReveal';

export default function VoiceShowcase() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="section">
      <div className="container reveal" ref={ref}>
        <div className="voice-section">
          <div>
            <span className="eyebrow" style={{ background: 'rgba(129,199,132,0.15)', color: 'var(--accent)' }}>
              Voice assistant
            </span>
            <h2>Talk to your field, in Bangla</h2>
            <p className="muted">
              No forms. No dropdowns. Farmers describe the problem out loud, take a few photos, and
              get spoken guidance back — the way advice has always traveled in villages.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 26 }}>
              <span className="voice-btn" style={{ width: 60, height: 60 }} aria-hidden="true">
                <Icon name="mic" size={22} />
              </span>
              <VoiceWave bars={30} />
            </div>
          </div>

          <div className="voice-demo">
            <div className="chat-bubble chat-bubble--farmer bn">
              <span className="chat-label">Farmer</span>
              আমার ধানের পাতায় দাগ পড়েছে
            </div>
            <div className="chat-bubble chat-bubble--ai bn">
              <span className="chat-label">AgriPilot</span>
              ৫টি ভিন্ন জায়গা থেকে ছবি তুলুন।
            </div>
            <div className="chat-bubble chat-bubble--farmer">
              <span className="chat-label">Farmer</span>
              📷 5 photos uploaded
            </div>
            <div className="chat-bubble chat-bubble--ai">
              <span className="chat-label">AgriPilot · analyzing</span>
              <VoiceWave bars={16} />
            </div>
            <div className="chat-bubble chat-bubble--ai bn">
              <span className="chat-label">Recommendation</span>
              শুধু চিহ্নিত ১৮% জায়গায় স্প্রে করুন — সকাল ৬টা থেকে ৯টার মধ্যে।
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
