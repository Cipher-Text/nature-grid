import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="public-hero" aria-label="Platform overview">
      {/* ── Left: copy ── */}
      <div className="hero-copy">
        <p className="eyebrow">Public Environmental Board · Bangladesh</p>
        <h1>Environmental signals, open to everyone.</h1>
        <p>
          Browse active alerts, verified citizen reports, environmental datasets,
          biodiversity records, restoration projects, and community campaigns —
          no login required. Sign in only when you want to contribute, download
          datasets, or track your activity.
        </p>
        <div className="button-row">
          <a className="button" href="#dashboard">
            View dashboard
          </a>
          <Link className="button ghost" href="/login">
            Sign in to contribute
          </Link>
        </div>
      </div>

      {/* ── Right: live status card ── */}
      <aside
        className="hero-status-card"
        aria-label="Platform access summary"
      >
        <div className="status-header">
          <span className="pulse-dot" aria-hidden="true" />
          <span>Live public status</span>
        </div>

        <div className="status-metric">
          <strong>64</strong>
          <span>districts indexed</span>
        </div>

        <div className="access-grid" aria-label="Access tiers">
          {ACCESS_ROWS.map(({ label, badge, variant }) => (
            <div key={label} className="access-grid-row">
              <span>{label}</span>
              <mark className={`tag ${variant}`}>{badge}</mark>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}

const ACCESS_ROWS = [
  { label: 'Public overview', badge: 'Open', variant: 'success' },
  { label: 'Report submission', badge: 'Sign in', variant: 'warning' },
  { label: 'Dataset downloads', badge: 'Request', variant: 'warning' },
  { label: 'Admin workflows', badge: 'Restricted', variant: 'danger' },
] as const;
