import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Icon from '../components/common/Icon';
import { useAuth } from '../hooks/useAuth';

export default function MainLayout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <>
      <Navbar />
      <Outlet />
      {isLanding && <Footer />}

      {isAuthenticated && !isLanding && (
        <>
          {/* fixed voice/scan button on mobile */}
          <div className="fab-voice">
            <button
              type="button"
              className="voice-btn"
              style={{ width: 58, height: 58 }}
              onClick={() => navigate('/scan')}
              aria-label="Start a new voice scan"
            >
              <Icon name="mic" size={22} />
            </button>
          </div>
          <nav className="bottom-nav" aria-label="Primary">
            <NavLink to="/dashboard">
              <Icon name="home" size={20} />
              Home
            </NavLink>
            <NavLink to="/scan">
              <Icon name="camera" size={20} />
              Scan
            </NavLink>
            <NavLink to="/history">
              <Icon name="clock" size={20} />
              History
            </NavLink>
          </nav>
        </>
      )}
    </>
  );
}
