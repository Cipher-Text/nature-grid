-- Add districtId to WaterBodyUpazila (later removed in 20260831020000)
ALTER TABLE "WaterBodyUpazila" ADD COLUMN IF NOT EXISTS "districtId" TEXT;

ALTER TABLE "WaterBodyUpazila" DROP CONSTRAINT IF EXISTS "WaterBodyUpazila_districtId_fkey";
ALTER TABLE "WaterBodyUpazila" ADD CONSTRAINT "WaterBodyUpazila_districtId_fkey"
    FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;
