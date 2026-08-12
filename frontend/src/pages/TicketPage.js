import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
export default function TicketPage() {
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState('');
    useEffect(() => {
        fetch('/api/tickets/me')
            .then((res) => res.json())
            .then((data) => setTickets(data))
            .catch(() => setError('Unable to fetch tickets.'));
    }, []);
    return (_jsxs("section", { className: "page tickets-page", children: [_jsx("h1", { children: "Your Tickets" }), error && _jsx("div", { className: "error-message", children: error }), tickets.length === 0 ? (_jsx("div", { className: "empty-state", children: "No tickets purchased yet." })) : (_jsx("div", { className: "tickets-grid", children: tickets.map((ticket) => (_jsxs("article", { className: "ticket-card", children: [_jsxs("p", { children: ["Event ID: ", ticket.eventId] }), _jsxs("p", { children: ["Purchased: ", new Date(ticket.purchasedAt).toLocaleString()] }), _jsx("img", { src: ticket.qrCodeData, alt: "Ticket QR code" })] }, ticket.id))) }))] }));
}
