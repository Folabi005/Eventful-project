import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
export default function AnalyticsPage() {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        const token = localStorage.getItem('eventful_token');
        if (!token) {
            setError('Please log in as a creator to see analytics.');
            return;
        }
        fetch('/api/analytics/creator', { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => res.json())
            .then((data) => setStats(data))
            .catch(() => setError('Unable to load analytics.'));
    }, []);
    return (_jsxs("section", { className: "page analytics-page", children: [_jsx("h1", { children: "Creator Analytics" }), error && _jsx("div", { className: "error-message", children: error }), stats ? (_jsxs("div", { className: "analytics-grid", children: [_jsxs("div", { className: "panel", children: [_jsx("h2", { children: "Total attendees" }), _jsx("p", { children: stats.totalAttendees })] }), _jsxs("div", { className: "panel", children: [_jsx("h2", { children: "Total tickets sold" }), _jsx("p", { children: stats.totalTicketsSold })] }), _jsxs("div", { className: "panel", children: [_jsx("h2", { children: "Total scanned" }), _jsx("p", { children: stats.totalScanned })] }), _jsxs("div", { className: "panel", children: [_jsx("h2", { children: "Total payments" }), _jsx("p", { children: stats.totalPayments })] }), _jsxs("div", { className: "panel", children: [_jsx("h2", { children: "Total revenue" }), _jsxs("p", { children: ["\u20A6", (stats.totalRevenueCents / 100).toFixed(2)] })] })] })) : (!error && _jsx("div", { className: "empty-state", children: "Load creator analytics by logging in." }))] }));
}
