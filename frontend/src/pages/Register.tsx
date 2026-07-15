import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail, passwordProblem } from '../utils/validators';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError('Enter your name.');
    if (!region.trim()) return setError('Enter your district (e.g. Dhaka).');
    if (!isValidEmail(email)) return setError('Enter a valid email address.');
    const pw = passwordProblem(password);
    if (pw) return setError(pw);
    setError(null);
    try {
      await register({ name: name.trim(), email, password, region: region.trim() });
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <Card className="auth-card">
      <h2 style={{ marginBottom: 6 }}>Create your account</h2>
      <p className="muted" style={{ marginBottom: 24 }}>
        Free plan includes 5 scans per month.
      </p>
      <form onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="region">District / region</label>
          <input id="region" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. Dhaka" />
        </div>
        <div className="field">
          <label htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="field">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <Button block size="lg" type="submit" disabled={loading} style={{ marginTop: 8 }}>
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      <p style={{ marginTop: 18, fontSize: '0.9rem' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--green-600)', fontWeight: 600 }}>
          Sign in
        </Link>
      </p>
    </Card>
  );
}