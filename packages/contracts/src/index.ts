import type {
  UserRole,
  AlertSeverity,
  AlertStatus,
  ReportCategory,
  ReportStatus,
  DatasetCategory,
  DatasetAccessPolicy,
  ObservationCategory,
  ObservationTrustLevel,
  ProjectStatus,
} from '@nature-grid/shared';

// Re-export shared types that callers expect to find here
export type {
  UserRole,
  AlertSeverity,
  AlertStatus,
  ReportCategory,
  ReportStatus,
  DatasetCategory,
  DatasetAccessPolicy,
  ObservationCategory,
  ObservationTrustLevel,
  ProjectStatus,
} from '@nature-grid/shared';

// ─── API Prefix ───────────────────────────────────────────────────────────────

export const apiPrefix = '/api/v1';

// ─── Routes ───────────────────────────────────────────────────────────────────
//
// CONTRACT RULE: The frontend must not call any backend route using a raw
// string literal. Import `routes` from this package and reference the
// appropriate key. Every route used by the frontend must be defined here
// before integration begins.
//
// To add a new route:
//   1. Add it in the relevant group below.
//   2. Add request and response types below the routes object.
//   3. Update `apps/web` or other callers to use the new key.

export const routes = {
  health: `${apiPrefix}/health`,

  auth: {
    register: `${apiPrefix}/auth/register`,
    login: `${apiPrefix}/auth/login`,
    refresh: `${apiPrefix}/auth/refresh`,
    logout: `${apiPrefix}/auth/logout`,
    profile: `${apiPrefix}/auth/profile`,
  },

  locations: {
    divisions: `${apiPrefix}/locations/divisions`,
    districts: `${apiPrefix}/locations/districts`,
    district: (id: string) => `${apiPrefix}/locations/districts/${id}`,
    upazilas: `${apiPrefix}/locations/upazilas`,
    upazila: (id: string) => `${apiPrefix}/locations/upazilas/${id}`,
    unions: `${apiPrefix}/locations/unions`,
  },

  datasets: {
    list: `${apiPrefix}/datasets`,
    detail: (id: string) => `${apiPrefix}/datasets/${id}`,
    currentWeather: `${apiPrefix}/datasets/weather/current`,
    currentAirQuality: `${apiPrefix}/datasets/air-quality/current`,
    download: (id: string) => `${apiPrefix}/datasets/${id}/download`,
    accessRequest: (id: string) => `${apiPrefix}/datasets/${id}/access-request`,
  },

  reports: {
    list: `${apiPrefix}/reports`,
    detail: (id: string) => `${apiPrefix}/reports/${id}`,
    create: `${apiPrefix}/reports`,
    updateStatus: (id: string) => `${apiPrefix}/reports/${id}/status`,
  },

  alerts: {
    list: `${apiPrefix}/alerts`,
    detail: (id: string) => `${apiPrefix}/alerts/${id}`,
    create: `${apiPrefix}/alerts`,
    update: (id: string) => `${apiPrefix}/alerts/${id}`,
  },

  observations: {
    list: `${apiPrefix}/observations`,
    detail: (id: string) => `${apiPrefix}/observations/${id}`,
    create: `${apiPrefix}/observations`,
  },

  biodiversity: {
    highlights: `${apiPrefix}/biodiversity/highlights`,
    species: `${apiPrefix}/biodiversity/species`,
    speciesDetail: (id: string) => `${apiPrefix}/biodiversity/species/${id}`,
  },

  restoration: {
    projects: `${apiPrefix}/restoration/projects`,
    project: (id: string) => `${apiPrefix}/restoration/projects/${id}`,
    join: (id: string) => `${apiPrefix}/restoration/projects/${id}/join`,
  },

  community: {
    feed: `${apiPrefix}/community/feed`,
  },

  providers: {
    list: `${apiPrefix}/providers`,
    detail: (id: string) => `${apiPrefix}/providers/${id}`,
  },

  users: {
    list: `${apiPrefix}/users`,
    detail: (id: string) => `${apiPrefix}/users/${id}`,
    updateRole: (id: string) => `${apiPrefix}/users/${id}/role`,
  },

  organizations: {
    list: `${apiPrefix}/organizations`,
    detail: (id: string) => `${apiPrefix}/organizations/${id}`,
  },

  metrics: {
    platform: `${apiPrefix}/metrics/platform`,
  },
} as const;

// ─── Response Envelopes ───────────────────────────────────────────────────────

export interface ApiEnvelope<T> {
  data: T;
  message?: string;
}

export interface PaginatedEnvelope<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

// ─── Common Query Params ──────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface LocationFilterParams {
  divisionId?: string;
  districtId?: string;
  upazilaId?: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    role: UserRole;
  };
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export interface CreateReportRequest {
  title: string;
  category: ReportCategory;
  description: string;
  locationId?: string;
  coordinates?: { lat: number; lng: number };
}

export interface UpdateReportStatusRequest {
  status: ReportStatus;
  note?: string;
}

export interface ReportListParams extends PaginationParams, LocationFilterParams {
  status?: ReportStatus;
  category?: ReportCategory;
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export interface CreateAlertRequest {
  title: string;
  severity: AlertSeverity;
  description: string;
  instructions?: string;
  locationId?: string;
  expiresAt?: string;
}

export interface UpdateAlertRequest {
  status?: AlertStatus;
  instructions?: string;
  expiresAt?: string;
}

export interface AlertListParams extends PaginationParams, LocationFilterParams {
  status?: AlertStatus;
  severity?: AlertSeverity;
}

// ─── Observations ─────────────────────────────────────────────────────────────

export interface CreateObservationRequest {
  category: ObservationCategory;
  description: string;
  locationId?: string;
  coordinates?: { lat: number; lng: number };
  observedAt: string;
  species?: string;
}

export interface ObservationListParams extends PaginationParams, LocationFilterParams {
  category?: ObservationCategory;
  trustLevel?: ObservationTrustLevel;
}

// ─── Datasets ─────────────────────────────────────────────────────────────────

export interface DatasetListParams extends PaginationParams {
  category?: DatasetCategory;
  accessPolicy?: DatasetAccessPolicy;
}

// ─── Restoration ──────────────────────────────────────────────────────────────

export interface RestorationProjectListParams extends PaginationParams, LocationFilterParams {
  status?: ProjectStatus;
}
