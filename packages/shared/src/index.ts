export type UserRole =
  | 'citizen'
  | 'researcher'
  | 'organization_admin'
  | 'government'
  | 'admin';

export type ReportStatus =
  | 'submitted'
  | 'under_review'
  | 'verified'
  | 'rejected'
  | 'resolved';

export type AlertStatus = 'draft' | 'active' | 'expired' | 'cancelled';

export type IngestionStatus =
  | 'queued'
  | 'running'
  | 'succeeded'
  | 'failed'
  | 'cancelled';

export interface LocationRef {
  id: string;
  name: string;
  country: string;
  division?: string;
  district?: string;
}

export interface DatasetSummary {
  id: string;
  name: string;
  category: 'weather' | 'air_quality' | 'water' | 'biodiversity' | 'reports';
  source: string;
}

export interface CitizenReport {
  id: string;
  title: string;
  status: ReportStatus;
  location?: LocationRef;
  createdAt: string;
}

export interface EnvironmentalAlert {
  id: string;
  title: string;
  status: AlertStatus;
  severity: 'info' | 'watch' | 'warning' | 'emergency';
  location?: LocationRef;
}
