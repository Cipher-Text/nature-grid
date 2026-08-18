import AppSidebar from '../../components/app-sidebar';
import { apiGet } from '../../lib/api';
import { getCurrentUser } from '../../lib/current-user';
import { submitObservationAction } from '../../lib/observation-actions';
import { routes, type Observation, type PaginatedEnvelope } from '@nature-grid/contracts';
import { titleCase, relativeTime } from '../../lib/format';
import Link from 'next/link';

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

interface DistrictOption {
  id: string;
  name: string;
}

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

  const districts = user
    ? await apiGet<DistrictOption[]>(routes.locations.districts)
    : [];

  return (
    <div className="app-shell">
      <AppSidebar active="observations" />
      <main className="main">
        <div className="panel-header">
          <div>
            <h1>Observations</h1>
            <p>Environmental observations from citizens and researchers.</p>
          </div>
          {!user && (
            <Link className="button ghost" href="/login">
              Sign in to submit
            </Link>
          )}
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
            <div className="table-row" role="row" key={o.id}>
              <span>{titleCase(o.category)}</span>
              <span>{o.district?.name ?? '—'}</span>
              <span className={`tag ${TRUST_VARIANT[o.trustLevel] ?? 'muted'}`}>
                {titleCase(o.trustLevel)}
              </span>
              <span>{relativeTime(o.observedAt)}</span>
            </div>
          ))}
          {observationsRes.data.length === 0 && (
            <div className="empty-state">No observations match this category yet.</div>
          )}
        </div>

        <article className="panel" style={{ marginTop: '20px' }}>
          <div className="panel-header">
            <div>
              <h2>Submit an observation</h2>
              <p>
                {user
                  ? 'Submitted observations start as "Unverified" until a researcher or admin reviews them.'
                  : 'Citizen and researcher submissions — sign in to contribute.'}
              </p>
            </div>
          </div>

          {searchParams.submitted && (
            <p className="form-success">
              Observation submitted — it&apos;s recorded as Unverified until a
              researcher or admin promotes its trust level.
            </p>
          )}
          {searchParams.error && <p className="form-error">{searchParams.error}</p>}

          {user ? (
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
                <select id="districtId" name="districtId" className="select-field">
                  <option value="">Not specified</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
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
          ) : (
            <Link className="button" href="/login">
              Sign in to submit
            </Link>
          )}
        </article>
      </main>
    </div>
  );
}
