const db = require('../db');

// ── CREATE ────────────────────────────────────────────────────────────────────

async function saveOpportunity({ userEmail, state, city, zip, sector, sectorLabel, cardData }) {
  // Support both structured card_data (live card) and flat idea cards
  const rawScore = cardData?.overallScore ?? cardData?.score;
  const score = Math.min(10, Math.max(0, Math.round(parseFloat(rawScore) || 0)));
  const conviction = cardData?.conviction || null;
  const verdict = cardData?.verdict || null;

  const sql = `
    INSERT INTO saved_opportunities
      (user_email, state, city, zip, sector, sector_label, card_data, score, conviction, verdict)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id, created_at, score, conviction, verdict
  `;
  const { rows } = await db.query(sql, [
    userEmail, state, city, zip, sector, sectorLabel,
    JSON.stringify(cardData), score, conviction, verdict,
  ]);
  return rows[0];
}

// ── READ ──────────────────────────────────────────────────────────────────────

async function getUserOpportunities(userEmail, options = {}) {
  const {
    sortBy        = 'score',
    sortDir       = 'DESC',
    sector        = null,
    verdict       = null,
    watchlistOnly = false,
    search        = null,
    limit         = 50,
    offset        = 0,
  } = options;

  const allowedSorts = {
    score: 'score', created_at: 'created_at', updated_at: 'updated_at',
    city: 'city', sector: 'sector',
  };
  const safeSort   = allowedSorts[sortBy] || 'score';
  const safeDirSQL = sortDir === 'ASC' ? 'ASC' : 'DESC';

  const conditions = ['user_email = $1'];
  const values = [userEmail];
  let p = 2;

  if (sector)        { conditions.push(`sector = $${p++}`);  values.push(sector); }
  if (verdict)       { conditions.push(`verdict = $${p++}`); values.push(verdict); }
  if (watchlistOnly) { conditions.push('is_watchlisted = TRUE'); }
  if (search) {
    conditions.push(`(
      COALESCE(opportunity_name, card_name, '') ILIKE $${p} OR
      city ILIKE $${p} OR
      COALESCE(sector_label, sector) ILIKE $${p} OR
      COALESCE(tagline, '') ILIKE $${p}
    )`);
    values.push(`%${search}%`);
    p++;
  }

  const where = conditions.join(' AND ');
  const sql = `
    SELECT * FROM opportunity_summaries
    WHERE ${where}
    ORDER BY ${safeSort} ${safeDirSQL}, created_at DESC
    LIMIT $${p++} OFFSET $${p++}
  `;
  values.push(limit, offset);

  const { rows } = await db.query(sql, values);
  return rows;
}

async function getUserOpportunityCount(userEmail, options = {}) {
  const { sector, verdict, watchlistOnly, search } = options;
  const conditions = ['user_email = $1'];
  const values = [userEmail];
  let p = 2;

  if (sector)        { conditions.push(`sector = $${p++}`);  values.push(sector); }
  if (verdict)       { conditions.push(`verdict = $${p++}`); values.push(verdict); }
  if (watchlistOnly) { conditions.push('is_watchlisted = TRUE'); }
  if (search) {
    conditions.push(`(COALESCE(opportunity_name, card_name, '') ILIKE $${p} OR city ILIKE $${p})`);
    values.push(`%${search}%`);
    p++;
  }

  const { rows } = await db.query(
    `SELECT COUNT(*) FROM opportunity_summaries WHERE ${conditions.join(' AND ')}`,
    values,
  );
  return parseInt(rows[0].count);
}

async function getOpportunityById(id, userEmail) {
  const { rows } = await db.query(
    `SELECT * FROM saved_opportunities WHERE id = $1 AND user_email = $2 AND is_deleted = FALSE`,
    [id, userEmail],
  );
  return rows[0] || null;
}

async function findExistingSave({ userEmail, state, city, zip, sector }) {
  const { rows } = await db.query(
    `SELECT id, is_watchlisted FROM saved_opportunities
     WHERE user_email = $1 AND state = $2 AND city = $3 AND zip = $4 AND sector = $5
     AND is_deleted = FALSE
     ORDER BY created_at DESC LIMIT 1`,
    [userEmail, state, city, zip, sector],
  );
  return rows[0] || null;
}

// ── UPDATE ────────────────────────────────────────────────────────────────────

async function toggleWatchlist(id, userEmail) {
  const { rows } = await db.query(
    `UPDATE saved_opportunities
     SET is_watchlisted = NOT is_watchlisted
     WHERE id = $1 AND user_email = $2 AND is_deleted = FALSE
     RETURNING id, is_watchlisted, updated_at`,
    [id, userEmail],
  );
  return rows[0] || null;
}

async function updateNotes(id, userEmail, notes) {
  const { rows } = await db.query(
    `UPDATE saved_opportunities
     SET notes = $3
     WHERE id = $1 AND user_email = $2 AND is_deleted = FALSE
     RETURNING id, notes, updated_at`,
    [id, userEmail, notes],
  );
  return rows[0] || null;
}

async function updateTags(id, userEmail, tags) {
  const { rows } = await db.query(
    `UPDATE saved_opportunities
     SET tags = $3
     WHERE id = $1 AND user_email = $2 AND is_deleted = FALSE
     RETURNING id, tags, updated_at`,
    [id, userEmail, tags],
  );
  return rows[0] || null;
}

// ── DELETE (soft) ─────────────────────────────────────────────────────────────

async function deleteOpportunity(id, userEmail) {
  const { rows } = await db.query(
    `UPDATE saved_opportunities
     SET is_deleted = TRUE, deleted_at = NOW()
     WHERE id = $1 AND user_email = $2 AND is_deleted = FALSE
     RETURNING id`,
    [id, userEmail],
  );
  return rows[0] || null;
}

// ── STATS ─────────────────────────────────────────────────────────────────────

async function getUserStats(userEmail) {
  const { rows } = await db.query(`
    SELECT
      COUNT(*)                                       AS total_saved,
      COUNT(*) FILTER (WHERE is_watchlisted = TRUE)  AS watchlisted,
      ROUND(AVG(score), 1)                           AS avg_score,
      COUNT(DISTINCT sector)                         AS sectors_explored,
      COUNT(DISTINCT city || ',' || state)           AS cities_explored,
      MAX(created_at)                                AS last_saved_at
    FROM saved_opportunities
    WHERE user_email = $1 AND is_deleted = FALSE
  `, [userEmail]);
  return rows[0];
}

module.exports = {
  saveOpportunity,
  getUserOpportunities,
  getUserOpportunityCount,
  getOpportunityById,
  findExistingSave,
  toggleWatchlist,
  updateNotes,
  updateTags,
  deleteOpportunity,
  getUserStats,
};
