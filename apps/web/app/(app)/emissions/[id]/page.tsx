import Link from 'next/link';
import { apiGet } from '../../../../lib/api';
import {
  routes,
  type PollutionSource,
  type EmissionEntry,
  type PaginatedEnvelope,
} from '@nature-grid/contracts';
import { titleCase, relativeTime } from '../../../../lib/format';

const SOURCE_TYPE_LABEL: Record<string, string> = {
  FACTORY: 'Factory',
  POWER_PLANT: 'Power Plant',
  VEHICLE_FLEET: 'Vehicle Fleet',
  AGRICULTURE: 'Agriculture',
  CONSTRUCTION: 'Construction',
  WASTE_FACILITY: 'Waste Facility',
  OTHER: 'Other',
};

const UNIT_LABEL: Record<string, string> = {
  TONS_PER_YEAR: 't/yr',
  KG_PER_DAY: 'kg/day',
  GRAMS_PER_HOUR: 'g/h',
  MG_PER_M3: 'mg/m³',
  OTHER: '',
};

async function tryGet<T>(url: string, revalidate = 900): Promise<T | null> {
  try {
    return await apiGet<T>(url, revalidate);
  } catch {
    return null;
  }
}

export default async function EmissionSourcePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: string };
}) {
  const { id } = params;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;

  const [source, entriesRes] = await Promise.all([
    apiGet<PollutionSource>(routes.emissions.source(id), 900),
    tryGet<PaginatedEnvelope<EmissionEntry>>(
      `${routes.emissions.entries(id)}?pageSize=20&page=${page}`,
      300,
    ),
  ]);

  const entries = entriesRes?.data ?? [];

  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ fontSize: '0.82rem', marginBottom: 16 }}>
        <Link href="/emissions" className="muted">Emissions</Link>
        <span className="muted" style={{ margin: '0 6px' }}>›</span>
        <span>{source.name}</span>
      </nav>

      {/* Header */}
      <div className="panel-header">
        <div>
          <p className="eyebrow">
            {SOURCE_TYPE_LABEL[source.type] ?? source.type}
            {source.district && (
              <>
                {' · '}
                <Link href={`/locations/districts/${source.district.id}?tab=emissions`}>
                  {source.district.name}
                </Link>
              </>
            )}
          </p>
          <h1>{source.name}</h1>
          {source.description && <p>{source.description}</p>}
        </div>
        <span className={`tag ${source.isActive ? 'success' : 'muted'}`} style={{ fontSize: '0.9rem' }}>
          {source.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Metadata */}
      <div className="metric-grid">
        <div className="metric">
          <span>Type</span>
          <strong>{SOURCE_TYPE_LABEL[source.type] ?? source.type}</strong>
        </div>
        {source.district && (
          <div className="metric">
            <span>District</span>
            <strong>
              <Link href={`/locations/districts/${source.district.id}`}>{source.district.name}</Link>
            </strong>
          </div>
        )}
        {source.organization && (
          <div className="metric">
            <span>Organization</span>
            <strong>
              <Link href={`/organizations/${source.organization.id}`}>{source.organization.name}</Link>
            </strong>
          </div>
        )}
        <div className="metric">
          <span>Emission entries</span>
          <strong>{source._count.entries}</strong>
          <small>Logged measurements</small>
        </div>
      </div>

      {/* Location */}
      {source.lat != null && source.lng != null && (
        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Location</h2>
              <p>Geographic coordinates of this source</p>
            </div>
          </div>
          <p className="muted" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {source.lat.toFixed(5)}°N, {source.lng.toFixed(5)}°E
          </p>
        </article>
      )}

      {/* Emission entries */}
      <article className="panel">
        <div className="panel-header">
          <div>
            <h2>Emission Log</h2>
            <p>Measurement entries reported for this source</p>
          </div>
        </div>

        {entries.length === 0 ? (
          <p className="muted" style={{ paddingTop: 8 }}>No emission entries recorded for this source yet.</p>
        ) : (
          <div className="table" role="table" aria-label="Emission entries">
            <div className="table-row table-head" role="row">
              <span>Pollutant</span>
              <span>Value</span>
              <span>Period</span>
              <span>Reported</span>
            </div>
            {entries.map((e) => (
              <div className="table-row" role="row" key={e.id}>
                <strong>{e.pollutant}</strong>
                <span>
                  {e.value.toLocaleString()} {UNIT_LABEL[e.unit] ?? e.unit}
                </span>
                <span>
                  {e.periodStart
                    ? new Date(e.periodStart).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : '—'}
                  {e.periodEnd &&
                    ` – ${new Date(e.periodEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                </span>
                <span>
                  {relativeTime(e.createdAt)}
                  {e.reportedBy && (
                    <span className="muted" style={{ display: 'block', fontSize: '0.8rem' }}>
                      by {e.reportedBy.displayName}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}

        {entriesRes && (() => {
          const totalPages = Math.ceil(entriesRes.total / entriesRes.pageSize);
          return totalPages > 1 ? (
            <div className="toolbar" style={{ justifyContent: 'center', marginTop: '1rem' }}>
              {page > 1 && (
                <Link className="chip" href={`/emissions/${id}?page=${page - 1}`}>← Previous</Link>
              )}
              <span className="chip active" aria-current="page">
                {page} / {totalPages}
              </span>
              {page < totalPages && (
                <Link className="chip" href={`/emissions/${id}?page=${page + 1}`}>Next →</Link>
              )}
            </div>
          ) : null;
        })()}
      </article>
    </>
  );
}
