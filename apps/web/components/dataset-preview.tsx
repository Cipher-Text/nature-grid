import Link from 'next/link';
import { DATASETS } from '../lib/static-data';

const ACCESS_LABEL: Record<string, string> = {
  'sign-in': 'Sign in',
  request: 'Request',
  restricted: 'Restricted',
};

const ACCESS_VARIANT: Record<string, string> = {
  'sign-in': 'warning',
  request: 'warning',
  restricted: 'danger',
};

export default function DatasetPreview() {
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
        <Link className="button ghost" href="/data">
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

        {DATASETS.map((ds) => (
          <div key={ds.name} className="data-table-row" role="row">
            <span role="cell">{ds.name}</span>
            <span role="cell">{ds.category}</span>
            <span role="cell">
              <mark className="tag success">Preview</mark>
            </span>
            <span role="cell">
              <mark className={`tag ${ACCESS_VARIANT[ds.advancedAccess]}`}>
                {ACCESS_LABEL[ds.advancedAccess]}
              </mark>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
