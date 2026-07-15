import { useEffect } from 'react';

interface ToastProps {
  message: string;
  onDone: () => void;
  durationMs?: number;
}

export default function Toast({ message, onDone, durationMs = 3000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDone, durationMs);
    return () => clearTimeout(t);
  }, [onDone, durationMs]);
  return (
    <div className="toast" role="status">
      {message}
    </div>
  );
}
