import Link from 'next/link';
import { apiGet } from '../../../lib/api';
import { getCurrentUser } from '../../../lib/current-user';
import { submitReportAction } from '../../../lib/report-actions';
import { routes, type CitizenReport, type PaginatedEnvelope } from '@nature-grid/contracts';
import { titleCase, relativeTime } from '../../../lib/format';
import DistrictSelect, { type DistrictWithDivision } from '../../../components/district-select';

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

type DistrictOption = DistrictWithDivision;

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { category?: string; submitted?: string; error?: string };
}) {
  const category = searchParams.category;
  const reportsPath = category
    ? `${routes.reports.list}?category=${category}`
    : routes.reports.list;

  const [reportsRes, verifiedRes, resolvedRes, user] = await Promise.all([
    apiGet<PaginatedEnvelope<CitizenReport>>(reportsPath),
    apiGet<PaginatedEnvelope<CitizenReport>>(`${routes.reports.list}?status=VERIFIED&pageSize=1`),
    apiGet<PaginatedEnvelope<CitizenReport>>(`${routes.reports.list}?status=RESOLVED&pageSize=1`),
    getCurrentUser(),
  ]);

  const districts = user
    ? await apiGet<DistrictOption[]>(routes.locations.districts)
    : [];

  return (
    <>
      <div className="panel-header">
        <div>
          <h1>Citizen Reports</h1>
          <p>Only reviewed and accepted records appear here.</p>
        </div>
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
          <Link className="table-row table-row-link" role="row" key={r.id} href={`/reports/${r.id}`}>
            <strong>{r.title}</strong>
            <span>{r.district?.name ?? '—'}</span>
            <span className={`tag ${STATUS_VARIANT[r.status] ?? 'muted'}`}>
              {titleCase(r.status)}
            </span>
            <span>{relativeTime(r.updatedAt)}</span>
          </Link>
        ))}
        {reportsRes.data.length === 0 && (
          <div className="empty-state">No reports match this category yet.</div>
        )}
      </div>

      <article className="panel">
        <div className="panel-header">
          <div>
            <h2>Report an environmental issue</h2>
            <p>Submitted reports start as &quot;Submitted&quot; and go through moderator review before appearing above.</p>
          </div>
        </div>

        {searchParams.submitted && (
          <p className="form-success">
            Report submitted — it&apos;s now pending moderator review. It will appear in
            the list above once verified.
          </p>
        )}
        {searchParams.error && <p className="form-error">{searchParams.error}</p>}

        <form action={submitReportAction} className="submit-form">
          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              minLength={5}
              maxLength={200}
              placeholder="e.g. Industrial discharge near Buriganga bridge"
            />
          </div>
          <div className="field">
            <label htmlFor="category">Issue type</label>
            <select id="category" name="category" className="select-field" required>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {titleCase(c)}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="districtId">District (optional)</label>
            <DistrictSelect districts={districts} />
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              required
              minLength={20}
              maxLength={5000}
              rows={4}
              placeholder="Describe what you observed, when, and any evidence (at least 20 characters)"
            />
          </div>
          <button className="button" type="submit">
            Submit report
          </button>
        </form>
      </article>

      <article className="panel">
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
    </>
  );
}
