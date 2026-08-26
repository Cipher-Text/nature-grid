/**
 * CivicScienceSection — Server Component
 *
 * Aggregates all four civic/science data sources in parallel and passes
 * serialised results to the CivicScienceTabs client component. Keeping the
 * fetch here (rather than inside the client component) preserves the RSC
 * pattern: no data hits the browser bundle.
 */

import {
  routes,
  type CitizenReport,
  type Alert,
  type Species,
  type Occurrence,
  type RestorationProject,
  type PaginatedEnvelope,
} from '@nature-grid/contracts';
import { apiGet } from '../lib/api';
import { titleCase, relativeTime } from '../lib/format';
import {
  REPORTS as FALLBACK_REPORTS,
  ALERTS as FALLBACK_ALERTS,
  RESTORATION_PROJECTS as FALLBACK_PROJECTS,
} from '../lib/static-data';
import CivicScienceTabs, {
  type ReportItem,
  type AlertItem,
  type BiodiversityStats,
  type ProjectItem,
} from './civic-science-tabs';

const SEVERITY_CLASS: Record<string, string> = {
  EMERGENCY: 'danger',
  WARNING:   'warning',
  WATCH:     'warning',
  INFO:      'info',
};

async function loadReports(): Promise<{ items: ReportItem[]; isLive: boolean }> {
  try {
    const res = await apiGet<PaginatedEnvelope<CitizenReport>>(
      `${routes.reports.list}?status=VERIFIED&pageSize=4`,
    );
    return {
      isLive: true,
      items: res.data.map((r) => ({
        id: r.id,
        title: r.title,
        district: r.district?.name ?? 'Nationwide',
        category: titleCase(r.category),
        status: titleCase(r.status),
        updatedAt: relativeTime(r.updatedAt),
      })),
    };
  } catch {
    return {
      isLive: false,
      items: FALLBACK_REPORTS.map((r, i) => ({
        id: String(i),
        title: r.title,
        district: '',
        category: '',
        status: '',
        updatedAt: r.meta,
      })),
    };
  }
}

async function loadAlerts(): Promise<{ items: AlertItem[]; isLive: boolean }> {
  try {
    const res = await apiGet<PaginatedEnvelope<Alert>>(
      `${routes.alerts.list}?status=ACTIVE&pageSize=4`,
    );
    return {
      isLive: true,
      items: res.data.map((a) => ({
        id: a.id,
        title: a.title,
        severity: titleCase(a.severity),
        severityClass: SEVERITY_CLASS[a.severity] ?? '',
        district: a.district?.name ?? 'Nationwide',
        issuedAt: relativeTime(a.issuedAt),
      })),
    };
  } catch {
    return {
      isLive: false,
      items: FALLBACK_ALERTS.map((a, i) => ({
        id: String(i),
        title: a.title,
        severity: titleCase(a.severity),
        severityClass: SEVERITY_CLASS[a.severity] ?? '',
        district: 'Nationwide',
        issuedAt: a.meta,
      })),
    };
  }
}

async function loadBiodiversity(): Promise<BiodiversityStats | null> {
  try {
    const [species, occurrences] = await Promise.all([
      apiGet<PaginatedEnvelope<Species>>(`${routes.biodiversity.species}?pageSize=1`),
      apiGet<PaginatedEnvelope<Occurrence>>(`${routes.biodiversity.occurrences}?pageSize=1`),
    ]);
    return {
      speciesTotal: species.total,
      occurrenceTotal: occurrences.total,
    };
  } catch {
    return null;
  }
}

async function loadRestoration(): Promise<{ items: ProjectItem[]; isLive: boolean }> {
  try {
    const res = await apiGet<PaginatedEnvelope<RestorationProject>>(
      `${routes.restoration.projects}?pageSize=4`,
    );
    return {
      isLive: true,
      items: res.data.map((p) => ({
        id: p.id,
        title: p.title,
        org: p.organization?.name ?? 'Independent',
        district: p.district?.name ?? 'Nationwide',
        summary: p.impactSummary ?? null,
      })),
    };
  } catch {
    return {
      isLive: false,
      items: FALLBACK_PROJECTS.map((p, i) => ({
        id: String(i),
        title: p.title,
        org: '',
        district: '',
        summary: p.meta,
      })),
    };
  }
}

export default async function CivicScienceSection() {
  const [reports, alerts, biodiversity, restoration] = await Promise.all([
    loadReports(),
    loadAlerts(),
    loadBiodiversity(),
    loadRestoration(),
  ]);

  return (
    <CivicScienceTabs
      reports={reports}
      alerts={alerts}
      biodiversity={biodiversity}
      restoration={restoration}
    />
  );
}
