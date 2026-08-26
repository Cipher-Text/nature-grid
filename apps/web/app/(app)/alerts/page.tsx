import Link from 'next/link';
import { apiGet } from '../../../lib/api';
import { getCurrentUser } from '../../../lib/current-user';
import { routes, type Alert, type PaginatedEnvelope } from '@nature-grid/contracts';
import { titleCase } from '../../../lib/format';

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
    <>
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
        <Link className="alert-strip danger" href={`/alerts/${emergency.id}`} role="alert">
          {emergency.title} — {emergency.district?.name ?? 'Nationwide'} →
        </Link>
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
          <Link
            key={a.id}
            href={`/alerts/${a.id}`}
            className={`alert-card alert-card-link ${SEVERITY_CARD_CLASS[a.severity] ?? 'info-card'}`}
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
          </Link>
        ))}
        {activeRes.data.length === 0 && (
          <div className="empty-state">No active alerts at this severity.</div>
        )}
      </div>

      <article className="panel">
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
            <Link className="table-row table-row-link" role="row" key={a.id} href={`/alerts/${a.id}`}>
              <strong>{a.title}</strong>
              <span>{a.district?.name ?? 'Nationwide'}</span>
              <span className={`tag ${SEVERITY_BADGE_CLASS[a.severity] ?? 'info'}`}>
                {titleCase(a.severity)}
              </span>
              <span className="tag muted">{titleCase(a.status)}</span>
            </Link>
          ))}
          {historyRes.data.length === 0 && (
            <div className="empty-state">No expired alerts yet.</div>
          )}
        </div>
      </article>

      <div className="access-note">
        <strong>Get notified about alerts</strong>
        <span>
          Visit your{' '}
          <Link href="/profile">profile</Link>{' '}
          to subscribe to district or nationwide alert emails.
        </span>
      </div>
    </>
  );
}
