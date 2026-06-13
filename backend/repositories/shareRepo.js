const pool = require('../db');

/**
 * Fetch a public analysis by its public_id UUID.
 * Returns card data + the owner's referral_code from in-memory users.
 * @param {string} publicId
 * @param {Array} users - the in-memory users array (passed in from server)
 */
async function getPublicAnalysis(publicId, users) {
  const result = await pool.query(
    `SELECT id, public_id, user_email, state, city, zip, sector, sector_label,
            card_data, score, conviction, verdict, is_public, view_count, share_count, created_at
     FROM saved_opportunities
     WHERE public_id = $1 AND is_deleted = FALSE`,
    [publicId]
  );
  if (result.rows.length === 0) return null;
  const row = result.rows[0];

  // Increment view count (fire-and-forget)
  pool.query(
    'UPDATE saved_opportunities SET view_count = view_count + 1 WHERE public_id = $1',
    [publicId]
  ).catch(() => {});

  // Find owner's referral_code from in-memory users
  const owner = users.find(u => u.email === row.user_email);
  const referralCode = owner ? owner.referral_code : null;

  return { ...row, referralCode };
}

/**
 * Ensure a share link is active for a saved opportunity.
 * Increments share_count and returns the public_id.
 * @param {string} opportunityId - the UUID of the saved_opportunity row
 * @param {string} userEmail
 */
async function getOrActivateShareLink(opportunityId, userEmail) {
  const result = await pool.query(
    `UPDATE saved_opportunities
     SET share_count = share_count + 1,
         shared_at = COALESCE(shared_at, NOW()),
         is_public = TRUE
     WHERE id = $1 AND user_email = $2 AND is_deleted = FALSE
     RETURNING public_id, share_count`,
    [opportunityId, userEmail]
  );
  if (result.rows.length === 0) return null;
  return result.rows[0];
}

/**
 * Toggle public visibility of a saved opportunity.
 * @param {string} opportunityId
 * @param {string} userEmail
 * @param {boolean} isPublic
 */
async function setVisibility(opportunityId, userEmail, isPublic) {
  const result = await pool.query(
    `UPDATE saved_opportunities SET is_public = $1
     WHERE id = $2 AND user_email = $3 AND is_deleted = FALSE
     RETURNING id, public_id, is_public`,
    [isPublic, opportunityId, userEmail]
  );
  return result.rows[0] || null;
}

/**
 * Process a referral signup.
 * Awards 5 credits to the referrer (in-memory), inserts a referral_events row.
 * Prevents duplicate signups by the same referee (UNIQUE constraint).
 * @param {{ refereeEmail, referralCode, publicId }} params
 * @param {Array} users - the in-memory users array
 */
async function processReferral({ refereeEmail, referralCode, publicId }, users) {
  // Find referrer in in-memory users by referral_code
  const referrer = users.find(u => u.referral_code === referralCode);
  if (!referrer) return { success: false, reason: 'Invalid referral code' };
  if (referrer.email === refereeEmail) return { success: false, reason: 'Cannot refer yourself' };

  try {
    await pool.query(
      `INSERT INTO referral_events (referrer_email, referee_email, public_id, referral_code, credits_awarded)
       VALUES ($1, $2, $3, $4, 5)`,
      [referrer.email, refereeEmail, publicId || null, referralCode]
    );

    // Award 5 credits to referrer in-memory
    referrer.credits = (referrer.credits || 0) + 5;

    // Log credit transaction
    await pool.query(
      `INSERT INTO credit_transactions (user_email, amount, reason) VALUES ($1, 5, $2)`,
      [referrer.email, `referral_signup:${refereeEmail}`]
    ).catch(() => {}); // non-fatal

    return { success: true, creditsAwarded: 5, referrerEmail: referrer.email };
  } catch (err) {
    if (err.code === '23505') {
      // Unique violation on referee_email — already claimed
      return { success: false, reason: 'Referral already claimed for this email' };
    }
    throw err;
  }
}

module.exports = { getPublicAnalysis, getOrActivateShareLink, setVisibility, processReferral };
