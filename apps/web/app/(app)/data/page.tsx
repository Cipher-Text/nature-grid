import Link from 'next/link';
import { apiGet } from '../../../lib/api';
import { routes, type Dataset, type Provider, type PaginatedEnvelope } from '@nature-grid/contracts';
import { titleCase } from '../../../lib/format';

const CATEGORIES = [
  'WEATHER',
  'AIR_QUALITY',
  'WATER',
  'BIODIVERSITY',
  'REPORTS',
  'MONITORING',
  'GEOSPATIAL',
] as const;

const ACCESS_LABEL: Record<string, { label: string; variant: string }> = {
  PUBLIC: { label: 'Public', variant: 'success' },
  LOGIN_REQUIRED: { label: 'Sign in required', variant: 'warning' },
  RESEARCHER: { label: 'Researcher access', variant: 'warning' },
  APPROVED: { label: 'Approval required', variant: 'danger' },
  GOVERNMENT: { label: 'Government access', variant: 'danger' },
};

export default async function DataPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = searchParams.category;
  const datasetsPath = category
    ? `${routes.datasets.list}?category=${category}`
    : routes.datasets.list;

  const [datasetsRes, providersRes] = await Promise.all([
    apiGet<PaginatedEnvelope<Dataset>>(datasetsPath),
    apiGet<PaginatedEnvelope<Provider>>(`${routes.providers.list}?pageSize=10`),
  ]);

  return (
    <>
      <div className="panel-header">
        <div>
          <h1>Data Hub</h1>
          <p>Environmental dataset catalog for Bangladesh.</p>
        </div>
      </div>

      <div className="toolbar" aria-label="Category filter">
        <Link className={`chip${!category ? ' active' : ''}`} href="/data">
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            className={`chip${category === c ? ' active' : ''}`}
            href={`/data?category=${c}`}
          >
            {titleCase(c)}
          </Link>
        ))}
      </div>

      <div className="table" role="table" aria-label="Dataset catalog">
        <div className="table-row table-head" role="row">
          <span>Dataset</span>
          <span>Category</span>
          <span>Provider</span>
          <span>Access</span>
        </div>
        {datasetsRes.data.map((d) => {
          const access = ACCESS_LABEL[d.accessPolicy];
          return (
            <Link className="table-row table-row-link" role="row" key={d.id} href={`/data/${d.id}`}>
              <strong>{d.name}</strong>
              <span className="tag info">{titleCase(d.category)}</span>
              <span>{d.provider?.name ?? '—'}</span>
              <span className={`tag ${access?.variant ?? 'muted'}`}>
                {access?.label ?? d.accessPolicy}
              </span>
            </Link>
          );
        })}
        {datasetsRes.data.length === 0 && (
          <div className="empty-state">No datasets match this category yet.</div>
        )}
      </div>

      <article className="panel" style={{ marginTop: '20px' }}>
        <div className="panel-header">
          <div>
            <h2>Providers</h2>
            <p>Organizations and agencies contributing data</p>
          </div>
        </div>
        <div className="record-list">
          {providersRes.data.map((p) => (
            <div className="record-item" key={p.id}>
              <strong>{p.name}</strong>
              <span>
                {titleCase(p.type)} · {p.country}
              </span>
            </div>
          ))}
        </div>
      </article>
    </>
  );
}
