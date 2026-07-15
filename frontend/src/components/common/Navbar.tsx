import { Link, NavLink, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import Button from './Button';
import MockModeToggle from './MockModeToggle';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { APP_NAME } from '../../utils/constants';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="nav">
      <div className="container nav__inner">
        <Link to="/" className="nav__brand" aria-label={`${APP_NAME} home`}>
          <img src="/leaf.svg" alt="" width={30} height={30} />
          {APP_NAME}
        </Link>

        {isAuthenticated ? (
          <nav className="nav__links" aria-label="App">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/scan">New scan</NavLink>
            <NavLink to="/history">History</NavLink>
          </nav>
        ) : (
          <nav className="nav__links" aria-label="Site">
            <a href="/#features">Features</a>
            <a href="/#how-it-works">How it works</a>
            <a href="/#dashboard">Dashboard</a>
            <a href="/#impact">Impact</a>
            <a href="/#pricing">Pricing</a>
            <a href="/#contact">Contact</a>
          </nav>
        )}

        <div className="nav__actions">
          <MockModeToggle />
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            <Icon name={theme === 'light' ? 'moon' : 'sun'} size={17} />
          </button>
          {isAuthenticated ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Sign out
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Sign in
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                Get started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
