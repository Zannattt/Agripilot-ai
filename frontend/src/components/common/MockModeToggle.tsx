import { useState } from 'react';
import { isMockMode, setMockMode } from '../../services/api';

/**
 * Visible reminder that the app is running against the in-memory mock
 * backend. Click to switch to real /api requests (requires FastAPI running).
 */
export default function MockModeToggle() {
  const [mock, setMock] = useState(isMockMode());

  function toggle() {
    const next = !mock;
    setMockMode(next);
    setMock(next);
    window.location.reload(); // drop in-memory mock state cleanly
  }

  return (
    <button
      type="button"
      className={`mock-pill ${mock ? '' : 'live'}`}
      onClick={toggle}
      title={mock ? 'Using mock data. Click to call the real API.' : 'Calling real API. Click for mock data.'}
    >
      <span className="dot" />
      {mock ? 'Demo data' : 'Live API'}
    </button>
  );
}
