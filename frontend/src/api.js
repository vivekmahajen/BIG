const _ROOT = (process.env.REACT_APP_API_URL || 'https://big-hm1k.onrender.com').replace(/\/$/, '');
const BASE = _ROOT.endsWith('/api') ? _ROOT : `${_ROOT}/api`;

function parseCostMax(str) {
  if (!str) return Infinity;
  const upper = str.split(/[–\-]/).pop();
  const m = upper.replace(/,/g, '').match(/\$?([\d.]+)\s*([KMB]?)/i);
  if (!m) return Infinity;
  const n = parseFloat(m[1]);
  const u = m[2].toUpperCase();
  return u === 'M' ? n * 1e6 : u === 'B' ? n * 1e9 : u === 'K' ? n * 1e3 : n;
}

async function generateWithBudgetCheck(path, body, budget) {
  const idea = await request(path, { method: 'POST', body: JSON.stringify(body) });
  if (budget) {
    const costMax = parseCostMax(idea.startupCost);
    if (costMax > budget.max) {
      throw new Error(`No viable idea found within the $${budget.min.toLocaleString()}–$${budget.max.toLocaleString()} budget range. Try a different sector or relax the budget filter.`);
    }
  }
  return idea;
}

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

  generateIdea: (sector, zip, city, state, budget) =>
    generateWithBudgetCheck('/generate-idea', { sector, zip, city, state, budget }, budget),

  generateBlueOcean: (sector, zip, city, state, budget) =>
    generateWithBudgetCheck('/generate-blue-ocean', { sector, zip, city, state, budget }, budget),

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

  liveCard: (state, city, zip, sector) =>
    request('/live-card', { method: 'POST', body: JSON.stringify({ state, city, zip, sector }) }),

  resetRequest: (email) =>
    request('/reset-request', { method: 'POST', body: JSON.stringify({ email }) }),
  resetValidate: (token) =>
    request(`/reset-validate?token=${encodeURIComponent(token)}`),
  resetPassword: (token, password) =>
    request('/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),

  intlCountries: () => request('/intl/countries'),
  intlRegions: (countryCode) => request(`/intl/${countryCode}/regions`),
  intlCities: (countryCode, regionCode) => request(`/intl/${countryCode}/${regionCode}/cities`),
  intlAreas: (countryCode, regionCode, cityName) =>
    request(`/intl/${countryCode}/${regionCode}/${encodeURIComponent(cityName)}/areas`),
  generateIntlIdea: (payload) =>
    request('/generate-intl-idea', { method: 'POST', body: JSON.stringify(payload) }),
};
