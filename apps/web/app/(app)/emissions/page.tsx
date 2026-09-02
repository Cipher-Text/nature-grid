import Link from 'next/link';
import { apiGet } from '../../../lib/api';
import {
  routes,
  type PollutionSource,
  type PaginatedEnvelope,
  type PollutionSourceType,
  type DistrictSummary,
} from '@nature-grid/contracts';
import { titleCase } from '../../../lib/format';

const SOURCE_TYPES: PollutionSourceType[] = [
  'FACTORY',
  'POWER_PLANT',
  'VEHICLE_FLEET',
  'AGRICULTURE',
  'CONSTRUCTION',
  'WASTE_FACILITY',
  'OTHER',
];

const TYPE_TAG: Record<string, string> = {
  FACTORY: 'danger',
  POWER_PLANT: 'warning',
  VEHICLE_FLEET: 'warning',
  AGRICULTURE: 'info',
  CONSTRUCTION: 'muted',
  WASTE_FACILITY: 'danger',
  OTHER: 'muted',
};

export default async function EmissionsPage({
  searchParams,
}: {
  searchParams: { type?: string; districtId?: string; page?: string };
}) {
  const type = searchParams.type as PollutionSourceType | undefined;
  const districtId = searchParams.districtId;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;

  const params = new URLSearchParams({ pageSize: '30', page: String(page) });
  if (type) params.set('type', type);
  if (districtId) params.set('districtId', districtId);

  const [res, districts] = await Promise.all([
    apiGet<PaginatedEnvelope<PollutionSource>>(`${routes.emissions.sources}?${params.toString()}`, 300),
    apiGet<DistrictSummary[]>(routes.locations.districts, 3600),
  ]);

  function filterHref(overrides: { type?: string; districtId?: string }) {
    const next = new URLSearchParams();
    const t = overrides.type ?? type ?? '';
    const d = overrides.districtId ?? districtId ?? '';
    if (t) next.set('type', t);
    if (d) next.set('districtId', d);
    const query = next.toString();
    return `/emissions${query ? `?${query}` : ''}`;
  }

  function pageHref(nextPage: number) {
    const href = filterHref({});
    return `${href}${href.includes('?') ? '&' : '?'}page=${nextPage}`;
  }

  return (
    <>
      <div className="panel-header">
        <div>
          <h1>Emissions</h1>
          <p>Registered industrial and agricultural pollution sources across Bangladesh.</p>
        </div>
      </div>

      <form className="toolbar" method="get" aria-label="Emission source filters">
        <label htmlFor="type">Type</label>
        <select id="type" name="type" className="select-field" defaultValue={type ?? ''}>
          <option value="">All types</option>
          {SOURCE_TYPES.map((t) => (
            <option key={t} value={t}>{titleCase(t)}</option>
          ))}
        </select>
        <label htmlFor="districtId">District</label>
        <select id="districtId" name="districtId" className="select-field" defaultValue={districtId ?? ''}>
          <option value="">All districts</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <button type="submit" className="button">Apply</button>
        {(type || districtId) && (
          <Link className="button ghost" href={filterHref({ type: '', districtId: '' })}>Reset</Link>
        )}
      </form>

      <div className="table" role="table" aria-label="Pollution sources">
        <div className="table-row table-head" role="row">
          <span>Source</span>
          <span>Type</span>
          <span>District</span>
          <span>Status</span>
        </div>
        {res.data.map((s) => (
          <Link
            className="table-row table-row-link"
            role="row"
            key={s.id}
            href={`/emissions/${s.id}`}
          >
            <div>
              <strong>{s.name}</strong>
              {s.description && (
                <span className="muted" style={{ fontSize: '0.82rem', display: 'block' }}>
                  {s.description.length > 80 ? `${s.description.slice(0, 80)}…` : s.description}
                </span>
              )}
            </div>
            <span className={`tag ${TYPE_TAG[s.type] ?? 'muted'}`}>{titleCase(s.type)}</span>
            <span>{s.district?.name ?? '—'}</span>
            <span className={`tag ${s.isActive ? 'success' : 'muted'}`}>
              {s.isActive ? 'Active' : 'Inactive'}
            </span>
          </Link>
        ))}
        {res.data.length === 0 && (
          <div className="empty-state">No pollution sources found for this filter.</div>
        )}
      </div>

      {(() => {
        const totalPages = Math.ceil(res.total / res.pageSize);
        return totalPages > 1 ? (
          <div className="toolbar" style={{ justifyContent: 'center', marginTop: '1rem' }}>
            {page > 1 && (
              <Link className="chip" href={pageHref(page - 1)}>← Previous</Link>
            )}
            <span className="chip active" aria-current="page">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link className="chip" href={pageHref(page + 1)}>Next →</Link>
            )}
          </div>
        ) : null;
      })()}
    </>
  );
}
