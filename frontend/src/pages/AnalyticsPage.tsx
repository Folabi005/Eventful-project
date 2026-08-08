import { useEffect, useState } from 'react';

interface Stats {
  totalAttendees: number;
  totalTicketsSold: number;
  totalScanned: number;
  totalPayments: number;
  totalRevenueCents: number;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('eventful_token');
    if (!token) {
      setError('Please log in as a creator to see analytics.');
      return;
    }
    fetch('/api/analytics/creator', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setError('Unable to load analytics.'));
  }, []);

  return (
    <section className="page analytics-page">
      <h1>Creator Analytics</h1>
      {error && <div className="error-message">{error}</div>}
      {stats ? (
        <div className="analytics-grid">
          <div className="panel">
            <h2>Total attendees</h2>
            <p>{stats.totalAttendees}</p>
          </div>
          <div className="panel">
            <h2>Total tickets sold</h2>
            <p>{stats.totalTicketsSold}</p>
          </div>
          <div className="panel">
            <h2>Total scanned</h2>
            <p>{stats.totalScanned}</p>
          </div>
          <div className="panel">
            <h2>Total payments</h2>
            <p>{stats.totalPayments}</p>
          </div>
          <div className="panel">
            <h2>Total revenue</h2>
            <p>₦{(stats.totalRevenueCents / 100).toFixed(2)}</p>
          </div>
        </div>
      ) : (
        !error && <div className="empty-state">Load creator analytics by logging in.</div>
      )}
    </section>
  );
}
