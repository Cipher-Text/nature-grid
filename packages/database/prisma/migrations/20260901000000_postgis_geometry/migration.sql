-- Enable the PostGIS extension (idempotent — safe to run on a DB that already has it)
CREATE EXTENSION IF NOT EXISTS postgis;

-- ─── District ─────────────────────────────────────────────────────────────────
-- Add a stored generated geography column derived from the existing lat/lng floats.
-- ST_MakePoint(lng, lat) — note longitude first, then latitude (PostGIS convention).
ALTER TABLE "District"
  ADD COLUMN IF NOT EXISTS geom geography(Point, 4326)
  GENERATED ALWAYS AS (
    CASE
      WHEN lat IS NOT NULL AND lng IS NOT NULL
      THEN ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
      ELSE NULL
    END
  ) STORED;

-- GiST spatial index for fast ST_DWithin / ST_Distance queries on District.
CREATE INDEX IF NOT EXISTS "District_geom_idx" ON "District" USING gist(geom);

-- ─── CitizenReport ────────────────────────────────────────────────────────────
ALTER TABLE "CitizenReport"
  ADD COLUMN IF NOT EXISTS geom geography(Point, 4326)
  GENERATED ALWAYS AS (
    CASE
      WHEN lat IS NOT NULL AND lng IS NOT NULL
      THEN ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
      ELSE NULL
    END
  ) STORED;

CREATE INDEX IF NOT EXISTS "CitizenReport_geom_idx" ON "CitizenReport" USING gist(geom);

-- ─── Observation ──────────────────────────────────────────────────────────────
ALTER TABLE "Observation"
  ADD COLUMN IF NOT EXISTS geom geography(Point, 4326)
  GENERATED ALWAYS AS (
    CASE
      WHEN lat IS NOT NULL AND lng IS NOT NULL
      THEN ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
      ELSE NULL
    END
  ) STORED;

CREATE INDEX IF NOT EXISTS "Observation_geom_idx" ON "Observation" USING gist(geom);
