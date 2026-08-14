import Link from 'next/link';
import { CONDITIONS } from '../lib/static-data';

const FILTER_TABS: { label: string; href: string; active?: boolean }[] = [
  { label: 'All', href: '/#map', active: true },
  { label: 'Alerts', href: '/alerts' },
  { label: 'Reports', href: '/reports' },
  { label: 'Species', href: '/biodiversity' },
];

export default function MapSection() {
  return (
    <section
      id="map"
      className="content-grid public-section"
      aria-label="Environmental map"
    >
      {/* ── Map panel ── */}
      <article className="panel">
        <div className="panel-header">
          <div>
            <h2>Environmental map</h2>
            <p>
              Verified reports, active alerts, biodiversity and restoration
              coverage
            </p>
          </div>
          <div className="segmented" role="group" aria-label="Map filter">
            {FILTER_TABS.map(({ label, href, active }) => (
              <Link
                key={label}
                href={href}
                className={`segmented-btn${active ? ' active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* CSS-rendered map canvas — replace with real map library in Phase 4 */}
        <div
          className="map-canvas polished"
          role="img"
          aria-label="Bangladesh environmental data map showing districts, alert zones, and verified reports"
        >
          <div className="map-river" aria-hidden="true" />
          <div className="map-zone map-zone-one" aria-hidden="true" />
          <div className="map-zone map-zone-two" aria-hidden="true" />
          <div className="map-zone map-zone-three" aria-hidden="true" />
          <div className="map-point map-point-a" aria-hidden="true" />
          <div className="map-point map-point-b" aria-hidden="true" />
          <div className="map-label map-label-primary" aria-hidden="true">
            Dhaka verified reports
          </div>
          <div className="map-label map-label-alert" aria-hidden="true">
            Sylhet flood watch
          </div>
        </div>

        <div className="button-row" style={{ marginTop: '14px' }}>
          <Link className="button ghost" href="/alerts">
            Full alert map
          </Link>
          <Link className="button ghost" href="/reports">
            All verified reports
          </Link>
        </div>
      </article>

      {/* ── Conditions sidebar ── */}
      <aside className="panel" aria-label="Current environmental conditions">
        <div className="panel-header">
          <div>
            <h2>Current conditions</h2>
            <p>Public preview from approved data sources</p>
          </div>
        </div>

        <div className="condition-list">
          {CONDITIONS.map(({ label, value, variant }) => (
            <div key={label} className="condition-row">
              <span>{label}</span>
              <strong className={variant ?? ''}>{value}</strong>
            </div>
          ))}
        </div>

        <div className="access-note">
          <strong>Advanced filters and downloads</strong>
          <span>
            Sign in and request dataset access to export data or use API keys.
          </span>
        </div>

        <Link
          className="button ghost"
          href="/data"
          style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}
        >
          Explore all datasets
        </Link>
      </aside>
    </section>
  );
}
