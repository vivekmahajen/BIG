-- Widen verdict column from VARCHAR(10) to VARCHAR(50) to accommodate
-- full verdict strings like "Conditional", "Don't build (as stated)"
ALTER TABLE saved_opportunities ALTER COLUMN verdict TYPE VARCHAR(50);
