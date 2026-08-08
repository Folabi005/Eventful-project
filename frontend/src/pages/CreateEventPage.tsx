import { FormEvent, useState } from 'react';

export default function CreateEventPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    startsAt: '',
    endsAt: '',
    priceCents: 0,
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');

    const token = localStorage.getItem('eventful_token');
    if (!token) {
      setMessage('Please log in as a creator to publish events.');
      return;
    }

    const response = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        ...form,
        reminderOptions: ['1 day before'],
      }),
    });

    if (response.ok) {
      setMessage('Event created successfully.');
      setForm({ title: '', description: '', location: '', startsAt: '', endsAt: '', priceCents: 0 });
    } else {
      const body = await response.json();
      setMessage(body.message || 'Unable to create event.');
    }
  };

  return (
    <section className="page form-page">
      <h1>Create Event</h1>
      <form className="panel form-panel" onSubmit={handleSubmit}>
        <label>
          Title
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>
        <label>
          Description
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>
        <label>
          Location
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </label>
        <label>
          Start
          <input type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
        </label>
        <label>
          End
          <input type="datetime-local" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} />
        </label>
        <label>
          Ticket Price (NGN)
          <input type="number" value={form.priceCents} onChange={(e) => setForm({ ...form, priceCents: Number(e.target.value) })} />
        </label>
        <button type="submit">Create Event</button>
      </form>
      {message && <div className="info-message">{message}</div>}
    </section>
  );
}
