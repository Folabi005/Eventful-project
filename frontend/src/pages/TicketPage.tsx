import { useEffect, useState } from 'react';

interface TicketItem {
  id: string;
  eventId: string;
  purchasedAt: string;
  qrCodeData: string;
}

export default function TicketPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/tickets/me')
      .then((res) => res.json())
      .then((data) => setTickets(data))
      .catch(() => setError('Unable to fetch tickets.'));
  }, []);

  return (
    <section className="page tickets-page">
      <h1>Your Tickets</h1>
      {error && <div className="error-message">{error}</div>}
      {tickets.length === 0 ? (
        <div className="empty-state">No tickets purchased yet.</div>
      ) : (
        <div className="tickets-grid">
          {tickets.map((ticket) => (
            <article key={ticket.id} className="ticket-card">
              <p>Event ID: {ticket.eventId}</p>
              <p>Purchased: {new Date(ticket.purchasedAt).toLocaleString()}</p>
              <img src={ticket.qrCodeData} alt="Ticket QR code" />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
