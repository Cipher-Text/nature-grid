import Link from 'next/link';
import { apiGet } from '../../../lib/api';
import {
  routes,
  type FacilityPagedResponse,
  type FacilityType,
  type ComplianceStatus,
  type DistrictSummary,
} from '@nature-grid/contracts';
import { titleCase } from '../../../lib/format';

const FACILITY_TYPES: FacilityType[] = [
  'GARMENT', 'TANNERY', 'BRICK_FIELD', 'POWER_PLANT', 'SHIPBREAKING',
  'TEXTILE', 'CEMENT', 'STEEL', 'CHEMICAL', 'PHARMACEUTICAL',
  'FERTILIZER', 'PAPER_MILL', 'FOOD_PROCESSING', 'OIL_REFINERY', 'OTHER',
];

const COMPLIANCE_STATUSES: ComplianceStatus[] = [
  'COMPLIANT', 'NON_COMPLIANT', 'UNDER_REVIEW', 'UNKNOWN',
];

const COMPLIANCE_TAG: Record<ComplianceStatus, string> = {
  COMPLIANT: 'success',
  NON_COMPLIANT: 'error',
  UNDER_REVIEW: 'warning',
  UNKNOWN: 'muted',
};

const COMPLIANCE_LABEL: Record<ComplianceStatus, string> = {
  COMPLIANT: 'Compliant',
  NON_COMPLIANT: 'Non-compliant',
  UNDER_REVIEW: 'Under review',
  UNKNOWN: 'Unknown',
};

function facilityTypeLabel(type: FacilityType): string {
  const labels: Record<FacilityType, string> = {
    GARMENT: 'Garment',
    TANNERY: 'Tannery',
    BRICK_FIELD: 'Brick Field',
    POWER_PLANT: 'Power Plant',
    SHIPBREAKING: 'Shipbreaking',
    TEXTILE: 'Textile',
    CEMENT: 'Cement',
    STEEL: 'Steel',
    CHEMICAL: 'Chemical',
    PHARMACEUTICAL: 'Pharmaceutical',
    FERTILIZER: 'Fertilizer',
    PAPER_MILL: 'Paper Mill',
    FOOD_PROCESSING: 'Food Processing',
    OIL_REFINERY: 'Oil Refinery',
    OTHER: 'Other',
  };
  return labels[type] ?? titleCase(type);
}

export default async function FacilitiesPage({
  searchParams,
}: {
  searchParams: {
    facilityType?: string;
    complianceStatus?: string;
    districtId?: string;
    page?: string;
  };
}) {
  const { facilityType, complianceStatus, districtId, page } = searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  const params = new URLSearchParams({ limit: '25', page: String(currentPage) });
  if (facilityType) params.set('facilityType', facilityType);
  if (complianceStatus) params.set('complianceStatus', complianceStatus);
  if (districtId) params.set('districtId', districtId);

  const [res, districts] = await Promise.all([
    apiGet<FacilityPagedResponse>(`${routes.industrialSites.list}?${params.toString()}`, 300),
    apiGet<DistrictSummary[]>(routes.locations.districts, 3600),
  ]);

  const hasFilter = !!(facilityType || complianceStatus || districtId);

  function filterHref(overrides: {
    facilityType?: string;
    complianceStatus?: string;
    districtId?: string;
  }) {
    const next = new URLSearchParams();
    const type = overrides.facilityType ?? facilityType ?? '';
    const status = overrides.complianceStatus ?? complianceStatus ?? '';
    const district = overrides.districtId ?? districtId ?? '';
    if (type) next.set('facilityType', type);
    if (status) next.set('complianceStatus', status);
    if (district) next.set('districtId', district);
    const qs = next.toString();
    return `/industrial-sites${qs ? `?${qs}` : ''}`;
  }

  function pageHref(nextPage: number) {
    const href = filterHref({});
    return `${href}${href.includes('?') ? '&' : '?'}page=${nextPage}`;
  }

  const totalPages = Math.ceil(res.total / res.pageSize);

  return (
    <>
      <div className="panel-header">
        <div>
          <h1>Industrial Sites</h1>
          <p>
            Directory of factories, power plants, tanneries, and other industrial sites
            with potential environmental impact across Bangladesh.
          </p>
        </div>
      </div>

      <form className="toolbar" method="get" aria-label="Facility filters">
        <label htmlFor="facilityType">Type</label>
        <select
          id="facilityType"
          name="facilityType"
          className="select-field"
          defaultValue={facilityType ?? ''}
        >
          <option value="">All types</option>
          {FACILITY_TYPES.map((t) => (
            <option key={t} value={t}>
              {facilityTypeLabel(t)}
            </option>
          ))}
        </select>

        <label htmlFor="complianceStatus">Compliance</label>
        <select
          id="complianceStatus"
          name="complianceStatus"
          className="select-field"
          defaultValue={complianceStatus ?? ''}
        >
          <option value="">All statuses</option>
          {COMPLIANCE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {COMPLIANCE_LABEL[s]}
            </option>
          ))}
        </select>

        <label htmlFor="districtId">District</label>
        <select
          id="districtId"
          name="districtId"
          className="select-field"
          defaultValue={districtId ?? ''}
        >
          <option value="">All districts</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <button type="submit" className="button">
          Apply
        </button>
        {hasFilter && (
          <Link className="button ghost" href={filterHref({ facilityType: '', complianceStatus: '', districtId: '' })}>
            Reset
          </Link>
        )}
      </form>

      <div className="table" role="table" aria-label="Industrial facilities">
        <div className="table-row table-head" role="row">
          <span>Name</span>
          <span>Type</span>
          <span>Compliance</span>
          <span>District</span>
          <span>Operator</span>
        </div>

        {res.data.map((facility) => (
          <div className="table-row" role="row" key={facility.id}>
            <div>
              <Link href={`/industrial-sites/${facility.id}`} className="table-title-link">
                {facility.name}
              </Link>
              {facility.bnName && (
                <span className="text-muted" style={{ marginLeft: '0.4rem', fontSize: '0.85em' }}>
                  {facility.bnName}
                </span>
              )}
              {!facility.isActive && (
                <span className="tag muted" style={{ marginLeft: '0.4rem' }}>
                  Inactive
                </span>
              )}
            </div>
            <span className="tag muted">{facilityTypeLabel(facility.facilityType)}</span>
            <span className={`tag ${COMPLIANCE_TAG[facility.complianceStatus]}`}>
              {COMPLIANCE_LABEL[facility.complianceStatus]}
            </span>
            <span>{facility.district.name}</span>
            <span>{facility.operatorName ?? '—'}</span>
          </div>
        ))}

        {res.data.length === 0 && (
          <div className="empty-state">No facilities found for this filter.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="toolbar" style={{ justifyContent: 'center', marginTop: '1rem' }}>
          {currentPage > 1 && (
            <Link className="chip" href={pageHref(currentPage - 1)}>
              ← Previous
            </Link>
          )}
          <span className="chip active" aria-current="page">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link className="chip" href={pageHref(currentPage + 1)}>
              Next →
            </Link>
          )}
        </div>
      )}
    </>
  );
}
