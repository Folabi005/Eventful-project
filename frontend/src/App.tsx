import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import CreateEventPage from './pages/CreateEventPage';
import TicketPage from './pages/TicketPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import ApplicantPage from './pages/ApplicantPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <div className="brand">Eventful</div>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/events">Events</Link>
            <Link to="/create">Create Event</Link>
            <Link to="/tickets">Tickets</Link>
            <Link to="/analytics">Analytics</Link>
            <Link to="/applicants">Applicants</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/create" element={<CreateEventPage />} />
            <Route path="/tickets" element={<TicketPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/applicants" element={<ApplicantPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
