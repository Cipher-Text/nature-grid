-- Replace raw district/upazila name strings on WaterLevelStation with FK references.
-- Existing name-string data is discarded (stations will be re-seeded with IDs).

ALTER TABLE "WaterLevelStation"
  DROP COLUMN IF EXISTS "district",
  DROP COLUMN IF EXISTS "upazila",
  ADD COLUMN "districtId" TEXT,
  ADD COLUMN "upazilaId"  TEXT;

ALTER TABLE "WaterLevelStation"
  ADD CONSTRAINT "WaterLevelStation_districtId_fkey"
    FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "WaterLevelStation_upazilaId_fkey"
    FOREIGN KEY ("upazilaId") REFERENCES "Upazila"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "WaterLevelStation_districtId_idx" ON "WaterLevelStation"("districtId");
CREATE INDEX "WaterLevelStation_upazilaId_idx"  ON "WaterLevelStation"("upazilaId");
