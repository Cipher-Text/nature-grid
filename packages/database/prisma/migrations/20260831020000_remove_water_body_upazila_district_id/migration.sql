-- Remove districtId from WaterBodyUpazila — district can be resolved via
-- the upazila FK (upazila.districtId) without duplicating it on the junction.
ALTER TABLE "WaterBodyUpazila" DROP CONSTRAINT IF EXISTS "WaterBodyUpazila_districtId_fkey";
ALTER TABLE "WaterBodyUpazila" DROP COLUMN IF EXISTS "districtId";
