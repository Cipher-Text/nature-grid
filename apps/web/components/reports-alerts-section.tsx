import Link from 'next/link';
import { REPORTS, ALERTS } from '../lib/static-data';

const SEVERITY_CLASS: Record<string, string> = {
  EMERGENCY: 'danger',
  WARNING: 'warning',
  INFO: 'info',
};

export default function ReportsAlertsSection() {
  return (
    <section
      className="public-grid public-section"
      aria-label="Reports and alerts"
    >
      {/* ── Verified reports ── */}
      <article className="panel">
        <div className="panel-header">
          <div>
            <h2>Verified reports</h2>
            <p>Public users see only reviewed environmental issues.</p>
          </div>
          <Link className="button ghost" href="/reports">
            View all
          </Link>
        </div>

        <div className="record-list">
          {REPORTS.map((r) => (
            <div key={r.title} className="record-item">
              <strong>{r.title}</strong>
              <span>{r.meta}</span>
            </div>
          ))}
        </div>

        <Link className="button ghost gated-action" href="/login">
          Sign in to submit a report
        </Link>
      </article>

      {/* ── Active alerts ── */}
      <article className="panel">
        <div className="panel-header">
          <div>
            <h2>Active alerts</h2>
            <p>Public warnings, concise and easy to scan.</p>
          </div>
          <Link className="button ghost" href="/alerts">
            Alert map
          </Link>
        </div>

        <div className="record-list">
          {ALERTS.map((a) => (
            <div key={a.title} className="record-item">
              <strong className={SEVERITY_CLASS[a.severity]}>{a.title}</strong>
              <span>{a.meta}</span>
            </div>
          ))}
        </div>

        <Link className="button ghost" href="/alerts" style={{ marginTop: '14px', width: '100%', justifyContent: 'center' }}>
          See all alerts
        </Link>
      </article>
    </section>
  );
}
