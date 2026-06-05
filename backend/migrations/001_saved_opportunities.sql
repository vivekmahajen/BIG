-- ============================================================
-- Migration 001: saved_opportunities
-- Uses user_email as identifier (users are currently in-memory)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS saved_opportunities (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User identifier (email from JWT — stable unique key)
  user_email      TEXT        NOT NULL,

  -- Geography
  state           VARCHAR(50)  NOT NULL,
  city            VARCHAR(100) NOT NULL,
  zip             VARCHAR(10)  NOT NULL,
  sector          VARCHAR(50)  NOT NULL,
  sector_label    VARCHAR(100),

  -- Full AI-generated card stored as JSONB
  card_data       JSONB        NOT NULL,

  -- Denormalized fields for fast dashboard sorting
  score           SMALLINT     NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 10),
  conviction      VARCHAR(20),
  verdict         VARCHAR(10),

  -- User annotations
  notes           TEXT,
  tags            TEXT[],

  -- Watchlist flag
  is_watchlisted  BOOLEAN      NOT NULL DEFAULT FALSE,

  -- Timestamps
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  -- Soft delete
  is_deleted      BOOLEAN      NOT NULL DEFAULT FALSE,
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_saved_opps_user_score
  ON saved_opportunities (user_email, score DESC)
  WHERE is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS idx_saved_opps_watchlist
  ON saved_opportunities (user_email, is_watchlisted)
  WHERE is_deleted = FALSE AND is_watchlisted = TRUE;

CREATE INDEX IF NOT EXISTS idx_saved_opps_geo
  ON saved_opportunities (state, city, zip)
  WHERE is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS idx_saved_opps_sector
  ON saved_opportunities (sector)
  WHERE is_deleted = FALSE;

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

CREATE OR REPLACE VIEW opportunity_summaries AS
SELECT
  id,
  user_email,
  state,
  city,
  zip,
  sector,
  sector_label,
  score,
  conviction,
  verdict,
  is_watchlisted,
  tags,
  notes,
  created_at,
  updated_at,
  card_data->>'opportunityName'            AS opportunity_name,
  card_data->>'name'                       AS card_name,
  card_data->>'tagline'                    AS tagline,
  card_data->>'model'                      AS business_model,
  card_data->'market'->>'demandTrend'      AS demand_trend,
  card_data->'market'->>'marketSaturation' AS market_saturation,
  card_data->'financials'->>'startupCostMin'   AS startup_cost_min,
  card_data->'financials'->>'startupCostMax'   AS startup_cost_max,
  card_data->>'startupCost'                AS startup_cost_raw,
  card_data->'financials'->>'revenueYear1Min'  AS revenue_year1_min,
  card_data->'financials'->>'revenueYear1Max'  AS revenue_year1_max,
  card_data->>'revenueYr1'                 AS revenue_yr1_raw,
  card_data->'dataQuality'->>'lastUpdated' AS data_last_updated,
  card_data->>'score'                      AS card_score_raw
FROM saved_opportunities
WHERE is_deleted = FALSE;
