/*
  Warnings:

  - You are about to drop the `FloodForecast` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FacilityType" AS ENUM ('GARMENT', 'TANNERY', 'BRICK_FIELD', 'POWER_PLANT', 'SHIPBREAKING', 'TEXTILE', 'CEMENT', 'STEEL', 'CHEMICAL', 'PHARMACEUTICAL', 'FERTILIZER', 'PAPER_MILL', 'FOOD_PROCESSING', 'OIL_REFINERY', 'OTHER');

-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('COMPLIANT', 'NON_COMPLIANT', 'UNDER_REVIEW', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('PRIVATE', 'STATE_OWNED', 'JOINT_VENTURE', 'MULTINATIONAL', 'CONGLOMERATE', 'CLUSTER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditAction" ADD VALUE 'FACILITY_CREATE';
ALTER TYPE "AuditAction" ADD VALUE 'FACILITY_UPDATE';
ALTER TYPE "AuditAction" ADD VALUE 'FACILITY_DELETE';
ALTER TYPE "AuditAction" ADD VALUE 'COMPANY_CREATE';
ALTER TYPE "AuditAction" ADD VALUE 'COMPANY_UPDATE';

-- DropForeignKey
ALTER TABLE "AlertSubscription" DROP CONSTRAINT "AlertSubscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "DatasetAccessRequest" DROP CONSTRAINT "DatasetAccessRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "FloodForecast" DROP CONSTRAINT "FloodForecast_districtId_fkey";

-- DropForeignKey
ALTER TABLE "NotificationDelivery" DROP CONSTRAINT "NotificationDelivery_userId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReportComment" DROP CONSTRAINT "ReportComment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ReportComment" DROP CONSTRAINT "ReportComment_reportId_fkey";

-- DropForeignKey
ALTER TABLE "ReportMedia" DROP CONSTRAINT "ReportMedia_reportId_fkey";

-- DropForeignKey
ALTER TABLE "ReportMedia" DROP CONSTRAINT "ReportMedia_uploadedById_fkey";

-- DropForeignKey
ALTER TABLE "ReportStatusEvent" DROP CONSTRAINT "ReportStatusEvent_reportId_fkey";

-- DropForeignKey
ALTER TABLE "RestorationParticipant" DROP CONSTRAINT "RestorationParticipant_projectId_fkey";

-- DropForeignKey
ALTER TABLE "RestorationParticipant" DROP CONSTRAINT "RestorationParticipant_userId_fkey";

-- DropForeignKey
ALTER TABLE "RestorationProject" DROP CONSTRAINT "RestorationProject_createdById_fkey";

-- DropIndex
DROP INDEX "CitizenReport_geom_idx";

-- DropIndex
DROP INDEX "District_geom_idx";

-- DropIndex
DROP INDEX "Observation_geom_idx";

-- AlterTable
ALTER TABLE "CitizenReport" ADD COLUMN "facilityId" TEXT;

-- AlterTable
ALTER TABLE "Union" ADD COLUMN     "isCoastal" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Upazila" ADD COLUMN     "isThana" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "FloodForecast";

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bnName" TEXT,
    "description" TEXT,
    "companyType" "CompanyType" NOT NULL,
    "registrationNumber" TEXT,
    "establishedYear" INTEGER,
    "employeeCount" INTEGER,
    "website" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "headquarterDistrictId" TEXT,
    "parentCompanyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndustrialFacility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bnName" TEXT,
    "description" TEXT,
    "facilityType" "FacilityType" NOT NULL,
    "complianceStatus" "ComplianceStatus" NOT NULL DEFAULT 'UNKNOWN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "companyId" TEXT,
    "establishedYear" INTEGER,
    "productionCapacity" TEXT,
    "landArea" DOUBLE PRECISION,
    "etpInstalled" BOOLEAN NOT NULL DEFAULT false,
    "etpCapacity" DOUBLE PRECISION,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "districtId" TEXT NOT NULL,
    "upazilaId" TEXT,
    "unionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndustrialFacility_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Company_companyType_idx" ON "Company"("companyType");

-- CreateIndex
CREATE INDEX "Company_headquarterDistrictId_idx" ON "Company"("headquarterDistrictId");

-- CreateIndex
CREATE INDEX "Company_parentCompanyId_idx" ON "Company"("parentCompanyId");

-- CreateIndex
CREATE INDEX "IndustrialFacility_facilityType_idx" ON "IndustrialFacility"("facilityType");

-- CreateIndex
CREATE INDEX "IndustrialFacility_complianceStatus_idx" ON "IndustrialFacility"("complianceStatus");

-- CreateIndex
CREATE INDEX "IndustrialFacility_companyId_idx" ON "IndustrialFacility"("companyId");

-- CreateIndex
CREATE INDEX "IndustrialFacility_districtId_idx" ON "IndustrialFacility"("districtId");

-- CreateIndex
CREATE INDEX "IndustrialFacility_upazilaId_idx" ON "IndustrialFacility"("upazilaId");

-- CreateIndex
CREATE INDEX "IndustrialFacility_isActive_idx" ON "IndustrialFacility"("isActive");

-- CreateIndex
CREATE INDEX "CitizenReport_reporterId_idx" ON "CitizenReport"("reporterId");

-- CreateIndex
CREATE INDEX "CitizenReport_facilityId_idx" ON "CitizenReport"("facilityId");

-- CreateIndex
CREATE INDEX "CitizenReport_createdAt_idx" ON "CitizenReport"("createdAt");

-- CreateIndex
CREATE INDEX "Dataset_providerId_idx" ON "Dataset"("providerId");

-- CreateIndex
CREATE INDEX "Observation_upazilaId_idx" ON "Observation"("upazilaId");

-- CreateIndex
CREATE INDEX "Observation_unionId_idx" ON "Observation"("unionId");

-- CreateIndex
CREATE INDEX "RestorationParticipant_userId_idx" ON "RestorationParticipant"("userId");

-- CreateIndex
CREATE INDEX "RestorationProject_upazilaId_idx" ON "RestorationProject"("upazilaId");

-- CreateIndex
CREATE INDEX "RestorationProject_unionId_idx" ON "RestorationProject"("unionId");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatasetAccessRequest" ADD CONSTRAINT "DatasetAccessRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitizenReport" ADD CONSTRAINT "CitizenReport_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "IndustrialFacility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportStatusEvent" ADD CONSTRAINT "ReportStatusEvent_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "CitizenReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportComment" ADD CONSTRAINT "ReportComment_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "CitizenReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportComment" ADD CONSTRAINT "ReportComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportMedia" ADD CONSTRAINT "ReportMedia_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "CitizenReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportMedia" ADD CONSTRAINT "ReportMedia_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestorationProject" ADD CONSTRAINT "RestorationProject_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestorationParticipant" ADD CONSTRAINT "RestorationParticipant_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "RestorationProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestorationParticipant" ADD CONSTRAINT "RestorationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_headquarterDistrictId_fkey" FOREIGN KEY ("headquarterDistrictId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_parentCompanyId_fkey" FOREIGN KEY ("parentCompanyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndustrialFacility" ADD CONSTRAINT "IndustrialFacility_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndustrialFacility" ADD CONSTRAINT "IndustrialFacility_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndustrialFacility" ADD CONSTRAINT "IndustrialFacility_upazilaId_fkey" FOREIGN KEY ("upazilaId") REFERENCES "Upazila"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndustrialFacility" ADD CONSTRAINT "IndustrialFacility_unionId_fkey" FOREIGN KEY ("unionId") REFERENCES "Union"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertSubscription" ADD CONSTRAINT "AlertSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
