import Link from 'next/link';
import { apiGet } from '../../../lib/api';
import { routes, type WaterBodyPagedResponse, type HydrologicalClass } from '@nature-grid/contracts';
import { titleCase } from '../../../lib/format';

const CLASS_LABELS: Record<HydrologicalClass, string> = {
  LOTIC: 'Rivers (Lotic)',
  LENTIC: 'Wetlands & Lakes (Lentic)',
};

const TYPE_TAG: Record<string, string> = {
  RIVER: 'info',
  WETLAND: 'success',
  LAKE: 'muted',
};

export default async function WaterBodiesPage({
  searchParams,
}: {
  searchParams: { class?: string; page?: string };
}) {
  const hydrologicalClass = searchParams.class as HydrologicalClass | undefined;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;

  let path = `${routes.waterBodies.list}?limit=30&page=${page}`;
  if (hydrologicalClass) path += `&class=${hydrologicalClass}`;

  const res = await apiGet<WaterBodyPagedResponse>(path, 300);

  return (
    <>
      <div className="panel-header">
        <div>
          <h1>Water Bodies</h1>
          <p>Rivers, wetlands, and lakes of Bangladesh.</p>
        </div>
        <Link href={routes.waterBodies.stations} className="button ghost">
          Water Level Stations
        </Link>
      </div>

      <div className="toolbar" aria-label="Class filter">
        <Link className={`chip${!hydrologicalClass ? ' active' : ''}`} href="/water-bodies">
          All
        </Link>
        {(Object.entries(CLASS_LABELS) as [HydrologicalClass, string][]).map(([cls, label]) => (
          <Link
            key={cls}
            className={`chip${hydrologicalClass === cls ? ' active' : ''}`}
            href={`/water-bodies?class=${cls}`}
          >
            {label}
          </Link>
        ))}
      </div>

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
              href={`/water-bodies?${hydrologicalClass ? `class=${hydrologicalClass}&` : ''}page=${page - 1}`}
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
              href={`/water-bodies?${hydrologicalClass ? `class=${hydrologicalClass}&` : ''}page=${page + 1}`}
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </>
  );
}
