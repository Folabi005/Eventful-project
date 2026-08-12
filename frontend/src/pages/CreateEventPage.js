import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
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
    const handleSubmit = async (event) => {
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
        }
        else {
            const body = await response.json();
            setMessage(body.message || 'Unable to create event.');
        }
    };
    return (_jsxs("section", { className: "page form-page", children: [_jsx("h1", { children: "Create Event" }), _jsxs("form", { className: "panel form-panel", onSubmit: handleSubmit, children: [_jsxs("label", { children: ["Title", _jsx("input", { value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }) })] }), _jsxs("label", { children: ["Description", _jsx("textarea", { value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }) })] }), _jsxs("label", { children: ["Location", _jsx("input", { value: form.location, onChange: (e) => setForm({ ...form, location: e.target.value }) })] }), _jsxs("label", { children: ["Start", _jsx("input", { type: "datetime-local", value: form.startsAt, onChange: (e) => setForm({ ...form, startsAt: e.target.value }) })] }), _jsxs("label", { children: ["End", _jsx("input", { type: "datetime-local", value: form.endsAt, onChange: (e) => setForm({ ...form, endsAt: e.target.value }) })] }), _jsxs("label", { children: ["Ticket Price (NGN)", _jsx("input", { type: "number", value: form.priceCents, onChange: (e) => setForm({ ...form, priceCents: Number(e.target.value) }) })] }), _jsx("button", { type: "submit", children: "Create Event" })] }), message && _jsx("div", { className: "info-message", children: message })] }));
}
