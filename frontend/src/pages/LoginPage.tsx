import { FormEvent, useState } from 'react';
import { apiFetch } from '../lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');

    const response = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('eventful_token', data.token);
      localStorage.setItem('eventful_user', JSON.stringify(data.user));
      setMessage('Logged in successfully.');
    } else {
      const body = await response.json();
      setMessage(body.message || 'Unable to log in.');
    }
  };

  return (
    <section className="page form-page">
      <h1>Login</h1>
      <form className="panel form-panel" onSubmit={handleSubmit}>
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <button type="submit">Login</button>
      </form>
      {message && <div className="info-message">{message}</div>}
    </section>
  );
}
