// api.js: one place to talk to the Express backend.
// The URL comes from VITE_API_URL (set in client/.env). If it is missing we
// fall back to a relative path so the app still works when built and served
// from the same origin as the API (e.g. behind a reverse proxy in production).
// Week 4 adds checkout (Stripe) and order lookup endpoints.
const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // send/receive the session cookie
    ...options,
  });

  // 204 No Content (e.g. logout) has no body to parse.
  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch {
    // server returned non-JSON (e.g. a 500 HTML page) - keep data null.
  }

  if (!res.ok) {
    throw new Error((data && data.error) || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  // GET /api/items
  getItems: () => request('/items'),

  // GET /api/items/:id
  getItem: (id) => request(`/items/${id}`),

  // POST /api/auth/signup
  signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),

  // POST /api/auth/login
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  // POST /api/auth/logout
  logout: () => request('/auth/logout', { method: 'POST' }),

  // GET /api/auth/me
  me: () => request('/auth/me'),

  // POST /api/checkout - create Stripe Checkout Session
  checkout: (body) => request('/checkout', { method: 'POST', body: JSON.stringify(body) }),

  // GET /api/orders/:id - fetch order by Stripe session ID
  getOrder: (checkoutSessionId) => request(`/orders/${checkoutSessionId}`),
};

export default api;