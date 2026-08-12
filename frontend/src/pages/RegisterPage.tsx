import { FormEvent, useState } from 'react';
import { apiFetch } from '../lib/api';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('eventee');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');

    const response = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('eventful_token', data.token);
      localStorage.setItem('eventful_user', JSON.stringify(data.user));
      setMessage('Registered successfully.');
    } else {
      const body = await response.json();
      setMessage(body.message || 'Unable to register.');
    }
  };

  return (
    <section className="page form-page">
      <h1>Register</h1>
      <form className="panel form-panel" onSubmit={handleSubmit}>
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <label>
          Role
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="eventee">Eventee</option>
            <option value="creator">Creator</option>
          </select>
        </label>
        <button type="submit">Register</button>
      </form>
      {message && <div className="info-message">{message}</div>}
    </section>
  );
}
