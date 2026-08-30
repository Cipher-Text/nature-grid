-- CreateEnum
CREATE TYPE "HydrologicalClass" AS ENUM ('LOTIC', 'LENTIC');

-- CreateEnum
CREATE TYPE "WaterBodyType" AS ENUM ('RIVER', 'WETLAND', 'LAKE');

-- CreateTable
CREATE TABLE "WaterBody" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameBn" TEXT,
    "hydrologicalClass" "HydrologicalClass" NOT NULL,
    "waterBodyType" "WaterBodyType" NOT NULL,
    "waterBodySubtype" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "transboundaryFlag" BOOLEAN NOT NULL DEFAULT false,
    "transboundaryCountries" TEXT,
    CONSTRAINT "WaterBody_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaterBodyUpazila" (
    "waterBodyId" TEXT NOT NULL,
    "upazilaId" TEXT NOT NULL,
    CONSTRAINT "WaterBodyUpazila_pkey" PRIMARY KEY ("waterBodyId", "upazilaId")
);

-- CreateTable
CREATE TABLE "LoticWaterBodyDetails" (
    "waterBodyId" TEXT NOT NULL,
    "lengthKmBd" DOUBLE PRECISION,
    "averageWidthM" TEXT,
    "maxDepthM" DOUBLE PRECISION,
    "meanDischargeM3s" DOUBLE PRECISION,
    "hydrologicalOrigin" TEXT,
    "outfallTo" TEXT,
    "flowRegime" TEXT,
    "divisionsTraversed" TEXT,
    "districtsTraversed" TEXT,
    "bwdbGaugingStations" TEXT,
    "banglapediaMatchName" TEXT,
    "banglapediaLengthKm" DOUBLE PRECISION,
    "banglapediaAreaCoveredOldDistricts" TEXT,
    "banglapediaSource" TEXT,
    CONSTRAINT "LoticWaterBodyDetails_pkey" PRIMARY KEY ("waterBodyId")
);

-- CreateTable
CREATE TABLE "LenticWaterBodyDetails" (
    "waterBodyId" TEXT NOT NULL,
    "areaMonsoonSqKm" DOUBLE PRECISION,
    "areaDrySqKm" DOUBLE PRECISION,
    "waterVolumeEst" TEXT,
    "seasonality" TEXT,
    CONSTRAINT "LenticWaterBodyDetails_pkey" PRIMARY KEY ("waterBodyId")
);

-- CreateTable
CREATE TABLE "WaterLevelStation" (
    "id" TEXT NOT NULL,
    "serial" INTEGER NOT NULL,
    "stationCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "riverName" TEXT NOT NULL,
    "tidalStatus" TEXT,
    "district" TEXT,
    "upazila" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    CONSTRAINT "WaterLevelStation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaterBodyStation" (
    "waterBodyId" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    CONSTRAINT "WaterBodyStation_pkey" PRIMARY KEY ("waterBodyId", "stationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "WaterBody_code_key" ON "WaterBody"("code");
CREATE UNIQUE INDEX "WaterBody_slug_key" ON "WaterBody"("slug");
CREATE INDEX "WaterBody_hydrologicalClass_idx" ON "WaterBody"("hydrologicalClass");
CREATE INDEX "WaterBody_waterBodyType_idx" ON "WaterBody"("waterBodyType");
CREATE UNIQUE INDEX "WaterLevelStation_serial_key" ON "WaterLevelStation"("serial");
CREATE UNIQUE INDEX "WaterLevelStation_stationCode_key" ON "WaterLevelStation"("stationCode");
CREATE INDEX "WaterLevelStation_riverName_idx" ON "WaterLevelStation"("riverName");
CREATE INDEX "WaterBodyUpazila_upazilaId_idx" ON "WaterBodyUpazila"("upazilaId");
CREATE INDEX "WaterBodyStation_stationId_idx" ON "WaterBodyStation"("stationId");

-- AddForeignKey
ALTER TABLE "WaterBodyUpazila" ADD CONSTRAINT "WaterBodyUpazila_waterBodyId_fkey" FOREIGN KEY ("waterBodyId") REFERENCES "WaterBody"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WaterBodyUpazila" ADD CONSTRAINT "WaterBodyUpazila_upazilaId_fkey" FOREIGN KEY ("upazilaId") REFERENCES "Upazila"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LoticWaterBodyDetails" ADD CONSTRAINT "LoticWaterBodyDetails_waterBodyId_fkey" FOREIGN KEY ("waterBodyId") REFERENCES "WaterBody"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LenticWaterBodyDetails" ADD CONSTRAINT "LenticWaterBodyDetails_waterBodyId_fkey" FOREIGN KEY ("waterBodyId") REFERENCES "WaterBody"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WaterBodyStation" ADD CONSTRAINT "WaterBodyStation_waterBodyId_fkey" FOREIGN KEY ("waterBodyId") REFERENCES "WaterBody"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WaterBodyStation" ADD CONSTRAINT "WaterBodyStation_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "WaterLevelStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
