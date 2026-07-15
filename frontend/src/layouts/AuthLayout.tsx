import { Link, Outlet } from 'react-router-dom';
import VoiceWave from '../components/voice/VoiceWave';
import { APP_NAME } from '../utils/constants';

export default function AuthLayout() {
  return (
    <div className="auth-wrap">
      <aside className="auth-side">
        <Link to="/" className="nav__brand" style={{ color: '#e8f5e9' }}>
          <img src="/leaf.svg" alt="" width={30} height={30} />
          {APP_NAME}
        </Link>
        <div>
          <h2 style={{ color: '#fff', maxWidth: 380 }}>
            Spray less. Save more. Grow healthier crops.
          </h2>
          <p style={{ color: 'rgba(232,245,233,0.7)', maxWidth: 360 }}>
            Join thousands of farmers using voice-first AI to treat only what needs treating.
          </p>
          <VoiceWave bars={28} />
        </div>
        <small style={{ opacity: 0.55 }}>© {new Date().getFullYear()} {APP_NAME}</small>
      </aside>
      <main className="auth-form-wrap">
        <Outlet />
      </main>
    </div>
  );
}
