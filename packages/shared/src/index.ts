// ─── Roles ────────────────────────────────────────────────────────────────────

/**
 * All user roles in Nature Grid, from least to most privileged.
 * Matches the Prisma `UserRole` enum exactly — these values are what
 * `request.user.role` actually contains at runtime, so casing must match.
 * `guest` isn't a real Prisma value (unauthenticated requests have no role
 * at all) — it exists here only for documentation/permission-matrix purposes
 * and should never be passed to `@Roles(...)`.
 */
export type UserRole =
  | 'guest'              // unauthenticated public visitor (not a real DB value)
  | 'CITIZEN'
  | 'RESEARCHER'
  | 'ORGANIZATION_ADMIN'
  | 'GOVERNMENT'
  | 'MODERATOR'
  | 'ADMIN';

// ─── Alert / Event Enums ──────────────────────────────────────────────────────
// All enums below match their Prisma counterparts exactly (packages/database/prisma/schema.prisma).

export type AlertSeverity = 'INFO' | 'WATCH' | 'WARNING' | 'EMERGENCY';

export type AlertStatus = 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

// ─── Report Enums ─────────────────────────────────────────────────────────────

export type ReportStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'RESOLVED';

export type ReportCategory =
  | 'WATER_POLLUTION'
  | 'ILLEGAL_DUMPING'
  | 'DEFORESTATION'
  | 'WILDLIFE_INCIDENT'
  | 'FLOODING'
  | 'AIR_POLLUTION'
  | 'OTHER';

// ─── Dataset / Provider Enums ─────────────────────────────────────────────────

export type DatasetCategory =
  | 'WEATHER'
  | 'AIR_QUALITY'
  | 'WATER'
  | 'BIODIVERSITY'
  | 'REPORTS'
  | 'MONITORING'
  | 'GEOSPATIAL';

/**
 * Access policy ladder — each level is a superset of the one above it.
 * `PUBLIC` → `LOGIN_REQUIRED` → `RESEARCHER` → `APPROVED` → `GOVERNMENT`
 */
export type DatasetAccessPolicy =
  | 'PUBLIC'           // any visitor can download
  | 'LOGIN_REQUIRED'   // any authenticated user
  | 'RESEARCHER'       // researcher role or above
  | 'APPROVED'         // explicit per-dataset approval required
  | 'GOVERNMENT';      // government or admin only

export type ProviderType =
  | 'GOVERNMENT_AGENCY'
  | 'RESEARCH_INSTITUTION'
  | 'NGO'
  | 'INTERNATIONAL_ORG'
  | 'CITIZEN_SCIENCE'
  | 'SATELLITE'
  | 'IOT_SENSOR';

// ─── Observation Enums ────────────────────────────────────────────────────────
// No Prisma model exists yet (Observations module is a stub) — uppercased now
// to follow the same convention as every other enum, avoiding this same bug
// when that module ships.

export type ObservationTrustLevel =
  | 'RESEARCH_GRADE'  // validated by researcher
  | 'COMMUNITY'       // community-submitted, not yet validated
  | 'UNVERIFIED'      // newly submitted
  | 'FLAGGED';        // needs review

export type ObservationCategory =
  | 'BIODIVERSITY'
  | 'WATER_QUALITY'
  | 'AIR_QUALITY'
  | 'LAND_USE'
  | 'RESTORATION';

// ─── Ingestion Enum ───────────────────────────────────────────────────────────

export type IngestionStatus =
  | 'QUEUED'
  | 'RUNNING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED';

// ─── Restoration / Projects ───────────────────────────────────────────────────
// No Prisma model exists yet (RestorationProject not built) — uppercased for
// the same reason as the Observation enums above.

export type ProjectStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';

// ─── Location Types ───────────────────────────────────────────────────────────

export interface LocationRef {
  id: string;
  name: string;
  country: string;
  division?: string;
  district?: string;
  upazila?: string;
}

export interface DivisionSummary {
  id: string;
  name: string;
  districtCount: number;
}

export interface DistrictSummary {
  id: string;
  name: string;
  divisionId: string;
  division: string;
}

// ─── Platform Metrics ─────────────────────────────────────────────────────────

export interface PlatformMetrics {
  totalReports: number;
  verifiedReports: number;
  activeAlerts: number;
  datasets: number;
  contributors: number;
  districtsMonitored: number;
}

// ─── Dataset DTO ──────────────────────────────────────────────────────────────

export interface DatasetSummary {
  id: string;
  name: string;
  category: DatasetCategory;
  source: string;
  accessPolicy: DatasetAccessPolicy;
  recordCount?: number;
  lastUpdated?: string;
  description?: string;
}

// ─── Report DTOs ──────────────────────────────────────────────────────────────

export interface CitizenReport {
  id: string;
  title: string;
  category: ReportCategory;
  status: ReportStatus;
  location?: LocationRef;
  createdAt: string;
  summary?: string;
}

// ─── Alert DTO ────────────────────────────────────────────────────────────────

export interface EnvironmentalAlert {
  id: string;
  title: string;
  status: AlertStatus;
  severity: AlertSeverity;
  location?: LocationRef;
  issuedAt: string;
  expiresAt?: string;
  instructions?: string;
}

// ─── Observation DTO ──────────────────────────────────────────────────────────

export interface ObservationSummary {
  id: string;
  category: ObservationCategory;
  trustLevel: ObservationTrustLevel;
  location?: LocationRef;
  observedAt: string;
  species?: string;
}

// ─── Provider DTO ─────────────────────────────────────────────────────────────

export interface ProviderSummary {
  id: string;
  name: string;
  type: ProviderType;
  country: string;
  isActive: boolean;
}

// ─── Restoration / Community DTOs ─────────────────────────────────────────────

export interface RestorationProjectSummary {
  id: string;
  title: string;
  status: ProjectStatus;
  location?: LocationRef;
  participantCount: number;
  startDate: string;
}

export interface CommunityActivityItem {
  id: string;
  type: 'campaign' | 'education' | 'observation' | 'report';
  title: string;
  authorName: string;
  authorInitials: string;
  publishedAt: string;
}
