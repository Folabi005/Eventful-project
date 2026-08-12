import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx(BrowserRouter, { children: _jsxs("div", { className: "app-shell", children: [_jsxs("header", { className: "app-header", children: [_jsx("div", { className: "brand", children: "Eventful" }), _jsxs("nav", { children: [_jsx(Link, { to: "/", children: "Home" }), _jsx(Link, { to: "/events", children: "Events" }), _jsx(Link, { to: "/create", children: "Create Event" }), _jsx(Link, { to: "/tickets", children: "Tickets" }), _jsx(Link, { to: "/analytics", children: "Analytics" }), _jsx(Link, { to: "/applicants", children: "Applicants" }), _jsx(Link, { to: "/profile", children: "Profile" }), _jsx(Link, { to: "/login", children: "Login" }), _jsx(Link, { to: "/register", children: "Register" })] })] }), _jsx("main", { className: "app-main", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/events", element: _jsx(EventsPage, {}) }), _jsx(Route, { path: "/create", element: _jsx(CreateEventPage, {}) }), _jsx(Route, { path: "/tickets", element: _jsx(TicketPage, {}) }), _jsx(Route, { path: "/analytics", element: _jsx(AnalyticsPage, {}) }), _jsx(Route, { path: "/applicants", element: _jsx(ApplicantPage, {}) }), _jsx(Route, { path: "/profile", element: _jsx(ProfilePage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterPage, {}) })] }) })] }) }));
}
