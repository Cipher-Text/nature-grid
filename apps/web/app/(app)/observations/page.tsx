import Link from 'next/link';
import { apiGet } from '../../../lib/api';
import { getCurrentUser } from '../../../lib/current-user';
import { submitObservationAction } from '../../../lib/observation-actions';
import { routes, type Observation, type PaginatedEnvelope } from '@nature-grid/contracts';
import { titleCase, relativeTime } from '../../../lib/format';
import DistrictSelect, { type DistrictWithDivision } from '../../../components/district-select';

const CATEGORIES = [
  'BIODIVERSITY',
  'WATER_QUALITY',
  'AIR_QUALITY',
  'LAND_USE',
  'RESTORATION',
] as const;

const TRUST_VARIANT: Record<string, string> = {
  RESEARCH_GRADE: 'success',
  COMMUNITY: 'info',
  UNVERIFIED: 'muted',
  FLAGGED: 'danger',
};

type DistrictOption = DistrictWithDivision;

export default async function ObservationsPage({
  searchParams,
}: {
  searchParams: { category?: string; submitted?: string; error?: string };
}) {
  const category = searchParams.category;
  const observationsPath = category
    ? `${routes.observations.list}?category=${category}`
    : routes.observations.list;

  const [observationsRes, user] = await Promise.all([
    apiGet<PaginatedEnvelope<Observation>>(observationsPath),
    getCurrentUser(),
  ]);

  const districts = await apiGet<DistrictOption[]>(routes.locations.districts);

  return (
    <>
      <div className="panel-header">
        <div>
          <h1>Observations</h1>
          <p>Environmental observations from citizens and researchers.</p>
        </div>
      </div>

      <div className="toolbar" aria-label="Category filter">
        <Link className={`chip${!category ? ' active' : ''}`} href="/observations">
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            className={`chip${category === c ? ' active' : ''}`}
            href={`/observations?category=${c}`}
          >
            {titleCase(c)}
          </Link>
        ))}
      </div>

      <div className="table" role="table" aria-label="Observations">
        <div className="table-row table-head" role="row">
          <span>Observation</span>
          <span>Location</span>
          <span>Trust level</span>
          <span>Observed</span>
        </div>
        {observationsRes.data.map((o) => (
          <Link className="table-row table-row-link" role="row" key={o.id} href={`/observations/${o.id}`}>
            <span>{titleCase(o.category)}</span>
            <span>{o.district?.name ?? '—'}</span>
            <span className={`tag ${TRUST_VARIANT[o.trustLevel] ?? 'muted'}`}>
              {titleCase(o.trustLevel)}
            </span>
            <span>{relativeTime(o.observedAt)}</span>
          </Link>
        ))}
        {observationsRes.data.length === 0 && (
          <div className="empty-state">No observations match this category yet.</div>
        )}
      </div>

      <article className="panel" style={{ marginTop: '20px' }}>
        <div className="panel-header">
          <div>
            <h2>Submit an observation</h2>
            <p>Submitted observations start as &quot;Unverified&quot; until a researcher or admin reviews them.</p>
          </div>
        </div>

        {searchParams.submitted && (
          <p className="form-success">
            Observation submitted — it&apos;s recorded as Unverified until a
            researcher or admin promotes its trust level.
          </p>
        )}
        {searchParams.error && <p className="form-error">{searchParams.error}</p>}

        <form action={submitObservationAction} className="auth-form">
          <div className="field">
            <label htmlFor="category">Observation type</label>
            <select id="category" name="category" className="select-field" required>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{titleCase(c)}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="districtId">District (optional)</label>
            <DistrictSelect districts={districts} />
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" required minLength={20} maxLength={2000} rows={4}
              placeholder="Describe what you observed, when, and any evidence (at least 20 characters)" />
          </div>
          <button className="button" type="submit">
            Submit observation
          </button>
        </form>
      </article>
    </>
  );
}
