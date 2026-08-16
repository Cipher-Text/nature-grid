import Link from 'next/link';
import AppSidebar from '../../components/app-sidebar';
import { apiGet } from '../../lib/api';
import { routes, type CitizenReport, type PaginatedEnvelope } from '@nature-grid/contracts';
import { titleCase, relativeTime } from '../../lib/format';

const CATEGORIES = [
  'WATER_POLLUTION',
  'ILLEGAL_DUMPING',
  'DEFORESTATION',
  'WILDLIFE_INCIDENT',
  'FLOODING',
  'AIR_POLLUTION',
  'OTHER',
] as const;

const STATUS_VARIANT: Record<string, string> = {
  VERIFIED: 'success',
  RESOLVED: 'success',
  REJECTED: 'danger',
};

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = searchParams.category;
  const reportsPath = category
    ? `${routes.reports.list}?category=${category}`
    : routes.reports.list;

  const [reportsRes, verifiedRes, resolvedRes] = await Promise.all([
    apiGet<PaginatedEnvelope<CitizenReport>>(reportsPath),
    apiGet<PaginatedEnvelope<CitizenReport>>(`${routes.reports.list}?status=VERIFIED&pageSize=1`),
    apiGet<PaginatedEnvelope<CitizenReport>>(`${routes.reports.list}?status=RESOLVED&pageSize=1`),
  ]);

  return (
    <div className="app-shell">
      <AppSidebar active="reports" />
      <main className="main">
        <div className="panel-header">
          <div>
            <h1>Citizen Reports</h1>
            <p>Only reviewed and accepted records appear here.</p>
          </div>
          <Link className="button ghost" href="/login">
            Sign in to submit
          </Link>
        </div>

        <div className="metric-grid">
          <div className="metric">
            <span>Verified reports</span>
            <strong>{verifiedRes.total}</strong>
          </div>
          <div className="metric">
            <span>Resolved</span>
            <strong>{resolvedRes.total}</strong>
          </div>
        </div>

        <div className="toolbar" aria-label="Category filter">
          <Link className={`chip${!category ? ' active' : ''}`} href="/reports">
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              className={`chip${category === c ? ' active' : ''}`}
              href={`/reports?category=${c}`}
            >
              {titleCase(c)}
            </Link>
          ))}
        </div>

        <div className="table" role="table" aria-label="Citizen reports">
          <div className="table-row table-head" role="row">
            <span>Report</span>
            <span>Location</span>
            <span>Status</span>
            <span>Updated</span>
          </div>
          {reportsRes.data.map((r) => (
            <div className="table-row" role="row" key={r.id}>
              <strong>{r.title}</strong>
              <span>{r.district?.name ?? '—'}</span>
              <span className={`tag ${STATUS_VARIANT[r.status] ?? 'muted'}`}>
                {titleCase(r.status)}
              </span>
              <span>{relativeTime(r.updatedAt)}</span>
            </div>
          ))}
          {reportsRes.data.length === 0 && (
            <div className="empty-state">No reports match this category yet.</div>
          )}
        </div>

        <article className="panel" style={{ marginTop: '20px' }}>
          <div className="panel-header">
            <div>
              <h2>Status flow</h2>
              <p>How a report moves from submission to resolution</p>
            </div>
          </div>
          <ul className="steps">
            <li className="done">Submitted</li>
            <li className="done">Under review</li>
            <li className="active">Verified</li>
            <li>Resolved</li>
          </ul>
          <p className="access-note" style={{ marginTop: '14px' }}>
            Rejected reports remain visible to moderators and admins for audit, but
            don&apos;t appear in this public list.
          </p>
        </article>
      </main>
    </div>
  );
}
