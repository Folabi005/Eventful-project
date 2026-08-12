import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
export default function ProfilePage() {
    const [reminders, setReminders] = useState([]);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
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
        apiFetch('/api/reminders/me', { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => res.json())
            .then((data) => setReminders(data))
            .catch(() => setError('Unable to load reminders.'));
    }, []);
    return (_jsxs("section", { className: "page reminders-page", children: [_jsx("h1", { children: "Profile" }), user ? (_jsxs("div", { className: "panel", children: [_jsxs("p", { children: ["Email: ", user.email] }), _jsxs("p", { children: ["Role: ", user.role] })] })) : (_jsx("div", { className: "empty-state", children: "Log in to view your profile and reminders." })), _jsx("h2", { children: "My Reminders" }), error && _jsx("div", { className: "error-message", children: error }), reminders.length === 0 ? (_jsx("div", { className: "empty-state", children: "No reminders set yet. Create an event or set a reminder." })) : (_jsx("div", { className: "reminders-list", children: reminders.map((reminder) => (_jsxs("article", { className: "panel", children: [_jsxs("p", { children: ["Event ID: ", reminder.eventId] }), _jsxs("p", { children: ["Remind At: ", new Date(reminder.remindAt).toLocaleString()] })] }, reminder.id))) }))] }));
}
