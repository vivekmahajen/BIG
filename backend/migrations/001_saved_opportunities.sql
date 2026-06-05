-- Migration 001: saved_opportunities
-- user_id is INTEGER to match BIG's in-memory user store (no FK constraint)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS saved_opportunities (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         INTEGER      NOT NULL,
  state           VARCHAR(50)  NOT NULL,
  city            VARCHAR(100) NOT NULL,
  zip             VARCHAR(10)  NOT NULL,
  sector          VARCHAR(100) NOT NULL,
  sector_label    VARCHAR(100),
  card_data       JSONB        NOT NULL,
  score           NUMERIC(4,1) NOT NULL DEFAULT 0,
  notes           TEXT,
  tags            TEXT[]       DEFAULT '{}',
  is_watchlisted  BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  is_deleted      BOOLEAN      NOT NULL DEFAULT FALSE,
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_saved_opps_user_score
  ON saved_opportunities (user_id, score DESC)
  WHERE is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS idx_saved_opps_watchlist
  ON saved_opportunities (user_id, is_watchlisted)
  WHERE is_deleted = FALSE AND is_watchlisted = TRUE;

CREATE INDEX IF NOT EXISTS idx_saved_opps_card_data
  ON saved_opportunities USING GIN (card_data);

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON saved_opportunities;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON saved_opportunities
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Summary view — handles both old card schema (name/score) and new live card schema
CREATE OR REPLACE VIEW opportunity_summaries AS
SELECT
  id,
  user_id,
  state,
  city,
  zip,
  sector,
  sector_label,
  score,
  is_watchlisted,
  tags,
  notes,
  created_at,
  updated_at,
  -- Handle both card schemas: old uses 'name', new uses 'opportunityName'
  COALESCE(card_data->>'name', card_data->>'opportunityName', sector_label) AS opportunity_name,
  COALESCE(card_data->>'tagline', card_data->>'whyItWorks')                 AS tagline,
  card_data->>'startupCost'                                                  AS startup_cost,
  card_data->>'grossMargin'                                                  AS gross_margin,
  card_data->>'revenueYr1'                                                   AS revenue_yr1,
  card_data->>'revenueYr3'                                                   AS revenue_yr3,
  card_data->>'model'                                                        AS business_model,
  card_data->>'verdict'                                                      AS verdict_text,
  COALESCE((card_data->>'liveGenerated')::boolean, false)                   AS live_generated,
  card_data->'_meta'->>'generatedAt'                                        AS data_last_updated
FROM saved_opportunities
WHERE is_deleted = FALSE;
