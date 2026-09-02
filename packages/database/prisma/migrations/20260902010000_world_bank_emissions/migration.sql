-- Remove user-input emissions system and replace with World Bank API ingestion.

-- Drop emission entries first (FK to PollutionSource)
DROP TABLE IF EXISTS "EmissionEntry";

-- Drop pollution sources (FKs to District, Organization, User)
DROP TABLE IF EXISTS "PollutionSource";

-- Drop obsolete enums
DROP TYPE IF EXISTS "PollutionSourceType";
DROP TYPE IF EXISTS "PollutantType";
DROP TYPE IF EXISTS "EmissionUnit";

-- Remove permission rows no longer needed
DELETE FROM "RolePermission"
WHERE "permissionId" IN (
  SELECT "id" FROM "Permission" WHERE "key" IN ('emissions.manage', 'emissions.report')
);
DELETE FROM "Permission" WHERE "key" IN ('emissions.manage', 'emissions.report');

-- Create national emission reading table (World Bank GHG data)
CREATE TABLE "NationalEmissionReading" (
    "id"            TEXT NOT NULL,
    "year"          INTEGER NOT NULL,
    "indicatorCode" TEXT NOT NULL,
    "indicatorName" TEXT NOT NULL,
    "value"         DOUBLE PRECISION,
    "unit"          TEXT NOT NULL DEFAULT 'Mt CO2e',
    "ingestionJobId" TEXT,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NationalEmissionReading_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "NationalEmissionReading_year_indicatorCode_key"
    ON "NationalEmissionReading"("year", "indicatorCode");

CREATE INDEX "NationalEmissionReading_indicatorCode_idx"
    ON "NationalEmissionReading"("indicatorCode");

CREATE INDEX "NationalEmissionReading_year_idx"
    ON "NationalEmissionReading"("year");
