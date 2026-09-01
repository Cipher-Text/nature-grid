import Link from 'next/link';
import { apiGet } from '../../../lib/api';
import { routes, type WaterBodyPagedResponse, type DistrictSummary, type WaterBodyType } from '@nature-grid/contracts';
import { titleCase } from '../../../lib/format';

const TYPE_TAG: Record<string, string> = {
  RIVER: 'info',
  WETLAND: 'success',
  LAKE: 'muted',
};

const WATER_BODY_TYPES: WaterBodyType[] = ['RIVER', 'WETLAND', 'LAKE'];

export default async function WaterBodiesPage({
  searchParams,
}: {
  searchParams: { waterBodyType?: string; districtId?: string; page?: string };
}) {
  const waterBodyType = searchParams.waterBodyType as WaterBodyType | undefined;
  const districtId = searchParams.districtId;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;

  const params = new URLSearchParams({ limit: '30', page: String(page) });
  if (waterBodyType) params.set('waterBodyType', waterBodyType);
  if (districtId) params.set('districtId', districtId);

  const [res, districts] = await Promise.all([
    apiGet<WaterBodyPagedResponse>(`${routes.waterBodies.list}?${params.toString()}`, 300),
    apiGet<DistrictSummary[]>(routes.locations.districts, 3600),
  ]);

  function filterHref(overrides: { waterBodyType?: string; districtId?: string }) {
    const next = new URLSearchParams();
    const type = overrides.waterBodyType ?? waterBodyType ?? '';
    const district = overrides.districtId ?? districtId ?? '';
    if (type) next.set('waterBodyType', type);
    if (district) next.set('districtId', district);
    const query = next.toString();
    return `/water-bodies${query ? `?${query}` : ''}`;
  }

  function pageHref(nextPage: number) {
    const href = filterHref({});
    return `${href}${href.includes('?') ? '&' : '?'}page=${nextPage}`;
  }

  return (
    <>
      <div className="panel-header">
        <div>
          <h1>Water Bodies</h1>
          <p>Rivers, wetlands, and lakes of Bangladesh.</p>
        </div>
        <Link href="/water-bodies/stations" className="button ghost">
          Water Level Stations
        </Link>
      </div>

      <form className="toolbar" method="get" aria-label="Water body filters">
        <label htmlFor="waterBodyType">Type</label>
        <select id="waterBodyType" name="waterBodyType" className="select-field" defaultValue={waterBodyType ?? ''}>
          <option value="">All types</option>
          {WATER_BODY_TYPES.map((type) => <option key={type} value={type}>{titleCase(type)}</option>)}
        </select>
        <label htmlFor="districtId">District</label>
        <select id="districtId" name="districtId" className="select-field" defaultValue={districtId ?? ''}>
          <option value="">All districts</option>
          {districts.map((district) => <option key={district.id} value={district.id}>{district.name}</option>)}
        </select>
        <button type="submit" className="button">Apply</button>
        {(waterBodyType || districtId) && <Link className="button ghost" href={filterHref({ waterBodyType: '', districtId: '' })}>Reset</Link>}
      </form>

      <div className="table" role="table" aria-label="Water bodies">
        <div className="table-row table-head" role="row">
          <span>Name</span>
          <span>Type</span>
          <span>Locations</span>
          <span>Transboundary</span>
        </div>
        {res.data.map((wb) => {
          const districts = [
            ...new Set(wb.upazilas.map((u) => u.upazila.district.name)),
          ].slice(0, 3);

          return (
            <div className="table-row" role="row" key={wb.id}>
              <div>
                <Link href={`/water-bodies/${wb.slug}`} className="table-title-link">
                  {wb.nameEn}
                </Link>
                {wb.nameBn && (
                  <span className="text-muted" style={{ marginLeft: '0.4rem', fontSize: '0.85em' }}>
                    {wb.nameBn}
                  </span>
                )}
              </div>
              <span className={`tag ${TYPE_TAG[wb.waterBodyType] ?? 'muted'}`}>
                {titleCase(wb.waterBodyType)}
                {wb.waterBodySubtype ? ` · ${wb.waterBodySubtype}` : ''}
              </span>
              <span>
                {districts.length > 0
                  ? districts.join(', ') + (wb.upazilas.length > 3 * 3 ? ' …' : '')
                  : '—'}
              </span>
              <span>
                {wb.transboundaryFlag ? (
                  <span className="tag warning">
                    {wb.transboundaryCountries ?? 'Yes'}
                  </span>
                ) : (
                  '—'
                )}
              </span>
            </div>
          );
        })}
        {res.data.length === 0 && (
          <div className="empty-state">No water bodies found for this filter.</div>
        )}
      </div>

      {res.totalPages > 1 && (
        <div className="toolbar" style={{ justifyContent: 'center', marginTop: '1rem' }}>
          {page > 1 && (
            <Link
              className="chip"
              href={pageHref(page - 1)}
            >
              ← Previous
            </Link>
          )}
          <span className="chip active" aria-current="page">
            {page} / {res.totalPages}
          </span>
          {page < res.totalPages && (
            <Link
              className="chip"
              href={pageHref(page + 1)}
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </>
  );
}
