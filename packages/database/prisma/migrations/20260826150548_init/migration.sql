-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CITIZEN', 'RESEARCHER', 'ORGANIZATION_ADMIN', 'GOVERNMENT', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "OrganizationMemberRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "ProfileVisibility" AS ENUM ('PUBLIC', 'MEMBERS_ONLY', 'PRIVATE');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'WATCH', 'WARNING', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('DRAFT', 'ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "ReportCategory" AS ENUM ('WATER_POLLUTION', 'ILLEGAL_DUMPING', 'DEFORESTATION', 'WILDLIFE_INCIDENT', 'FLOODING', 'AIR_POLLUTION', 'OTHER');

-- CreateEnum
CREATE TYPE "DatasetCategory" AS ENUM ('WEATHER', 'AIR_QUALITY', 'WATER', 'BIODIVERSITY', 'REPORTS', 'MONITORING', 'GEOSPATIAL');

-- CreateEnum
CREATE TYPE "DatasetAccessPolicy" AS ENUM ('PUBLIC', 'LOGIN_REQUIRED', 'RESEARCHER', 'APPROVED', 'GOVERNMENT');

-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('GOVERNMENT_AGENCY', 'RESEARCH_INSTITUTION', 'NGO', 'INTERNATIONAL_ORG', 'CITIZEN_SCIENCE', 'SATELLITE', 'IOT_SENSOR');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('GOVERNMENT_AGENCY', 'RESEARCH_INSTITUTION', 'NGO', 'COMMUNITY_GROUP', 'PRIVATE_COMPANY', 'INTERNATIONAL_ORG', 'OTHER');

-- CreateEnum
CREATE TYPE "IngestionStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('USER_REGISTER', 'USER_LOGIN', 'USER_LOGIN_FAILED', 'USER_LOGOUT', 'USER_ROLE_CHANGE', 'USER_DEACTIVATE', 'REPORT_SUBMIT', 'REPORT_STATUS_CHANGE', 'REPORT_COMMENT_ADD', 'REPORT_MEDIA_ADD', 'ALERT_CREATE', 'ALERT_STATUS_CHANGE', 'DATASET_ACCESS', 'DATASET_DOWNLOAD', 'DATASET_UPDATE', 'OBSERVATION_SUBMIT', 'OBSERVATION_TRUST_CHANGE', 'OBSERVATION_UPDATE', 'OBSERVATION_DELETE', 'RESTORATION_PROJECT_CREATE', 'RESTORATION_PROJECT_UPDATE', 'RESTORATION_PROJECT_JOIN', 'DATASET_ACCESS_DECISION');

-- CreateEnum
CREATE TYPE "DatasetAccessRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED', 'PAUSED');

-- CreateEnum
CREATE TYPE "RestorationCategory" AS ENUM ('TREE_PLANTING', 'WETLAND_RESTORATION', 'RIVERBANK_PROTECTION', 'MANGROVE', 'WASTE_MANAGEMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "ObservationCategory" AS ENUM ('BIODIVERSITY', 'WATER_QUALITY', 'AIR_QUALITY', 'LAND_USE', 'RESTORATION');

-- CreateEnum
CREATE TYPE "ObservationTrustLevel" AS ENUM ('RESEARCH_GRADE', 'COMMUNITY', 'UNVERIFIED', 'FLAGGED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CITIZEN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phone" TEXT,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
    "occupation" TEXT,
    "bio" TEXT,
    "expertise" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "researchInterests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "education" TEXT,
    "institution" TEXT,
    "locationDistrict" TEXT,
    "locationCountry" TEXT NOT NULL DEFAULT 'Bangladesh',
    "profileVisibility" "ProfileVisibility" NOT NULL DEFAULT 'PUBLIC',
    "contactVisibility" "ProfileVisibility" NOT NULL DEFAULT 'PRIVATE',
    "linksVisibility" "ProfileVisibility" NOT NULL DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSocialLink" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "deviceId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "OrganizationType" NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Bangladesh',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMembership" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "OrganizationMemberRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ProviderType" NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Bangladesh',
    "organizationId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Division" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bnName" TEXT,
    "slug" TEXT,
    "pcode" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "areaSqKm" DOUBLE PRECISION,
    "url" TEXT,
    "avgTemp30d" DOUBLE PRECISION,
    "minTemp30d" DOUBLE PRECISION,
    "maxTemp30d" DOUBLE PRECISION,
    "avgHumidity30d" DOUBLE PRECISION,
    "totalPrecip30d" DOUBLE PRECISION,
    "avgWindSpeed30d" DOUBLE PRECISION,
    "avgCloudCover30d" DOUBLE PRECISION,
    "avgPm25_30d" DOUBLE PRECISION,
    "avgPm10_30d" DOUBLE PRECISION,
    "avgUvIndex30d" DOUBLE PRECISION,
    "climateUpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Division_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "District" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bnName" TEXT,
    "slug" TEXT,
    "pcode" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "centerLat" DOUBLE PRECISION,
    "centerLng" DOUBLE PRECISION,
    "areaSqKm" DOUBLE PRECISION,
    "url" TEXT,
    "boundary" JSONB,
    "divisionId" TEXT NOT NULL,
    "avgTemp30d" DOUBLE PRECISION,
    "minTemp30d" DOUBLE PRECISION,
    "maxTemp30d" DOUBLE PRECISION,
    "avgHumidity30d" DOUBLE PRECISION,
    "totalPrecip30d" DOUBLE PRECISION,
    "avgWindSpeed30d" DOUBLE PRECISION,
    "avgCloudCover30d" DOUBLE PRECISION,
    "avgPm25_30d" DOUBLE PRECISION,
    "avgPm10_30d" DOUBLE PRECISION,
    "avgUvIndex30d" DOUBLE PRECISION,
    "climateUpdatedAt" TIMESTAMP(3),

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upazila" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bnName" TEXT,
    "slug" TEXT,
    "pcode" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "areaSqKm" DOUBLE PRECISION,
    "url" TEXT,
    "districtId" TEXT NOT NULL,
    "avgTemp30d" DOUBLE PRECISION,
    "minTemp30d" DOUBLE PRECISION,
    "maxTemp30d" DOUBLE PRECISION,
    "avgHumidity30d" DOUBLE PRECISION,
    "totalPrecip30d" DOUBLE PRECISION,
    "avgWindSpeed30d" DOUBLE PRECISION,
    "avgCloudCover30d" DOUBLE PRECISION,
    "avgPm25_30d" DOUBLE PRECISION,
    "avgPm10_30d" DOUBLE PRECISION,
    "avgUvIndex30d" DOUBLE PRECISION,
    "climateUpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Upazila_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Union" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bnName" TEXT,
    "slug" TEXT,
    "pcode" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "url" TEXT,
    "upazilaId" TEXT NOT NULL,
    "avgTemp30d" DOUBLE PRECISION,
    "minTemp30d" DOUBLE PRECISION,
    "maxTemp30d" DOUBLE PRECISION,
    "avgHumidity30d" DOUBLE PRECISION,
    "totalPrecip30d" DOUBLE PRECISION,
    "avgWindSpeed30d" DOUBLE PRECISION,
    "avgCloudCover30d" DOUBLE PRECISION,
    "avgPm25_30d" DOUBLE PRECISION,
    "avgPm10_30d" DOUBLE PRECISION,
    "avgUvIndex30d" DOUBLE PRECISION,
    "climateUpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Union_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnionDailyClimate" (
    "id" TEXT NOT NULL,
    "unionId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "avgTemp" DOUBLE PRECISION,
    "minTemp" DOUBLE PRECISION,
    "maxTemp" DOUBLE PRECISION,
    "avgHumidity" DOUBLE PRECISION,
    "totalPrecip" DOUBLE PRECISION,
    "avgWindSpeed" DOUBLE PRECISION,
    "maxWindSpeed" DOUBLE PRECISION,
    "avgCloudCover" DOUBLE PRECISION,
    "avgPm25" DOUBLE PRECISION,
    "avgPm10" DOUBLE PRECISION,
    "avgUvIndex" DOUBLE PRECISION,
    "avgOzone" DOUBLE PRECISION,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnionDailyClimate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dataset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "DatasetCategory" NOT NULL,
    "accessPolicy" "DatasetAccessPolicy" NOT NULL DEFAULT 'PUBLIC',
    "source" TEXT NOT NULL,
    "providerId" TEXT,
    "description" TEXT,
    "recordCount" INTEGER,
    "lastSyncedAt" TIMESTAMP(3),
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dataset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DatasetAccessRequest" (
    "id" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "DatasetAccessRequestStatus" NOT NULL DEFAULT 'PENDING',
    "decidedById" TEXT,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DatasetAccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CitizenReport" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ReportCategory" NOT NULL DEFAULT 'OTHER',
    "status" "ReportStatus" NOT NULL DEFAULT 'SUBMITTED',
    "summary" TEXT,
    "reporterId" TEXT,
    "districtId" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CitizenReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportStatusEvent" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportStatusEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportComment" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportMedia" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT,
    "fileSize" INTEGER,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportMedia_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Species" (
    "id" TEXT NOT NULL,
    "gbifKey" INTEGER NOT NULL,
    "canonicalName" TEXT NOT NULL,
    "vernacularName" TEXT,
    "kingdom" TEXT,
    "phylum" TEXT,
    "class" TEXT,
    "order" TEXT,
    "family" TEXT,
    "genus" TEXT,
    "iucnStatus" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Occurrence" (
    "id" TEXT NOT NULL,
    "gbifOccurrenceKey" BIGINT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "districtId" TEXT,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "observedAt" TIMESTAMP(3),
    "recordedBy" TEXT,
    "basisOfRecord" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Occurrence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "AlertSeverity" NOT NULL DEFAULT 'INFO',
    "status" "AlertStatus" NOT NULL DEFAULT 'DRAFT',
    "instructions" TEXT,
    "districtId" TEXT,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "districtId" TEXT,
    "channel" "NotificationChannel" NOT NULL DEFAULT 'EMAIL',
    "minSeverity" "AlertSeverity" NOT NULL DEFAULT 'INFO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationDelivery" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "address" TEXT NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngestionJob" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "status" "IngestionStatus" NOT NULL DEFAULT 'QUEUED',
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "errorMsg" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IngestionJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FloodForecast" (
    "id" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "forecastDate" TIMESTAMP(3) NOT NULL,
    "riverDischarge" DOUBLE PRECISION,
    "riverDischargeMean" DOUBLE PRECISION,
    "riverDischargeMedian" DOUBLE PRECISION,
    "riverDischargeMax" DOUBLE PRECISION,
    "riverDischargeMin" DOUBLE PRECISION,
    "riverDischargeP25" DOUBLE PRECISION,
    "riverDischargeP75" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FloodForecast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentWeatherReading" (
    "id" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "readingTime" TIMESTAMP(3) NOT NULL,
    "temperature2m" DOUBLE PRECISION,
    "relativeHumidity2m" INTEGER,
    "apparentTemperature" DOUBLE PRECISION,
    "windSpeed10m" DOUBLE PRECISION,
    "windDirection10m" INTEGER,
    "precipitation" DOUBLE PRECISION,
    "weatherCode" INTEGER,
    "cloudCover" INTEGER,
    "isDay" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CurrentWeatherReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HourlyWeatherForecast" (
    "id" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "forecastTime" TIMESTAMP(3) NOT NULL,
    "temperature2m" DOUBLE PRECISION,
    "relativeHumidity2m" INTEGER,
    "apparentTemperature" DOUBLE PRECISION,
    "precipitationProbability" INTEGER,
    "precipitation" DOUBLE PRECISION,
    "weatherCode" INTEGER,
    "windSpeed10m" DOUBLE PRECISION,
    "windDirection10m" INTEGER,
    "cloudCover" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HourlyWeatherForecast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyWeatherForecast" (
    "id" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "forecastDate" DATE NOT NULL,
    "weatherCode" INTEGER,
    "temperature2mMax" DOUBLE PRECISION,
    "temperature2mMin" DOUBLE PRECISION,
    "apparentTemperatureMax" DOUBLE PRECISION,
    "apparentTemperatureMin" DOUBLE PRECISION,
    "precipitationSum" DOUBLE PRECISION,
    "precipitationProbabilityMax" INTEGER,
    "windSpeed10mMax" DOUBLE PRECISION,
    "uvIndexMax" DOUBLE PRECISION,
    "sunrise" TIMESTAMP(3),
    "sunset" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyWeatherForecast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HourlyAirQuality" (
    "id" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "forecastTime" TIMESTAMP(3) NOT NULL,
    "pm10" DOUBLE PRECISION,
    "pm25" DOUBLE PRECISION,
    "carbonMonoxide" DOUBLE PRECISION,
    "nitrogenDioxide" DOUBLE PRECISION,
    "sulphurDioxide" DOUBLE PRECISION,
    "ozone" DOUBLE PRECISION,
    "uvIndex" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HourlyAirQuality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "userId" TEXT,
    "entityType" TEXT,
    "entityId" TEXT,
    "meta" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "UserSocialLink_userId_idx" ON "UserSocialLink"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSocialLink_userId_platform_key" ON "UserSocialLink"("userId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- CreateIndex
CREATE INDEX "OrganizationMembership_userId_idx" ON "OrganizationMembership"("userId");

-- CreateIndex
CREATE INDEX "OrganizationMembership_organizationId_role_idx" ON "OrganizationMembership"("organizationId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMembership_organizationId_userId_key" ON "OrganizationMembership"("organizationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Division_name_key" ON "Division"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Division_pcode_key" ON "Division"("pcode");

-- CreateIndex
CREATE UNIQUE INDEX "District_pcode_key" ON "District"("pcode");

-- CreateIndex
CREATE INDEX "District_divisionId_idx" ON "District"("divisionId");

-- CreateIndex
CREATE UNIQUE INDEX "District_name_divisionId_key" ON "District"("name", "divisionId");

-- CreateIndex
CREATE UNIQUE INDEX "Upazila_pcode_key" ON "Upazila"("pcode");

-- CreateIndex
CREATE INDEX "Upazila_districtId_idx" ON "Upazila"("districtId");

-- CreateIndex
CREATE UNIQUE INDEX "Upazila_name_districtId_key" ON "Upazila"("name", "districtId");

-- CreateIndex
CREATE UNIQUE INDEX "Union_pcode_key" ON "Union"("pcode");

-- CreateIndex
CREATE INDEX "Union_upazilaId_idx" ON "Union"("upazilaId");

-- CreateIndex
CREATE UNIQUE INDEX "Union_name_upazilaId_key" ON "Union"("name", "upazilaId");

-- CreateIndex
CREATE INDEX "UnionDailyClimate_unionId_idx" ON "UnionDailyClimate"("unionId");

-- CreateIndex
CREATE INDEX "UnionDailyClimate_date_idx" ON "UnionDailyClimate"("date");

-- CreateIndex
CREATE UNIQUE INDEX "UnionDailyClimate_unionId_date_key" ON "UnionDailyClimate"("unionId", "date");

-- CreateIndex
CREATE INDEX "Dataset_category_idx" ON "Dataset"("category");

-- CreateIndex
CREATE INDEX "Dataset_accessPolicy_idx" ON "Dataset"("accessPolicy");

-- CreateIndex
CREATE UNIQUE INDEX "DatasetAccessRequest_datasetId_userId_key" ON "DatasetAccessRequest"("datasetId", "userId");

-- CreateIndex
CREATE INDEX "CitizenReport_status_idx" ON "CitizenReport"("status");

-- CreateIndex
CREATE INDEX "CitizenReport_category_idx" ON "CitizenReport"("category");

-- CreateIndex
CREATE INDEX "CitizenReport_districtId_idx" ON "CitizenReport"("districtId");

-- CreateIndex
CREATE INDEX "ReportStatusEvent_reportId_idx" ON "ReportStatusEvent"("reportId");

-- CreateIndex
CREATE INDEX "ReportComment_reportId_idx" ON "ReportComment"("reportId");

-- CreateIndex
CREATE INDEX "ReportComment_authorId_idx" ON "ReportComment"("authorId");

-- CreateIndex
CREATE INDEX "ReportMedia_reportId_idx" ON "ReportMedia"("reportId");

-- CreateIndex
CREATE INDEX "Observation_category_idx" ON "Observation"("category");

-- CreateIndex
CREATE INDEX "Observation_trustLevel_idx" ON "Observation"("trustLevel");

-- CreateIndex
CREATE INDEX "Observation_districtId_idx" ON "Observation"("districtId");

-- CreateIndex
CREATE INDEX "RestorationProject_category_idx" ON "RestorationProject"("category");

-- CreateIndex
CREATE INDEX "RestorationProject_status_idx" ON "RestorationProject"("status");

-- CreateIndex
CREATE INDEX "RestorationProject_districtId_idx" ON "RestorationProject"("districtId");

-- CreateIndex
CREATE UNIQUE INDEX "RestorationParticipant_projectId_userId_key" ON "RestorationParticipant"("projectId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Species_gbifKey_key" ON "Species"("gbifKey");

-- CreateIndex
CREATE INDEX "Species_canonicalName_idx" ON "Species"("canonicalName");

-- CreateIndex
CREATE UNIQUE INDEX "Occurrence_gbifOccurrenceKey_key" ON "Occurrence"("gbifOccurrenceKey");

-- CreateIndex
CREATE INDEX "Occurrence_speciesId_idx" ON "Occurrence"("speciesId");

-- CreateIndex
CREATE INDEX "Occurrence_districtId_idx" ON "Occurrence"("districtId");

-- CreateIndex
CREATE INDEX "Alert_status_idx" ON "Alert"("status");

-- CreateIndex
CREATE INDEX "Alert_severity_idx" ON "Alert"("severity");

-- CreateIndex
CREATE INDEX "AlertSubscription_userId_idx" ON "AlertSubscription"("userId");

-- CreateIndex
CREATE INDEX "AlertSubscription_districtId_idx" ON "AlertSubscription"("districtId");

-- CreateIndex
CREATE INDEX "NotificationDelivery_alertId_idx" ON "NotificationDelivery"("alertId");

-- CreateIndex
CREATE INDEX "NotificationDelivery_userId_idx" ON "NotificationDelivery"("userId");

-- CreateIndex
CREATE INDEX "NotificationDelivery_status_idx" ON "NotificationDelivery"("status");

-- CreateIndex
CREATE INDEX "IngestionJob_providerId_idx" ON "IngestionJob"("providerId");

-- CreateIndex
CREATE INDEX "IngestionJob_status_idx" ON "IngestionJob"("status");

-- CreateIndex
CREATE INDEX "FloodForecast_districtId_idx" ON "FloodForecast"("districtId");

-- CreateIndex
CREATE INDEX "FloodForecast_forecastDate_idx" ON "FloodForecast"("forecastDate");

-- CreateIndex
CREATE UNIQUE INDEX "FloodForecast_districtId_forecastDate_key" ON "FloodForecast"("districtId", "forecastDate");

-- CreateIndex
CREATE INDEX "CurrentWeatherReading_districtId_idx" ON "CurrentWeatherReading"("districtId");

-- CreateIndex
CREATE UNIQUE INDEX "CurrentWeatherReading_districtId_readingTime_key" ON "CurrentWeatherReading"("districtId", "readingTime");

-- CreateIndex
CREATE INDEX "HourlyWeatherForecast_districtId_idx" ON "HourlyWeatherForecast"("districtId");

-- CreateIndex
CREATE UNIQUE INDEX "HourlyWeatherForecast_districtId_forecastTime_key" ON "HourlyWeatherForecast"("districtId", "forecastTime");

-- CreateIndex
CREATE INDEX "DailyWeatherForecast_districtId_idx" ON "DailyWeatherForecast"("districtId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyWeatherForecast_districtId_forecastDate_key" ON "DailyWeatherForecast"("districtId", "forecastDate");

-- CreateIndex
CREATE INDEX "HourlyAirQuality_districtId_idx" ON "HourlyAirQuality"("districtId");

-- CreateIndex
CREATE UNIQUE INDEX "HourlyAirQuality_districtId_forecastTime_key" ON "HourlyAirQuality"("districtId", "forecastTime");

-- CreateIndex
CREATE INDEX "AuditEvent_userId_idx" ON "AuditEvent"("userId");

-- CreateIndex
CREATE INDEX "AuditEvent_action_idx" ON "AuditEvent"("action");

-- CreateIndex
CREATE INDEX "AuditEvent_entityType_entityId_idx" ON "AuditEvent"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSocialLink" ADD CONSTRAINT "UserSocialLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upazila" ADD CONSTRAINT "Upazila_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Union" ADD CONSTRAINT "Union_upazilaId_fkey" FOREIGN KEY ("upazilaId") REFERENCES "Upazila"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnionDailyClimate" ADD CONSTRAINT "UnionDailyClimate_unionId_fkey" FOREIGN KEY ("unionId") REFERENCES "Union"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dataset" ADD CONSTRAINT "Dataset_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatasetAccessRequest" ADD CONSTRAINT "DatasetAccessRequest_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatasetAccessRequest" ADD CONSTRAINT "DatasetAccessRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatasetAccessRequest" ADD CONSTRAINT "DatasetAccessRequest_decidedById_fkey" FOREIGN KEY ("decidedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitizenReport" ADD CONSTRAINT "CitizenReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitizenReport" ADD CONSTRAINT "CitizenReport_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportStatusEvent" ADD CONSTRAINT "ReportStatusEvent_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "CitizenReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportComment" ADD CONSTRAINT "ReportComment_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "CitizenReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportComment" ADD CONSTRAINT "ReportComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportMedia" ADD CONSTRAINT "ReportMedia_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "CitizenReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportMedia" ADD CONSTRAINT "ReportMedia_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_observerId_fkey" FOREIGN KEY ("observerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "Occurrence" ADD CONSTRAINT "Occurrence_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Occurrence" ADD CONSTRAINT "Occurrence_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertSubscription" ADD CONSTRAINT "AlertSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertSubscription" ADD CONSTRAINT "AlertSubscription_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "AlertSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngestionJob" ADD CONSTRAINT "IngestionJob_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloodForecast" ADD CONSTRAINT "FloodForecast_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentWeatherReading" ADD CONSTRAINT "CurrentWeatherReading_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HourlyWeatherForecast" ADD CONSTRAINT "HourlyWeatherForecast_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyWeatherForecast" ADD CONSTRAINT "DailyWeatherForecast_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HourlyAirQuality" ADD CONSTRAINT "HourlyAirQuality_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
