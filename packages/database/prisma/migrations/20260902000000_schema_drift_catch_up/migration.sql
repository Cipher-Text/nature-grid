-- ─── Schema drift catch-up ────────────────────────────────────────────────────
-- Idempotent catch-up for all schema changes that were applied to the DB via
-- `prisma db push` but never recorded in a migration file.
-- All statements are safe to re-run on a DB that already has some or all of
-- these changes.
--
-- Sections:
--   1. New enum types (idempotent via DO blocks)
--   2. Extend AuditAction enum
--   3. New columns on existing tables (ADD COLUMN IF NOT EXISTS)
--   4. New tables (CREATE TABLE IF NOT EXISTS)
--   5. FK constraints and indexes (idempotent)

-- ─── 1. New enum types ────────────────────────────────────────────────────────

DO $$ BEGIN CREATE TYPE "AlertType" AS ENUM (
  'FLOOD', 'FLASH_FLOOD', 'CYCLONE', 'STORM_SURGE', 'HEATWAVE',
  'AIR_QUALITY', 'WATER_POLLUTION', 'LANDSLIDE', 'DROUGHT', 'WILDFIRE', 'OTHER'
); EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE "PollutionSourceType" AS ENUM (
  'FACTORY', 'POWER_PLANT', 'VEHICLE_FLEET', 'AGRICULTURE',
  'CONSTRUCTION', 'WASTE_FACILITY', 'OTHER'
); EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE "PollutantType" AS ENUM (
  'CO2', 'CH4', 'N2O', 'PM25', 'PM10', 'NOX', 'SOX', 'VOC', 'CO', 'OTHER'
); EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE "EmissionUnit" AS ENUM (
  'TONS_PER_YEAR', 'KG_PER_DAY', 'GRAMS_PER_HOUR', 'MG_PER_M3', 'OTHER'
); EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE "RestorationTargetMetric" AS ENUM (
  'TREES_PLANTED', 'AREA_RESTORED_HA', 'SEEDLINGS_SURVIVED',
  'SPECIES_REINTRODUCED', 'WATER_QUALITY_SCORE', 'CARBON_SEQUESTERED_T',
  'VOLUNTEER_HOURS', 'OTHER'
); EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE "WaterLevelTrend" AS ENUM (
  'RISING', 'FALLING', 'STEADY'
); EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE "MeasurementParameter" AS ENUM (
  'PH', 'DISSOLVED_OXYGEN', 'WATER_TEMPERATURE', 'TURBIDITY', 'CONDUCTIVITY',
  'SALINITY', 'NITRATE_N', 'PHOSPHATE_P', 'BOD', 'COD', 'TOTAL_DISSOLVED_SOLIDS',
  'TOTAL_SUSPENDED_SOLIDS', 'ARSENIC', 'FECAL_COLIFORM', 'WATER_DEPTH',
  'FLOW_VELOCITY', 'PM25', 'PM10', 'CO2', 'CO', 'NOX', 'SOX', 'OZONE', 'VOC',
  'AQI', 'AMBIENT_TEMPERATURE', 'RELATIVE_HUMIDITY', 'SPECIES_COUNT',
  'INDIVIDUAL_COUNT', 'CANOPY_COVER', 'VEGETATION_DENSITY', 'SOIL_PH',
  'SOIL_MOISTURE', 'AREA_AFFECTED', 'OTHER'
); EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE "MeasurementUnit" AS ENUM (
  'MG_PER_L', 'UG_PER_L', 'NTU', 'US_PER_CM', 'PPT', 'PH_UNITS', 'CELSIUS',
  'PPM', 'PPB', 'UG_PER_M3', 'PERCENT', 'COUNT', 'METERS', 'METERS_PER_SECOND',
  'CFU_PER_100ML', 'HECTARES', 'INDEX', 'OTHER'
); EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE "QualityFlag" AS ENUM (
  'GOOD', 'SUSPECT', 'BAD', 'ESTIMATED'
); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ─── 2. Extend AuditAction enum ───────────────────────────────────────────────

ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'OBSERVATION_MEASUREMENT_ADD';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'OBSERVATION_MEASUREMENT_DELETE';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'RESTORATION_TARGET_ADD';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'RESTORATION_ACTIVITY_ADD';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'RESTORATION_METRIC_ADD';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'DATASET_VERSION_PUBLISH';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'PERMISSION_GRANT';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'PERMISSION_REVOKE';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'EMISSION_SOURCE_CREATE';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'EMISSION_ENTRY_CREATE';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'PASSWORD_CHANGE';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'PASSWORD_RESET_REQUEST';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'PASSWORD_RESET';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'EMAIL_VERIFICATION_SENT';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'EMAIL_VERIFIED';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'COMMUNITY_POST_CREATE';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'COMMUNITY_POST_DELETE';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'COMMUNITY_COMMENT_ADD';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'COMMUNITY_COMMENT_DELETE';
ALTER TYPE "AuditAction" ADD VALUE IF NOT EXISTS 'COMMUNITY_POLL_VOTE';

-- ─── 3. New columns on existing tables ───────────────────────────────────────

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "District"
  ADD COLUMN IF NOT EXISTS "isCoastal"  BOOLEAN          NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "coastLat"   DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "coastLng"   DOUBLE PRECISION;

ALTER TABLE "Alert"
  ADD COLUMN IF NOT EXISTS "alertType" "AlertType";

CREATE INDEX IF NOT EXISTS "Alert_alertType_idx" ON "Alert"("alertType");

ALTER TABLE "Observation"
  ADD COLUMN IF NOT EXISTS "upazilaId" TEXT,
  ADD COLUMN IF NOT EXISTS "unionId"   TEXT;

CREATE INDEX IF NOT EXISTS "Observation_observerId_idx" ON "Observation"("observerId");

ALTER TABLE "CitizenReport"
  ADD COLUMN IF NOT EXISTS "upazilaId" TEXT,
  ADD COLUMN IF NOT EXISTS "unionId"   TEXT;

ALTER TABLE "RestorationProject"
  ADD COLUMN IF NOT EXISTS "upazilaId" TEXT,
  ADD COLUMN IF NOT EXISTS "unionId"   TEXT;

ALTER TABLE "Dataset"
  ADD COLUMN IF NOT EXISTS "license"       TEXT,
  ADD COLUMN IF NOT EXISTS "refreshCron"   TEXT,
  ADD COLUMN IF NOT EXISTS "version"       TEXT,
  ADD COLUMN IF NOT EXISTS "spatialExtent" TEXT;

ALTER TABLE "WaterLevelStation"
  ADD COLUMN IF NOT EXISTS "dangerLevel"  DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "warningLevel" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "normalLevel"  DOUBLE PRECISION;

ALTER TABLE "CurrentWeatherReading"
  ADD COLUMN IF NOT EXISTS "windGusts10m"    DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "surfacePressure" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "ingestionJobId"  TEXT;

CREATE INDEX IF NOT EXISTS "CurrentWeatherReading_ingestionJobId_idx"
  ON "CurrentWeatherReading"("ingestionJobId");

ALTER TABLE "HourlyWeatherForecast"
  ADD COLUMN IF NOT EXISTS "windGusts10m"   DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "ingestionJobId" TEXT;

CREATE INDEX IF NOT EXISTS "HourlyWeatherForecast_ingestionJobId_idx"
  ON "HourlyWeatherForecast"("ingestionJobId");

ALTER TABLE "DailyWeatherForecast"
  ADD COLUMN IF NOT EXISTS "ingestionJobId" TEXT;

CREATE INDEX IF NOT EXISTS "DailyWeatherForecast_ingestionJobId_idx"
  ON "DailyWeatherForecast"("ingestionJobId");

ALTER TABLE "HourlyAirQuality"
  ADD COLUMN IF NOT EXISTS "ingestionJobId" TEXT;

CREATE INDEX IF NOT EXISTS "HourlyAirQuality_ingestionJobId_idx"
  ON "HourlyAirQuality"("ingestionJobId");

-- ─── 4. New tables ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "StationFloodForecast" (
  "id"                   TEXT             NOT NULL,
  "stationId"            TEXT             NOT NULL,
  "lat"                  DOUBLE PRECISION NOT NULL,
  "lng"                  DOUBLE PRECISION NOT NULL,
  "forecastDate"         DATE             NOT NULL,
  "riverDischarge"       DOUBLE PRECISION,
  "riverDischargeMean"   DOUBLE PRECISION,
  "riverDischargeMedian" DOUBLE PRECISION,
  "riverDischargeMax"    DOUBLE PRECISION,
  "riverDischargeMin"    DOUBLE PRECISION,
  "riverDischargeP25"    DOUBLE PRECISION,
  "riverDischargeP75"    DOUBLE PRECISION,
  "riverDischargeP10"    DOUBLE PRECISION,
  "riverDischargeP90"    DOUBLE PRECISION,
  "ingestionJobId"       TEXT,
  "createdAt"            TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StationFloodForecast_pkey" PRIMARY KEY ("id")
);
-- Table may have been created by db push before ingestionJobId was added
ALTER TABLE "StationFloodForecast" ADD COLUMN IF NOT EXISTS "ingestionJobId" TEXT;

CREATE TABLE IF NOT EXISTS "WaterLevelReading" (
  "id"             TEXT              NOT NULL,
  "stationId"      TEXT              NOT NULL,
  "readingAt"      TIMESTAMP(3)      NOT NULL,
  "waterLevel"     DOUBLE PRECISION  NOT NULL,
  "discharge"      DOUBLE PRECISION,
  "trend"          "WaterLevelTrend" NOT NULL DEFAULT 'STEADY',
  "ingestionJobId" TEXT,
  "createdAt"      TIMESTAMP(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WaterLevelReading_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "MarineForecast" (
  "id"                         TEXT             NOT NULL,
  "districtId"                 TEXT             NOT NULL,
  "lat"                        DOUBLE PRECISION NOT NULL,
  "lng"                        DOUBLE PRECISION NOT NULL,
  "forecastDate"               DATE             NOT NULL,
  "waveHeightMax"              DOUBLE PRECISION,
  "waveDirectionDominant"      DOUBLE PRECISION,
  "wavePeriodMax"              DOUBLE PRECISION,
  "windWaveHeightMax"          DOUBLE PRECISION,
  "windWaveDirectionDominant"  DOUBLE PRECISION,
  "windWavePeriodMax"          DOUBLE PRECISION,
  "windWavePeakPeriodMax"      DOUBLE PRECISION,
  "swellWaveHeightMax"         DOUBLE PRECISION,
  "swellWaveDirectionDominant" DOUBLE PRECISION,
  "swellWavePeriodMax"         DOUBLE PRECISION,
  "swellWavePeakPeriodMax"     DOUBLE PRECISION,
  "seaSurfaceTemp"             DOUBLE PRECISION,
  "ingestionJobId"             TEXT,
  "createdAt"                  TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MarineForecast_pkey" PRIMARY KEY ("id")
);
-- Table may have been created by db push before ingestionJobId was added
ALTER TABLE "MarineForecast" ADD COLUMN IF NOT EXISTS "ingestionJobId" TEXT;

CREATE TABLE IF NOT EXISTS "SatelliteRadiationReading" (
  "id"                    TEXT             NOT NULL,
  "districtId"            TEXT             NOT NULL,
  "lat"                   DOUBLE PRECISION NOT NULL,
  "lng"                   DOUBLE PRECISION NOT NULL,
  "readingDate"           DATE             NOT NULL,
  "shortwaveRadiationSum" DOUBLE PRECISION,
  "ingestionJobId"        TEXT,
  "createdAt"             TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SatelliteRadiationReading_pkey" PRIMARY KEY ("id")
);
-- Table may have been created by db push before ingestionJobId was added
ALTER TABLE "SatelliteRadiationReading" ADD COLUMN IF NOT EXISTS "ingestionJobId" TEXT;

CREATE TABLE IF NOT EXISTS "DatasetVersion" (
  "id"            TEXT         NOT NULL,
  "datasetId"     TEXT         NOT NULL,
  "version"       TEXT         NOT NULL,
  "notes"         TEXT,
  "publishedById" TEXT,
  "publishedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DatasetVersion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ObservationMeasurement" (
  "id"             TEXT                   NOT NULL,
  "observationId"  TEXT                   NOT NULL,
  "parameter"      "MeasurementParameter" NOT NULL,
  "value"          DOUBLE PRECISION       NOT NULL,
  "unit"           "MeasurementUnit"      NOT NULL,
  "method"         TEXT,
  "detectionLimit" DOUBLE PRECISION,
  "qualityFlag"    "QualityFlag"          NOT NULL DEFAULT 'GOOD',
  "notes"          TEXT,
  "recordedAt"     TIMESTAMP(3)           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ObservationMeasurement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ProjectTarget" (
  "id"          TEXT                      NOT NULL,
  "projectId"   TEXT                      NOT NULL,
  "metric"      "RestorationTargetMetric" NOT NULL,
  "targetValue" DOUBLE PRECISION          NOT NULL,
  "unit"        TEXT,
  "deadline"    TIMESTAMP(3),
  "createdAt"   TIMESTAMP(3)              NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProjectTarget_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ProjectActivity" (
  "id"              TEXT             NOT NULL,
  "projectId"       TEXT             NOT NULL,
  "title"           TEXT             NOT NULL,
  "description"     TEXT             NOT NULL,
  "activityDate"    TIMESTAMP(3)     NOT NULL,
  "volunteersCount" INTEGER,
  "areaAffectedHa"  DOUBLE PRECISION,
  "recordedById"    TEXT,
  "createdAt"       TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProjectActivity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ProjectMetric" (
  "id"           TEXT             NOT NULL,
  "targetId"     TEXT             NOT NULL,
  "measuredAt"   TIMESTAMP(3)     NOT NULL,
  "value"        DOUBLE PRECISION NOT NULL,
  "notes"        TEXT,
  "measuredById" TEXT,
  "createdAt"    TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProjectMetric_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AlertArea" (
  "id"         TEXT NOT NULL,
  "alertId"    TEXT NOT NULL,
  "districtId" TEXT,
  "upazilaId"  TEXT,
  "unionId"    TEXT,
  CONSTRAINT "AlertArea_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PollutionSource" (
  "id"             TEXT                  NOT NULL,
  "name"           TEXT                  NOT NULL,
  "type"           "PollutionSourceType" NOT NULL,
  "description"    TEXT,
  "districtId"     TEXT,
  "lat"            DOUBLE PRECISION,
  "lng"            DOUBLE PRECISION,
  "organizationId" TEXT,
  "isActive"       BOOLEAN               NOT NULL DEFAULT true,
  "createdById"    TEXT                  NOT NULL,
  "createdAt"      TIMESTAMP(3)          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3)          NOT NULL,
  CONSTRAINT "PollutionSource_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "EmissionEntry" (
  "id"                TEXT            NOT NULL,
  "sourceId"          TEXT            NOT NULL,
  "pollutant"         "PollutantType" NOT NULL,
  "value"             DOUBLE PRECISION NOT NULL,
  "unit"              "EmissionUnit"  NOT NULL,
  "measurementMethod" TEXT,
  "periodStart"       TIMESTAMP(3),
  "periodEnd"         TIMESTAMP(3),
  "notes"             TEXT,
  "reportedById"      TEXT,
  "createdAt"         TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"         TIMESTAMP(3)    NOT NULL,
  CONSTRAINT "EmissionEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Permission" (
  "id"          TEXT         NOT NULL,
  "key"         TEXT         NOT NULL,
  "description" TEXT         NOT NULL,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "RolePermission" (
  "id"           TEXT       NOT NULL,
  "role"         "UserRole" NOT NULL,
  "permissionId" TEXT       NOT NULL,
  CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "CommunityPost" (
  "id"         TEXT         NOT NULL,
  "title"      TEXT         NOT NULL,
  "body"       TEXT         NOT NULL,
  "authorId"   TEXT         NOT NULL,
  "districtId" TEXT,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"  TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CommunityPost_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PostComment" (
  "id"        TEXT         NOT NULL,
  "body"      TEXT         NOT NULL,
  "authorId"  TEXT         NOT NULL,
  "postId"    TEXT         NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PostComment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Poll" (
  "id"        TEXT         NOT NULL,
  "postId"    TEXT         NOT NULL,
  "question"  TEXT         NOT NULL,
  "endsAt"    TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PollOption" (
  "id"     TEXT    NOT NULL,
  "pollId" TEXT    NOT NULL,
  "text"   TEXT    NOT NULL,
  "order"  INTEGER NOT NULL,
  CONSTRAINT "PollOption_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PollVote" (
  "id"       TEXT NOT NULL,
  "pollId"   TEXT NOT NULL,
  "optionId" TEXT NOT NULL,
  "userId"   TEXT NOT NULL,
  CONSTRAINT "PollVote_pkey" PRIMARY KEY ("id")
);

-- ─── 5. FK constraints and indexes ───────────────────────────────────────────

-- CitizenReport: upazila + union FKs
DO $$ BEGIN
  ALTER TABLE "CitizenReport"
    ADD CONSTRAINT "CitizenReport_upazilaId_fkey"
      FOREIGN KEY ("upazilaId") REFERENCES "Upazila"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "CitizenReport"
    ADD CONSTRAINT "CitizenReport_unionId_fkey"
      FOREIGN KEY ("unionId") REFERENCES "Union"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE INDEX IF NOT EXISTS "CitizenReport_upazilaId_idx" ON "CitizenReport"("upazilaId");
CREATE INDEX IF NOT EXISTS "CitizenReport_unionId_idx"   ON "CitizenReport"("unionId");

-- Observation: upazila + union FKs
DO $$ BEGIN
  ALTER TABLE "Observation"
    ADD CONSTRAINT "Observation_upazilaId_fkey"
      FOREIGN KEY ("upazilaId") REFERENCES "Upazila"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "Observation"
    ADD CONSTRAINT "Observation_unionId_fkey"
      FOREIGN KEY ("unionId") REFERENCES "Union"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- RestorationProject: upazila + union FKs
DO $$ BEGIN
  ALTER TABLE "RestorationProject"
    ADD CONSTRAINT "RestorationProject_upazilaId_fkey"
      FOREIGN KEY ("upazilaId") REFERENCES "Upazila"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "RestorationProject"
    ADD CONSTRAINT "RestorationProject_unionId_fkey"
      FOREIGN KEY ("unionId") REFERENCES "Union"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- StationFloodForecast
CREATE UNIQUE INDEX IF NOT EXISTS "StationFloodForecast_stationId_forecastDate_key"
  ON "StationFloodForecast"("stationId", "forecastDate");
CREATE INDEX IF NOT EXISTS "StationFloodForecast_stationId_idx"
  ON "StationFloodForecast"("stationId");
CREATE INDEX IF NOT EXISTS "StationFloodForecast_forecastDate_idx"
  ON "StationFloodForecast"("forecastDate");
CREATE INDEX IF NOT EXISTS "StationFloodForecast_ingestionJobId_idx"
  ON "StationFloodForecast"("ingestionJobId");

DO $$ BEGIN
  ALTER TABLE "StationFloodForecast"
    ADD CONSTRAINT "StationFloodForecast_stationId_fkey"
      FOREIGN KEY ("stationId") REFERENCES "WaterLevelStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- WaterLevelReading
CREATE UNIQUE INDEX IF NOT EXISTS "WaterLevelReading_stationId_readingAt_key"
  ON "WaterLevelReading"("stationId", "readingAt");
CREATE INDEX IF NOT EXISTS "WaterLevelReading_stationId_idx"
  ON "WaterLevelReading"("stationId");
CREATE INDEX IF NOT EXISTS "WaterLevelReading_readingAt_idx"
  ON "WaterLevelReading"("readingAt");
CREATE INDEX IF NOT EXISTS "WaterLevelReading_ingestionJobId_idx"
  ON "WaterLevelReading"("ingestionJobId");

DO $$ BEGIN
  ALTER TABLE "WaterLevelReading"
    ADD CONSTRAINT "WaterLevelReading_stationId_fkey"
      FOREIGN KEY ("stationId") REFERENCES "WaterLevelStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- MarineForecast
CREATE UNIQUE INDEX IF NOT EXISTS "MarineForecast_districtId_forecastDate_key"
  ON "MarineForecast"("districtId", "forecastDate");
CREATE INDEX IF NOT EXISTS "MarineForecast_districtId_idx"
  ON "MarineForecast"("districtId");
CREATE INDEX IF NOT EXISTS "MarineForecast_forecastDate_idx"
  ON "MarineForecast"("forecastDate");
CREATE INDEX IF NOT EXISTS "MarineForecast_ingestionJobId_idx"
  ON "MarineForecast"("ingestionJobId");

DO $$ BEGIN
  ALTER TABLE "MarineForecast"
    ADD CONSTRAINT "MarineForecast_districtId_fkey"
      FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- SatelliteRadiationReading
CREATE UNIQUE INDEX IF NOT EXISTS "SatelliteRadiationReading_districtId_readingDate_key"
  ON "SatelliteRadiationReading"("districtId", "readingDate");
CREATE INDEX IF NOT EXISTS "SatelliteRadiationReading_districtId_idx"
  ON "SatelliteRadiationReading"("districtId");
CREATE INDEX IF NOT EXISTS "SatelliteRadiationReading_readingDate_idx"
  ON "SatelliteRadiationReading"("readingDate");
CREATE INDEX IF NOT EXISTS "SatelliteRadiationReading_ingestionJobId_idx"
  ON "SatelliteRadiationReading"("ingestionJobId");

DO $$ BEGIN
  ALTER TABLE "SatelliteRadiationReading"
    ADD CONSTRAINT "SatelliteRadiationReading_districtId_fkey"
      FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- DatasetVersion
CREATE INDEX IF NOT EXISTS "DatasetVersion_datasetId_idx"   ON "DatasetVersion"("datasetId");
CREATE INDEX IF NOT EXISTS "DatasetVersion_publishedAt_idx" ON "DatasetVersion"("publishedAt");

DO $$ BEGIN
  ALTER TABLE "DatasetVersion"
    ADD CONSTRAINT "DatasetVersion_datasetId_fkey"
      FOREIGN KEY ("datasetId") REFERENCES "Dataset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "DatasetVersion"
    ADD CONSTRAINT "DatasetVersion_publishedById_fkey"
      FOREIGN KEY ("publishedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ObservationMeasurement
CREATE INDEX IF NOT EXISTS "ObservationMeasurement_observationId_idx"
  ON "ObservationMeasurement"("observationId");
CREATE INDEX IF NOT EXISTS "ObservationMeasurement_parameter_idx"
  ON "ObservationMeasurement"("parameter");

DO $$ BEGIN
  ALTER TABLE "ObservationMeasurement"
    ADD CONSTRAINT "ObservationMeasurement_observationId_fkey"
      FOREIGN KEY ("observationId") REFERENCES "Observation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ProjectTarget
CREATE INDEX IF NOT EXISTS "ProjectTarget_projectId_idx" ON "ProjectTarget"("projectId");

DO $$ BEGIN
  ALTER TABLE "ProjectTarget"
    ADD CONSTRAINT "ProjectTarget_projectId_fkey"
      FOREIGN KEY ("projectId") REFERENCES "RestorationProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ProjectActivity
CREATE INDEX IF NOT EXISTS "ProjectActivity_projectId_idx"    ON "ProjectActivity"("projectId");
CREATE INDEX IF NOT EXISTS "ProjectActivity_activityDate_idx" ON "ProjectActivity"("activityDate");

DO $$ BEGIN
  ALTER TABLE "ProjectActivity"
    ADD CONSTRAINT "ProjectActivity_projectId_fkey"
      FOREIGN KEY ("projectId") REFERENCES "RestorationProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "ProjectActivity"
    ADD CONSTRAINT "ProjectActivity_recordedById_fkey"
      FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ProjectMetric
CREATE INDEX IF NOT EXISTS "ProjectMetric_targetId_idx"   ON "ProjectMetric"("targetId");
CREATE INDEX IF NOT EXISTS "ProjectMetric_measuredAt_idx" ON "ProjectMetric"("measuredAt");

DO $$ BEGIN
  ALTER TABLE "ProjectMetric"
    ADD CONSTRAINT "ProjectMetric_targetId_fkey"
      FOREIGN KEY ("targetId") REFERENCES "ProjectTarget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "ProjectMetric"
    ADD CONSTRAINT "ProjectMetric_measuredById_fkey"
      FOREIGN KEY ("measuredById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- AlertArea
CREATE INDEX IF NOT EXISTS "AlertArea_alertId_idx"    ON "AlertArea"("alertId");
CREATE INDEX IF NOT EXISTS "AlertArea_districtId_idx" ON "AlertArea"("districtId");
CREATE INDEX IF NOT EXISTS "AlertArea_upazilaId_idx"  ON "AlertArea"("upazilaId");
CREATE INDEX IF NOT EXISTS "AlertArea_unionId_idx"    ON "AlertArea"("unionId");

DO $$ BEGIN
  ALTER TABLE "AlertArea"
    ADD CONSTRAINT "AlertArea_alertId_fkey"
      FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "AlertArea"
    ADD CONSTRAINT "AlertArea_districtId_fkey"
      FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "AlertArea"
    ADD CONSTRAINT "AlertArea_upazilaId_fkey"
      FOREIGN KEY ("upazilaId") REFERENCES "Upazila"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "AlertArea"
    ADD CONSTRAINT "AlertArea_unionId_fkey"
      FOREIGN KEY ("unionId") REFERENCES "Union"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- PollutionSource
CREATE INDEX IF NOT EXISTS "PollutionSource_districtId_idx" ON "PollutionSource"("districtId");
CREATE INDEX IF NOT EXISTS "PollutionSource_type_idx"       ON "PollutionSource"("type");
CREATE INDEX IF NOT EXISTS "PollutionSource_isActive_idx"   ON "PollutionSource"("isActive");

DO $$ BEGIN
  ALTER TABLE "PollutionSource"
    ADD CONSTRAINT "PollutionSource_districtId_fkey"
      FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "PollutionSource"
    ADD CONSTRAINT "PollutionSource_organizationId_fkey"
      FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "PollutionSource"
    ADD CONSTRAINT "PollutionSource_createdById_fkey"
      FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- EmissionEntry
CREATE INDEX IF NOT EXISTS "EmissionEntry_sourceId_idx"  ON "EmissionEntry"("sourceId");
CREATE INDEX IF NOT EXISTS "EmissionEntry_pollutant_idx" ON "EmissionEntry"("pollutant");

DO $$ BEGIN
  ALTER TABLE "EmissionEntry"
    ADD CONSTRAINT "EmissionEntry_sourceId_fkey"
      FOREIGN KEY ("sourceId") REFERENCES "PollutionSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "EmissionEntry"
    ADD CONSTRAINT "EmissionEntry_reportedById_fkey"
      FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Permission
CREATE UNIQUE INDEX IF NOT EXISTS "Permission_key_key" ON "Permission"("key");

-- RolePermission
CREATE UNIQUE INDEX IF NOT EXISTS "RolePermission_role_permissionId_key"
  ON "RolePermission"("role", "permissionId");
CREATE INDEX IF NOT EXISTS "RolePermission_role_idx" ON "RolePermission"("role");

DO $$ BEGIN
  ALTER TABLE "RolePermission"
    ADD CONSTRAINT "RolePermission_permissionId_fkey"
      FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- CommunityPost
CREATE INDEX IF NOT EXISTS "CommunityPost_authorId_idx"   ON "CommunityPost"("authorId");
CREATE INDEX IF NOT EXISTS "CommunityPost_districtId_idx" ON "CommunityPost"("districtId");
CREATE INDEX IF NOT EXISTS "CommunityPost_createdAt_idx"  ON "CommunityPost"("createdAt");

DO $$ BEGIN
  ALTER TABLE "CommunityPost"
    ADD CONSTRAINT "CommunityPost_authorId_fkey"
      FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "CommunityPost"
    ADD CONSTRAINT "CommunityPost_districtId_fkey"
      FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- PostComment
CREATE INDEX IF NOT EXISTS "PostComment_postId_idx"   ON "PostComment"("postId");
CREATE INDEX IF NOT EXISTS "PostComment_authorId_idx" ON "PostComment"("authorId");

DO $$ BEGIN
  ALTER TABLE "PostComment"
    ADD CONSTRAINT "PostComment_authorId_fkey"
      FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "PostComment"
    ADD CONSTRAINT "PostComment_postId_fkey"
      FOREIGN KEY ("postId") REFERENCES "CommunityPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Poll
CREATE UNIQUE INDEX IF NOT EXISTS "Poll_postId_key" ON "Poll"("postId");

DO $$ BEGIN
  ALTER TABLE "Poll"
    ADD CONSTRAINT "Poll_postId_fkey"
      FOREIGN KEY ("postId") REFERENCES "CommunityPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- PollOption
CREATE INDEX IF NOT EXISTS "PollOption_pollId_idx" ON "PollOption"("pollId");

DO $$ BEGIN
  ALTER TABLE "PollOption"
    ADD CONSTRAINT "PollOption_pollId_fkey"
      FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- PollVote
CREATE UNIQUE INDEX IF NOT EXISTS "PollVote_pollId_userId_key" ON "PollVote"("pollId", "userId");
CREATE INDEX IF NOT EXISTS "PollVote_pollId_idx"   ON "PollVote"("pollId");
CREATE INDEX IF NOT EXISTS "PollVote_optionId_idx" ON "PollVote"("optionId");
CREATE INDEX IF NOT EXISTS "PollVote_userId_idx"   ON "PollVote"("userId");

DO $$ BEGIN
  ALTER TABLE "PollVote"
    ADD CONSTRAINT "PollVote_pollId_fkey"
      FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "PollVote"
    ADD CONSTRAINT "PollVote_optionId_fkey"
      FOREIGN KEY ("optionId") REFERENCES "PollOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "PollVote"
    ADD CONSTRAINT "PollVote_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;
