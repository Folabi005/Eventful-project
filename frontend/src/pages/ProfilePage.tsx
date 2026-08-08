import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [reminders, setReminders] = useState<Array<{ id: string; eventId: string; remindAt: string }>>([]);
  const [error, setError] = useState('');
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('eventful_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const token = localStorage.getItem('eventful_token');
    if (!token) {
      setError('Please log in to see reminders.');
      return;
    }
    fetch('/api/reminders/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setReminders(data))
      .catch(() => setError('Unable to load reminders.'));
  }, []);

  return (
    <section className="page reminders-page">
      <h1>Profile</h1>
      {user ? (
        <div className="panel">
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      ) : (
        <div className="empty-state">Log in to view your profile and reminders.</div>
      )}
      <h2>My Reminders</h2>
      {error && <div className="error-message">{error}</div>}
      {reminders.length === 0 ? (
        <div className="empty-state">No reminders set yet. Create an event or set a reminder.</div>
      ) : (
        <div className="reminders-list">
          {reminders.map((reminder) => (
            <article key={reminder.id} className="panel">
              <p>Event ID: {reminder.eventId}</p>
              <p>Remind At: {new Date(reminder.remindAt).toLocaleString()}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
