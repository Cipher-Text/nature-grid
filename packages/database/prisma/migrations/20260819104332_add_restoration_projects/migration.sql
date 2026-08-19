-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED', 'PAUSED');

-- CreateEnum
CREATE TYPE "RestorationCategory" AS ENUM ('TREE_PLANTING', 'WETLAND_RESTORATION', 'RIVERBANK_PROTECTION', 'MANGROVE', 'WASTE_MANAGEMENT', 'OTHER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditAction" ADD VALUE 'RESTORATION_PROJECT_CREATE';
ALTER TYPE "AuditAction" ADD VALUE 'RESTORATION_PROJECT_UPDATE';
ALTER TYPE "AuditAction" ADD VALUE 'RESTORATION_PROJECT_JOIN';

-- CreateTable
CREATE TABLE "RestorationProject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "RestorationCategory" NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNED',
    "organizationId" TEXT,
    "districtId" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "impactSummary" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestorationProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestorationParticipant" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestorationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RestorationProject_category_idx" ON "RestorationProject"("category");

-- CreateIndex
CREATE INDEX "RestorationProject_status_idx" ON "RestorationProject"("status");

-- CreateIndex
CREATE INDEX "RestorationProject_districtId_idx" ON "RestorationProject"("districtId");

-- CreateIndex
CREATE UNIQUE INDEX "RestorationParticipant_projectId_userId_key" ON "RestorationParticipant"("projectId", "userId");

-- AddForeignKey
ALTER TABLE "RestorationProject" ADD CONSTRAINT "RestorationProject_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestorationProject" ADD CONSTRAINT "RestorationProject_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestorationProject" ADD CONSTRAINT "RestorationProject_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestorationParticipant" ADD CONSTRAINT "RestorationParticipant_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "RestorationProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestorationParticipant" ADD CONSTRAINT "RestorationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
