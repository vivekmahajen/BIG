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
  const data = await res.json();
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
};
