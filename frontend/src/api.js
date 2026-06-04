const BASE = process.env.REACT_APP_API_URL || '/api';

function getToken() {
  return localStorage.getItem('big_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const text = await res.text();
  if (!text) throw new Error('No response from server — check your API URL configuration.');
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Server returned an unexpected response. The backend may be unreachable.');
  }
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  login: (email, password) =>
    request('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (email, name, password) =>
    request('/register', { method: 'POST', body: JSON.stringify({ email, name, password }) }),

  me: () => request('/me'),

  states: () => request('/geo/states'),
  cities: (stateCode) => request(`/geo/cities?stateCode=${stateCode}`),
  zips: (stateCode, city) =>
    request(`/geo/zips?stateCode=${encodeURIComponent(stateCode)}&city=${encodeURIComponent(city)}`),

  sectors: (zip) => request(`/sectors?zip=${zip}`),
  opportunity: (zip, sector) =>
    request(`/opportunity?zip=${encodeURIComponent(zip)}&sector=${encodeURIComponent(sector)}`),
  sectorOpportunities: (sector) =>
    request(`/sector-opportunities?sector=${encodeURIComponent(sector)}`),

  generateIdea: (sector, zip, city, state) =>
    request('/generate-idea', {
      method: 'POST',
      body: JSON.stringify({ sector, zip, city, state }),
    }),

  competitorCompare: (businessName, sector, competitors) =>
    request('/competitor-compare', {
      method: 'POST',
      body: JSON.stringify({ businessName, sector, competitors }),
    }),

  competitiveAnalysis: (payload) =>
    request('/competitive-analysis', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  credits: () => request('/credits'),
  pricing: () => request('/pricing'),
  buyPack: (packId) => request('/buy-pack', { method: 'POST', body: JSON.stringify({ packId }) }),
};
