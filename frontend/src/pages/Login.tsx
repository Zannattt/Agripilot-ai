import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail } from '../utils/validators';
import { isMockMode } from '../services/api';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) return setError('Enter a valid email address.');
    if (!password) return setError('Enter your password.');
    setError(null);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <Card className="auth-card">
      <h2 style={{ marginBottom: 6 }}>Welcome back</h2>
      <p className="muted" style={{ marginBottom: 24 }}>
        Sign in to see your fields and reports.
      </p>
      <form onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <Button block size="lg" type="submit" disabled={loading} style={{ marginTop: 8 }}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      {isMockMode() && (
        <p className="muted" style={{ fontSize: '0.82rem', marginTop: 14 }}>
          Demo mode: any email and password will work.
        </p>
      )}
      <p style={{ marginTop: 18, fontSize: '0.9rem' }}>
        New here?{' '}
        <Link to="/register" style={{ color: 'var(--green-600)', fontWeight: 600 }}>
          Create an account
        </Link>
      </p>
    </Card>
  );
}
