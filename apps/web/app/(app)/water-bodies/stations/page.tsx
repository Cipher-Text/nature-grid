import Link from 'next/link';
import { apiGet } from '../../../../lib/api';
import { routes, type WaterLevelStationPagedResponse, type DistrictSummary } from '@nature-grid/contracts';

export default async function WaterLevelStationsPage({
  searchParams,
}: {
  searchParams: { districtId?: string; tidalStatus?: string; page?: string };
}) {
  const { districtId, tidalStatus } = searchParams;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;

  let path = `${routes.waterBodies.stations}?limit=30&page=${page}`;
  if (districtId) path += `&districtId=${districtId}`;
  if (tidalStatus) path += `&tidalStatus=${encodeURIComponent(tidalStatus)}`;

  const [res, districts] = await Promise.all([
    apiGet<WaterLevelStationPagedResponse>(path, 300),
    apiGet<DistrictSummary[]>(routes.locations.districts, 3600),
  ]);

  const TIDAL_OPTIONS = ['Tidal', 'Non-Tidal'];

  function buildHref(overrides: { districtId?: string; tidalStatus?: string; page?: number }) {
    const d = overrides.districtId ?? districtId ?? '';
    const t = overrides.tidalStatus ?? tidalStatus ?? '';
    const p = overrides.page ?? 1;
    const params = new URLSearchParams();
    if (d) params.set('districtId', d);
    if (t) params.set('tidalStatus', t);
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    return `/water-bodies/stations${qs ? `?${qs}` : ''}`;
  }

  return (
    <>
      <div className="panel-header">
        <div>
          <h1>Water Level Stations</h1>
          <p>BWDB monitoring stations across Bangladesh.</p>
        </div>
        <Link href="/water-bodies" className="button ghost">
          ← Water Bodies
        </Link>
      </div>

      {/* Tidal status filter */}
      <div className="toolbar" aria-label="Tidal status filter">
        <Link
          className={`chip${!tidalStatus ? ' active' : ''}`}
          href={buildHref({ tidalStatus: '', page: 1 })}
        >
          All stations
        </Link>
        {TIDAL_OPTIONS.map((t) => (
          <Link
            key={t}
            className={`chip${tidalStatus === t ? ' active' : ''}`}
            href={buildHref({ tidalStatus: t, page: 1 })}
          >
            {t}
          </Link>
        ))}
      </div>

      {/* District quick-filter */}
      <details className="panel" style={{ marginBottom: '1rem' }}>
        <summary style={{ cursor: 'pointer', padding: '0.75rem 1rem', fontWeight: 500 }}>
          Filter by district {districtId ? `(${districts.find((d) => d.id === districtId)?.name ?? districtId})` : ''}
        </summary>
        <div style={{ padding: '0.75rem 1rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          <Link className={`chip${!districtId ? ' active' : ''}`} href={buildHref({ districtId: '', page: 1 })}>
            All districts
          </Link>
          {districts.map((d) => (
            <Link
              key={d.id}
              className={`chip${districtId === d.id ? ' active' : ''}`}
              href={buildHref({ districtId: d.id, page: 1 })}
            >
              {d.name}
            </Link>
          ))}
        </div>
      </details>

      <div className="table" role="table" aria-label="Water level stations">
        <div className="table-row table-head" role="row">
          <span>#</span>
          <span>Station</span>
          <span>Code</span>
          <span>River</span>
          <span>Tidal Status</span>
          <span>Water Bodies</span>
        </div>
        {res.data.map((station) => (
          <div className="table-row" role="row" key={station.id}>
            <span className="text-muted" style={{ fontSize: '0.85em' }}>
              {station.serial}
            </span>
            <span>{station.name}</span>
            <span className="tag muted">{station.stationCode}</span>
            <span>{station.riverName ?? '—'}</span>
            <span>{station.tidalStatus ?? '—'}</span>
            <span>
              {station.waterBodies && station.waterBodies.length > 0
                ? station.waterBodies.map(({ waterBody }) => (
                    <Link
                      key={waterBody.id}
                      href={`/water-bodies/${waterBody.code}`}
                      style={{ marginRight: '0.4rem' }}
                    >
                      {waterBody.nameEn}
                    </Link>
                  ))
                : '—'}
            </span>
          </div>
        ))}
        {res.data.length === 0 && (
          <div className="empty-state">No stations found for this filter.</div>
        )}
      </div>

      {res.totalPages > 1 && (
        <div className="toolbar" style={{ justifyContent: 'center', marginTop: '1rem' }}>
          {page > 1 && (
            <Link className="chip" href={buildHref({ page: page - 1 })}>
              ← Previous
            </Link>
          )}
          <span className="chip active" aria-current="page">
            {page} / {res.totalPages}
          </span>
          {page < res.totalPages && (
            <Link className="chip" href={buildHref({ page: page + 1 })}>
              Next →
            </Link>
          )}
        </div>
      )}
    </>
  );
}
