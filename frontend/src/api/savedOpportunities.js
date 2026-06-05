// Uses the same BASE and token key as the existing api.js
const BASE = process.env.REACT_APP_API_URL || '/api';

function headers() {
  const token = localStorage.getItem('big_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, { ...options, headers: headers() });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data.error || data.detail || `HTTP ${res.status}`);
  return data;
}

export const saveOpportunity = (payload) =>
  req('/saved-opportunities', { method: 'POST', body: JSON.stringify(payload) });

export const getSavedOpportunities = (params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== null && v !== undefined && v !== '') q.set(k, v); });
  return req(`/saved-opportunities?${q}`);
};

export const toggleWatchlist = (id) =>
  req(`/saved-opportunities/${id}/watchlist`, { method: 'PATCH' });

export const updateNotes = (id, notes) =>
  req(`/saved-opportunities/${id}/notes`, { method: 'PATCH', body: JSON.stringify({ notes }) });

export const deleteOpportunity = (id) =>
  req(`/saved-opportunities/${id}`, { method: 'DELETE' });
