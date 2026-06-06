// Use relative /api path so requests go through Vercel's proxy rewrite to the backend
const BASE_URL = '';

function authHeaders() {
  const token = localStorage.getItem('big_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Fetch a public analysis by its publicId — no auth required.
 * @param {string} publicId
 */
export async function getPublicAnalysis(publicId) {
  const res = await fetch(`${BASE_URL}/api/share/${publicId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load analysis');
  return data;
}

/**
 * Generate (or retrieve) the shareable link for a saved opportunity.
 * @param {string} opportunityId - UUID of the saved_opportunities row
 * @returns {{ publicId, shareUrl, shareCount }}
 */
export async function generateShareLink(opportunityId) {
  const res = await fetch(`${BASE_URL}/api/share/generate`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ opportunityId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to generate share link');
  return data;
}

/**
 * Update visibility of a saved opportunity.
 * @param {string} opportunityId
 * @param {boolean} isPublic
 */
export async function setShareVisibility(opportunityId, isPublic) {
  const res = await fetch(`${BASE_URL}/api/share/${opportunityId}/visibility`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ isPublic }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update visibility');
  return data;
}

/**
 * Claim a referral (called after signup when ?ref= is present in URL).
 * @param {string} referralCode
 * @param {string|null} publicId
 */
export async function claimReferral(referralCode, publicId = null) {
  const res = await fetch(`${BASE_URL}/api/referrals/claim`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ referralCode, publicId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to claim referral');
  return data;
}
