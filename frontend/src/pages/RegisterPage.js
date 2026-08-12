import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('eventee');
    const [message, setMessage] = useState('');
    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role }),
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('eventful_token', data.token);
            localStorage.setItem('eventful_user', JSON.stringify(data.user));
            setMessage('Registered successfully.');
        }
        else {
            const body = await response.json();
            setMessage(body.message || 'Unable to register.');
        }
    };
    return (_jsxs("section", { className: "page form-page", children: [_jsx("h1", { children: "Register" }), _jsxs("form", { className: "panel form-panel", onSubmit: handleSubmit, children: [_jsxs("label", { children: ["Email", _jsx("input", { value: email, onChange: (event) => setEmail(event.target.value) })] }), _jsxs("label", { children: ["Password", _jsx("input", { type: "password", value: password, onChange: (event) => setPassword(event.target.value) })] }), _jsxs("label", { children: ["Role", _jsxs("select", { value: role, onChange: (event) => setRole(event.target.value), children: [_jsx("option", { value: "eventee", children: "Eventee" }), _jsx("option", { value: "creator", children: "Creator" })] })] }), _jsx("button", { type: "submit", children: "Register" })] }), message && _jsx("div", { className: "info-message", children: message })] }));
}
