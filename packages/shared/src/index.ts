// ─── Roles ────────────────────────────────────────────────────────────────────

/** All user roles in Nature Grid, from least to most privileged. */
export type UserRole =
  | 'guest'              // unauthenticated public visitor
  | 'citizen'            // individual contributor
  | 'researcher'         // scientific contributor
  | 'organization_admin' // NGO / institution manager
  | 'government'         // public agency user
  | 'moderator'          // content reviewer
  | 'admin';             // platform administrator

// ─── Alert / Event Enums ──────────────────────────────────────────────────────

export type AlertSeverity = 'info' | 'watch' | 'warning' | 'emergency';

export type AlertStatus = 'draft' | 'active' | 'expired' | 'cancelled';

// ─── Report Enums ─────────────────────────────────────────────────────────────

export type ReportStatus =
  | 'submitted'
  | 'under_review'
  | 'verified'
  | 'rejected'
  | 'resolved';

export type ReportCategory =
  | 'water_pollution'
  | 'illegal_dumping'
  | 'deforestation'
  | 'wildlife_incident'
  | 'flooding'
  | 'air_pollution'
  | 'other';

// ─── Dataset / Provider Enums ─────────────────────────────────────────────────

export type DatasetCategory =
  | 'weather'
  | 'air_quality'
  | 'water'
  | 'biodiversity'
  | 'reports'
  | 'monitoring'
  | 'geospatial';

/**
 * Access policy ladder — each level is a superset of the one above it.
 * `public` → `login_required` → `researcher` → `approved` → `government`
 */
export type DatasetAccessPolicy =
  | 'public'           // any visitor can download
  | 'login_required'   // any authenticated user
  | 'researcher'       // researcher role or above
  | 'approved'         // explicit per-dataset approval required
  | 'government';      // government or admin only

export type ProviderType =
  | 'government_agency'
  | 'research_institution'
  | 'ngo'
  | 'international_org'
  | 'citizen_science'
  | 'satellite'
  | 'iot_sensor';

// ─── Observation Enums ────────────────────────────────────────────────────────

export type ObservationTrustLevel =
  | 'research_grade'  // validated by researcher
  | 'community'       // community-submitted, not yet validated
  | 'unverified'      // newly submitted
  | 'flagged';        // needs review

export type ObservationCategory =
  | 'biodiversity'
  | 'water_quality'
  | 'air_quality'
  | 'land_use'
  | 'restoration';

// ─── Ingestion Enum ───────────────────────────────────────────────────────────

export type IngestionStatus =
  | 'queued'
  | 'running'
  | 'succeeded'
  | 'failed'
  | 'cancelled';

// ─── Restoration / Projects ───────────────────────────────────────────────────

export type ProjectStatus = 'planned' | 'active' | 'completed' | 'paused';

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
