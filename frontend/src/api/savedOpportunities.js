const BASE = process.env.REACT_APP_API_URL || '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('big_token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
}

async function handleResponse(res) {
  const text = await res.text();
  if (!text) throw new Error('Empty response from server');
  let data;
  try { data = JSON.parse(text); } catch { throw new Error('Invalid server response'); }
  if (!res.ok) throw new Error(data.error || data.detail || `HTTP ${res.status}`);
  return data;
}

export async function saveOpportunity({ state, city, zip, sector, sectorLabel, cardData }) {
  const res = await fetch(`${BASE}/saved-opportunities`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ state, city, zip, sector, sectorLabel, cardData }),
  });
  return handleResponse(res);
}

export async function getSavedOpportunities(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== null && v !== undefined && v !== '') query.set(k, v); });
  const res = await fetch(`${BASE}/saved-opportunities?${query}`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function getOpportunityById(id) {
  const res = await fetch(`${BASE}/saved-opportunities/${id}`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function toggleWatchlist(id) {
  const res = await fetch(`${BASE}/saved-opportunities/${id}/watchlist`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function updateNotes(id, notes) {
  const res = await fetch(`${BASE}/saved-opportunities/${id}/notes`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ notes }),
  });
  return handleResponse(res);
}

export async function updateTags(id, tags) {
  const res = await fetch(`${BASE}/saved-opportunities/${id}/tags`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ tags }),
  });
  return handleResponse(res);
}

export async function deleteOpportunity(id) {
  const res = await fetch(`${BASE}/saved-opportunities/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}
