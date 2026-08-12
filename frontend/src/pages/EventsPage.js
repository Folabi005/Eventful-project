import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    useEffect(() => {
        apiFetch('/api/events')
            .then((res) => res.json())
            .then((data) => setEvents(data))
            .catch(() => setError('Unable to load events.'));
    }, []);
    const purchaseTicket = async (eventId, amountCents) => {
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
    return (_jsxs("section", { className: "page events-page", children: [_jsx("h1", { children: "Available Events" }), error && _jsx("div", { className: "error-message", children: error }), message && _jsx("div", { className: "info-message", children: message }), _jsx("div", { className: "events-list", children: events.length === 0 ? (_jsx("div", { className: "empty-state", children: "No events yet. Create one to get started." })) : (events.map((event) => (_jsxs("article", { className: "event-card", children: [_jsx("h2", { children: event.title }), _jsx("p", { children: event.location }), _jsx("p", { children: new Date(event.startsAt).toLocaleString() }), _jsxs("p", { children: ["Price: \u20A6", (event.priceCents / 100).toFixed(2)] }), _jsx("a", { href: event.shareUrl, target: "_blank", rel: "noreferrer", children: "Share Event" }), _jsx("button", { onClick: () => purchaseTicket(event.id, event.priceCents), children: "Purchase Ticket" })] }, event.id)))) })] }));
}
