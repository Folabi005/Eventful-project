import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

interface EventItem {
  id: string;
  title: string;
  location: string;
  startsAt: string;
  priceCents: number;
  shareUrl: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiFetch('/api/events')
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => setError('Unable to load events.'));
  }, []);

  const purchaseTicket = async (eventId: string, amountCents: number) => {
    const token = localStorage.getItem('eventful_token');
    if (!token) {
      setMessage('Log in as an eventee to purchase tickets.');
      return;
    }

    setMessage('Processing ticket purchase...');

    const initResponse = await apiFetch('/api/payments/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ eventId, amountCents }),
    });

    if (!initResponse.ok) {
      const body = await initResponse.json();
      setMessage(body.message || 'Unable to initialize payment.');
      return;
    }

    const initData = await initResponse.json();
    const reference = initData.paymentData.reference;
    const verifyResponse = await apiFetch(`/api/payments/verify?reference=${reference}`);
    if (!verifyResponse.ok) {
      const body = await verifyResponse.json();
      setMessage(body.message || 'Unable to verify payment.');
      return;
    }

    const purchaseResponse = await apiFetch('/api/tickets/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ eventId, paymentReference: reference }),
    });

    if (!purchaseResponse.ok) {
      const body = await purchaseResponse.json();
      setMessage(body.message || 'Unable to complete ticket purchase.');
      return;
    }

    setMessage('Ticket purchased successfully. Check your tickets page.');
  };

  return (
    <section className="page events-page">
      <h1>Available Events</h1>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="info-message">{message}</div>}
      <div className="events-list">
        {events.length === 0 ? (
          <div className="empty-state">No events yet. Create one to get started.</div>
        ) : (
          events.map((event) => (
            <article key={event.id} className="event-card">
              <h2>{event.title}</h2>
              <p>{event.location}</p>
              <p>{new Date(event.startsAt).toLocaleString()}</p>
              <p>Price: ₦{(event.priceCents / 100).toFixed(2)}</p>
              <a href={event.shareUrl} target="_blank" rel="noreferrer">
                Share Event
              </a>
              <button onClick={() => purchaseTicket(event.id, event.priceCents)}>
                Purchase Ticket
              </button>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
