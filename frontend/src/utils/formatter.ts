export function formatBdt(amount: number): string {
  return `৳${new Intl.NumberFormat('en-IN').format(Math.round(amount))}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function formatPct(value: number): string {
  return `${Math.round(value)}%`;
}
