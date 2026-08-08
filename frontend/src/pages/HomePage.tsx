export default function HomePage() {
  return (
    <section className="page home-page">
      <div className="hero-card">
        <h1>Experience the moments that matter.</h1>
        <p>Discover events, buy tickets, and manage your schedule with ease.</p>
      </div>
      <div className="feature-grid">
        <article>
          <h2>For creators</h2>
          <p>Publish events, track ticket sales, and send reminders to attendees.</p>
        </article>
        <article>
          <h2>For eventees</h2>
          <p>Browse events, purchase tickets, and get QR code check-in support.</p>
        </article>
        <article>
          <h2>Analytics</h2>
          <p>See attendance and payment info across every event.</p>
        </article>
      </div>
    </section>
  );
}
