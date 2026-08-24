import Link from 'next/link';
import { routes, type Dataset, type PaginatedEnvelope } from '@nature-grid/contracts';
import { apiGet } from '../lib/api';
import { titleCase } from '../lib/format';
import { DATASETS as FALLBACK_DATASETS, type DatasetRow } from '../lib/static-data';

const ACCESS_LABEL: Record<string, { label: string; variant: string }> = {
  PUBLIC: { label: 'Public', variant: 'success' },
  LOGIN_REQUIRED: { label: 'Sign in', variant: 'warning' },
  RESEARCHER: { label: 'Request', variant: 'warning' },
  APPROVED: { label: 'Request', variant: 'warning' },
  GOVERNMENT: { label: 'Restricted', variant: 'danger' },
};

interface PreviewRow {
  name: string;
  category: string;
  accessLabel: string;
  accessVariant: string;
}

/**
 * `isLive: false` only means the API itself was unreachable — falls back to
 * illustrative static content in that case. A real empty catalog (API
 * reachable, genuinely zero datasets) stays `isLive: true` with an empty
 * array, so the caller renders an honest "none yet" state instead of
 * silently swapping in fake data.
 */
async function loadDatasets(): Promise<{ rows: PreviewRow[]; isLive: boolean }> {
  try {
    const res = await apiGet<PaginatedEnvelope<Dataset>>(`${routes.datasets.list}?pageSize=5`);
    return {
      isLive: true,
      rows: res.data.map((d) => {
        const access = ACCESS_LABEL[d.accessPolicy] ?? { label: d.accessPolicy, variant: 'muted' };
        return {
          name: d.name,
          category: titleCase(d.category),
          accessLabel: access.label,
          accessVariant: access.variant,
        };
      }),
    };
  } catch {
    return {
      isLive: false,
      rows: FALLBACK_DATASETS.map((ds: DatasetRow) => ({
        name: ds.name,
        category: ds.category,
        accessLabel: ds.advancedAccess === 'sign-in' ? 'Sign in' : ds.advancedAccess === 'request' ? 'Request' : 'Restricted',
        accessVariant: ds.advancedAccess === 'restricted' ? 'danger' : 'warning',
      })),
    };
  }
}

export default async function DatasetPreview() {
  const { rows, isLive } = await loadDatasets();
  const noDatasets = isLive && rows.length === 0;

  return (
    <section
      id="data"
      className="panel public-section"
      aria-label="Dataset catalog preview"
    >
      <div className="panel-header">
        <div>
          <h2>Dataset catalog</h2>
          <p>
            Public summaries stay open. Downloads, exports, API keys, and
            contributions require sign in.
          </p>
        </div>
        <Link className="button ghost" href="/login">
          Browse all datasets
        </Link>
      </div>

      <div className="data-table" role="table" aria-label="Dataset access summary">
        <div className="data-table-row data-table-head" role="row">
          <span role="columnheader">Dataset</span>
          <span role="columnheader">Category</span>
          <span role="columnheader">Public access</span>
          <span role="columnheader">Advanced</span>
        </div>

        {noDatasets && <div className="empty-state">No datasets published yet.</div>}
        {rows.map((row) => (
          <div key={row.name} className="data-table-row" role="row">
            <span role="cell">{row.name}</span>
            <span role="cell">{row.category}</span>
            <span role="cell">
              <mark className="tag success">Preview</mark>
            </span>
            <span role="cell">
              <mark className={`tag ${row.accessVariant}`}>{row.accessLabel}</mark>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
