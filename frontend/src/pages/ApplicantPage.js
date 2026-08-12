import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
export default function ApplicantPage() {
    const [applicants, setApplicants] = useState([]);
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
    return (_jsxs("section", { className: "page applicants-page", children: [_jsx("h1", { children: "Event Applicants" }), error && _jsx("div", { className: "error-message", children: error }), applicants.length === 0 ? (_jsx("div", { className: "empty-state", children: "No applicants yet. Sell tickets to your events to see applicants." })) : (_jsx("div", { className: "applicants-list", children: applicants.map((applicant) => (_jsxs("article", { className: "panel", children: [_jsx("h2", { children: applicant.eventTitle }), _jsxs("p", { children: ["Ticket ID: ", applicant.id] }), _jsxs("p", { children: ["Purchased: ", new Date(applicant.purchasedAt).toLocaleString()] })] }, applicant.id))) }))] }));
}
