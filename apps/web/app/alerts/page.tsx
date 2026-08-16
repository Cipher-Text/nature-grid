import Link from 'next/link';
import AppSidebar from '../../components/app-sidebar';
import { apiGet } from '../../lib/api';
import { getCurrentUser } from '../../lib/current-user';
import { routes, type Alert, type PaginatedEnvelope } from '@nature-grid/contracts';
import { titleCase } from '../../lib/format';

const SEVERITIES = ['EMERGENCY', 'WARNING', 'WATCH', 'INFO'] as const;

const SEVERITY_CARD_CLASS: Record<string, string> = {
  EMERGENCY: 'danger-card',
  WARNING: 'warning-card',
  WATCH: 'warning-card',
  INFO: 'info-card',
};

const SEVERITY_BADGE_CLASS: Record<string, string> = {
  EMERGENCY: 'danger',
  WARNING: 'warning',
  WATCH: 'warning',
  INFO: 'info',
};

const ISSUER_ROLES = new Set(['GOVERNMENT', 'MODERATOR', 'ADMIN']);

export default async function AlertsPage({
  searchParams,
}: {
  searchParams: { severity?: string };
}) {
  const severity = searchParams.severity;
  const activePath = severity
    ? `${routes.alerts.list}?severity=${severity}`
    : routes.alerts.list;

  const [activeRes, historyRes, user] = await Promise.all([
    apiGet<PaginatedEnvelope<Alert>>(activePath),
    apiGet<PaginatedEnvelope<Alert>>(`${routes.alerts.list}?status=EXPIRED`),
    getCurrentUser(),
  ]);

  const emergency = activeRes.data.find((a) => a.severity === 'EMERGENCY');
  const canIssueAlerts = user !== null && ISSUER_ROLES.has(user.role);

  return (
    <div className="app-shell">
      <AppSidebar active="alerts" />
      <main className="main">
        <div className="panel-header">
          <div>
            <h1>Alerts</h1>
            <p>Active disaster and environmental warnings for Bangladesh.</p>
          </div>
          {canIssueAlerts && (
            <span className="tag warning" title="Alert creation UI isn't built yet">
              Issue alert — coming soon
            </span>
          )}
        </div>

        {emergency && (
          <div className="alert-strip danger" role="alert">
            {emergency.title} — {emergency.district?.name ?? 'Nationwide'}
          </div>
        )}

        <div className="toolbar" aria-label="Severity filter">
          <Link className={`chip${!severity ? ' active' : ''}`} href="/alerts">
            All
          </Link>
          {SEVERITIES.map((s) => (
            <Link
              key={s}
              className={`chip${severity === s ? ' active' : ''}`}
              href={`/alerts?severity=${s}`}
            >
              {titleCase(s)}
            </Link>
          ))}
        </div>

        <div className="alert-grid">
          {activeRes.data.map((a) => (
            <article
              key={a.id}
              className={`alert-card ${SEVERITY_CARD_CLASS[a.severity] ?? 'info-card'}`}
            >
              <span className={SEVERITY_BADGE_CLASS[a.severity] ?? 'info'}>
                {titleCase(a.severity)}
              </span>
              <h2>{a.title}</h2>
              <p>{a.description}</p>
              <p className="muted">
                {a.district?.name ?? 'Nationwide'} · Issued{' '}
                {new Date(a.issuedAt).toLocaleDateString()}
                {a.expiresAt && ` · Expires ${new Date(a.expiresAt).toLocaleDateString()}`}
              </p>
            </article>
          ))}
          {activeRes.data.length === 0 && (
            <div className="empty-state">No active alerts at this severity.</div>
          )}
        </div>

        {/* CSS-rendered map canvas — replace with real map library in Phase 4 */}
        <article className="panel" style={{ marginTop: '20px' }}>
          <div className="panel-header">
            <div>
              <h2>Warning zones</h2>
              <p>Illustrative overview — replace with a real map in a later phase</p>
            </div>
          </div>
          <div
            className="map-canvas polished"
            role="img"
            aria-label="Illustrative map of alert zones"
          >
            <div className="map-river" aria-hidden="true" />
            <div className="map-zone map-zone-one" aria-hidden="true" />
            <div className="map-zone map-zone-two" aria-hidden="true" />
            <div className="map-point map-point-a" aria-hidden="true" />
          </div>
        </article>

        <article className="panel" style={{ marginTop: '20px' }}>
          <div className="panel-header">
            <div>
              <h2>Alert history</h2>
              <p>Expired alerts</p>
            </div>
          </div>
          <div className="table" role="table" aria-label="Alert history">
            <div className="table-row table-head" role="row">
              <span>Alert</span>
              <span>Area</span>
              <span>Severity</span>
              <span>Status</span>
            </div>
            {historyRes.data.map((a) => (
              <div className="table-row" role="row" key={a.id}>
                <strong>{a.title}</strong>
                <span>{a.district?.name ?? 'Nationwide'}</span>
                <span className={`tag ${SEVERITY_BADGE_CLASS[a.severity] ?? 'info'}`}>
                  {titleCase(a.severity)}
                </span>
                <span className="tag muted">{titleCase(a.status)}</span>
              </div>
            ))}
            {historyRes.data.length === 0 && (
              <div className="empty-state">No expired alerts yet.</div>
            )}
          </div>
        </article>

        <div className="info-banner" style={{ marginTop: '20px' }}>
          Alert notification subscriptions aren&apos;t available yet — coming soon.
        </div>
      </main>
    </div>
  );
}
