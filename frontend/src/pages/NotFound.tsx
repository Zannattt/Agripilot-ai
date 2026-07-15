import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="app-main">
      <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
        <span className="eyebrow">404</span>
        <h1>This field doesn't exist</h1>
        <p className="muted">The page you're looking for was moved or never planted.</p>
        <Link to="/" className="btn btn--primary" style={{ marginTop: 10 }}>
          Back to home
        </Link>
      </div>
    </main>
  );
}
