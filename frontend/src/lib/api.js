export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export function apiUrl(path) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE}${normalizedPath}`;
}
export function apiFetch(path, init) {
    return fetch(apiUrl(path), init);
}
