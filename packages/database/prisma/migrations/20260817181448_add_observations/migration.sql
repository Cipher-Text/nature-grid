-- CreateEnum
CREATE TYPE "ObservationCategory" AS ENUM ('BIODIVERSITY', 'WATER_QUALITY', 'AIR_QUALITY', 'LAND_USE', 'RESTORATION');

-- CreateEnum
CREATE TYPE "ObservationTrustLevel" AS ENUM ('RESEARCH_GRADE', 'COMMUNITY', 'UNVERIFIED', 'FLAGGED');

-- AlterEnum
ALTER TYPE "AuditAction" ADD VALUE 'OBSERVATION_TRUST_CHANGE';

-- CreateTable
CREATE TABLE "Observation" (
    "id" TEXT NOT NULL,
    "category" "ObservationCategory" NOT NULL,
    "trustLevel" "ObservationTrustLevel" NOT NULL DEFAULT 'UNVERIFIED',
    "description" TEXT NOT NULL,
    "observerId" TEXT,
    "districtId" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "species" TEXT,
    "observedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Observation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Observation_category_idx" ON "Observation"("category");

-- CreateIndex
CREATE INDEX "Observation_trustLevel_idx" ON "Observation"("trustLevel");

-- CreateIndex
CREATE INDEX "Observation_districtId_idx" ON "Observation"("districtId");

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_observerId_fkey" FOREIGN KEY ("observerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;
