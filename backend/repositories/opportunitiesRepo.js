const db = require('../db');

async function saveOpportunity({ userId, state, city, zip, sector, sectorLabel, cardData }) {
  const score = parseFloat(cardData?.overallScore || cardData?.score) || 0;
  const conviction = cardData?.conviction || null;
  const verdict = cardData?.verdict || null;

  const sql = `
    INSERT INTO saved_opportunities
      (user_id, state, city, zip, sector, sector_label, card_data, score, conviction, verdict)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id, created_at, score, conviction, verdict
  `;
  const { rows } = await db.query(sql, [
    userId, state, city, zip, sector, sectorLabel,
    JSON.stringify(cardData), score, conviction, verdict,
  ]);
  return rows[0];
}

async function getUserOpportunities(userId, options = {}) {
  const {
    sortBy = 'score', sortDir = 'DESC',
    sector = null, verdict = null,
    watchlistOnly = false, search = null,
    limit = 50, offset = 0,
  } = options;

  const allowedSorts = { score: 'score', created_at: 'created_at', updated_at: 'updated_at', city: 'city', sector: 'sector' };
  const safeSort = allowedSorts[sortBy] || 'score';
  const safeDir = sortDir === 'ASC' ? 'ASC' : 'DESC';

  const conditions = ['user_id = $1', 'is_deleted = FALSE'];
  const values = [userId];
  let i = 2;

  if (sector) { conditions.push(`sector = $${i++}`); values.push(sector); }
  if (verdict) { conditions.push(`verdict = $${i++}`); values.push(verdict); }
  if (watchlistOnly) { conditions.push('is_watchlisted = TRUE'); }
  if (search) {
    conditions.push(`(
      COALESCE(opportunity_name, opportunity_name_alt) ILIKE $${i} OR
      city ILIKE $${i} OR sector_label ILIKE $${i} OR tagline ILIKE $${i}
    )`);
    values.push(`%${search}%`);
    i++;
  }

  values.push(limit, offset);
  const { rows } = await db.query(
    `SELECT * FROM opportunity_summaries WHERE ${conditions.join(' AND ')}
     ORDER BY ${safeSort} ${safeDir}, created_at DESC
     LIMIT $${i++} OFFSET $${i++}`,
    values
  );
  return rows;
}

async function getUserOpportunityCount(userId, options = {}) {
  const { sector, verdict, watchlistOnly, search } = options;
  const conditions = ['user_id = $1', 'is_deleted = FALSE'];
  const values = [userId];
  let i = 2;

  if (sector) { conditions.push(`sector = $${i++}`); values.push(sector); }
  if (verdict) { conditions.push(`verdict = $${i++}`); values.push(verdict); }
  if (watchlistOnly) { conditions.push('is_watchlisted = TRUE'); }
  if (search) {
    conditions.push(`(COALESCE(opportunity_name, opportunity_name_alt) ILIKE $${i} OR city ILIKE $${i})`);
    values.push(`%${search}%`);
    i++;
  }

  const { rows } = await db.query(
    `SELECT COUNT(*) FROM opportunity_summaries WHERE ${conditions.join(' AND ')}`,
    values
  );
  return parseInt(rows[0].count);
}

async function getOpportunityById(id, userId) {
  const { rows } = await db.query(
    `SELECT * FROM saved_opportunities WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE`,
    [id, userId]
  );
  return rows[0] || null;
}

async function findExistingSave({ userId, state, city, zip, sector }) {
  const { rows } = await db.query(
    `SELECT id, is_watchlisted FROM saved_opportunities
     WHERE user_id = $1 AND state = $2 AND city = $3 AND zip = $4 AND sector = $5
     AND is_deleted = FALSE ORDER BY created_at DESC LIMIT 1`,
    [userId, state, city, zip, sector]
  );
  return rows[0] || null;
}

async function toggleWatchlist(id, userId) {
  const { rows } = await db.query(
    `UPDATE saved_opportunities SET is_watchlisted = NOT is_watchlisted
     WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE
     RETURNING id, is_watchlisted, updated_at`,
    [id, userId]
  );
  return rows[0] || null;
}

async function updateNotes(id, userId, notes) {
  const { rows } = await db.query(
    `UPDATE saved_opportunities SET notes = $3
     WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE
     RETURNING id, notes, updated_at`,
    [id, userId, notes]
  );
  return rows[0] || null;
}

async function updateTags(id, userId, tags) {
  const { rows } = await db.query(
    `UPDATE saved_opportunities SET tags = $3
     WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE
     RETURNING id, tags, updated_at`,
    [id, userId, tags]
  );
  return rows[0] || null;
}

async function deleteOpportunity(id, userId) {
  const { rows } = await db.query(
    `UPDATE saved_opportunities SET is_deleted = TRUE, deleted_at = NOW()
     WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE
     RETURNING id`,
    [id, userId]
  );
  return rows[0] || null;
}

async function getUserStats(userId) {
  const { rows } = await db.query(`
    SELECT
      COUNT(*)                                       AS total_saved,
      COUNT(*) FILTER (WHERE is_watchlisted = TRUE)  AS watchlisted,
      ROUND(AVG(score), 1)                           AS avg_score,
      COUNT(DISTINCT sector)                         AS sectors_explored,
      COUNT(DISTINCT city || ',' || state)           AS cities_explored,
      MAX(created_at)                                AS last_saved_at
    FROM saved_opportunities
    WHERE user_id = $1 AND is_deleted = FALSE
  `, [userId]);
  return rows[0];
}

module.exports = {
  saveOpportunity, getUserOpportunities, getUserOpportunityCount,
  getOpportunityById, findExistingSave, toggleWatchlist,
  updateNotes, updateTags, deleteOpportunity, getUserStats,
};
