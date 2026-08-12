import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

interface ApplicantItem {
  id: string;
  eventId: string;
  eventTitle: string;
  purchasedAt: string;
}

export default function ApplicantPage() {
  const [applicants, setApplicants] = useState<ApplicantItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('eventful_token');
    if (!token) {
      setError('Please log in as a creator to view applicants.');
      return;
    }

    apiFetch('/api/applicants/creator', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setApplicants(data))
      .catch(() => setError('Unable to load applicants.'));
  }, []);

  return (
    <section className="page applicants-page">
      <h1>Event Applicants</h1>
      {error && <div className="error-message">{error}</div>}
      {applicants.length === 0 ? (
        <div className="empty-state">No applicants yet. Sell tickets to your events to see applicants.</div>
      ) : (
        <div className="applicants-list">
          {applicants.map((applicant) => (
            <article key={applicant.id} className="panel">
              <h2>{applicant.eventTitle}</h2>
              <p>Ticket ID: {applicant.id}</p>
              <p>Purchased: {new Date(applicant.purchasedAt).toLocaleString()}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
