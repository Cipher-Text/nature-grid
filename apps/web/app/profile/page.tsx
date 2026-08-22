import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import AppSidebar from '../../components/app-sidebar';
import { getCurrentUser } from '../../lib/current-user';
import { apiGet, apiGetAuthed } from '../../lib/api';
import { logoutAction } from '../../lib/auth-actions';
import { subscribeAction, unsubscribeAction } from '../../lib/notification-actions';
import {
  routes,
  type CitizenReport,
  type Observation,
  type AlertSubscription,
  type PaginatedEnvelope,
} from '@nature-grid/contracts';
import { titleCase, relativeTime } from '../../lib/format';
import { ACCESS_TOKEN_COOKIE } from '../../lib/session-constants';

// ── Constants ─────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<string, string> = {
  CITIZEN:           'Citizen contributor',
  RESEARCHER:        'Researcher',
  ORGANIZATION_ADMIN:'Organization admin',
  GOVERNMENT:        'Government',
  MODERATOR:         'Moderator',
  ADMIN:             'Admin',
};

const REPORT_STATUS_VARIANT: Record<string, string> = {
  VERIFIED:     'success',
  RESOLVED:     'success',
  REJECTED:     'danger',
  SUBMITTED:    'muted',
  UNDER_REVIEW: 'info',
};

const TRUST_VARIANT: Record<string, string> = {
  RESEARCH_GRADE: 'success',
  COMMUNITY:      'info',
  UNVERIFIED:     'muted',
  FLAGGED:        'danger',
};

const SEVERITY_LABEL: Record<string, string> = {
  INFO:      'All alerts (Info+)',
  WATCH:     'Watch and above',
  WARNING:   'Warning and above',
  EMERGENCY: 'Emergency only',
};

const SEVERITY_VARIANT: Record<string, string> = {
  INFO:      'info',
  WATCH:     'warning',
  WARNING:   'warning',
  EMERGENCY: 'danger',
};

interface DistrictOption { id: string; name: string; }

function initials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function monthYear(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: { subscribed?: string; unsubscribed?: string; sub_error?: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const accessToken = cookies().get(ACCESS_TOKEN_COOKIE)?.value ?? '';

  const [myReports, myObservations, subscriptions, districts] = await Promise.all([
    apiGetAuthed<PaginatedEnvelope<CitizenReport>>(routes.reports.mine, accessToken).catch(
      (): PaginatedEnvelope<CitizenReport> => ({ data: [], total: 0, page: 1, pageSize: 10 }),
    ),
    apiGetAuthed<PaginatedEnvelope<Observation>>(routes.observations.mine, accessToken).catch(
      (): PaginatedEnvelope<Observation> => ({ data: [], total: 0, page: 1, pageSize: 10 }),
    ),
    apiGetAuthed<AlertSubscription[]>(routes.notifications.subscriptions, accessToken).catch(
      (): AlertSubscription[] => [],
    ),
    apiGet<DistrictOption[]>(routes.locations.districts),
  ]);

  return (
    <div className="app-shell">
      <AppSidebar active="profile" />
      <main className="main">

        {/* ── Hero ── */}
        <header className="profile-hero" aria-label="Your profile">
          <div className="avatar" aria-hidden="true">
            {initials(user.displayName)}
          </div>
          <div>
            <p className="eyebrow">{ROLE_LABELS[user.role] ?? user.role}</p>
            <h1>{user.displayName}</h1>
            <p>{user.email}</p>
            <div className="stat-row" aria-label="Account details">
              <div>
                <strong>{myReports.total}</strong>
                <span>Reports</span>
              </div>
              <div>
                <strong>{myObservations.total}</strong>
                <span>Observations</span>
              </div>
              <div>
                <strong>{monthYear(user.createdAt)}</strong>
                <span>Member since</span>
              </div>
            </div>
          </div>
          <form action={logoutAction} style={{ alignSelf: 'start' }}>
            <button className="button ghost" type="submit">Sign out</button>
          </form>
        </header>

        {/* ── My reports ── */}
        <article className="panel" style={{ marginTop: 20 }}>
          <div className="panel-header">
            <div>
              <h2>My reports</h2>
              <p>All your submissions including pending and rejected</p>
            </div>
            <Link className="button ghost" href="/reports">Submit new</Link>
          </div>

          {myReports.data.length === 0 ? (
            <div className="empty-state">
              No reports yet.{' '}
              <Link href="/reports">Submit your first report</Link>.
            </div>
          ) : (
            <div className="table" role="table" aria-label="My reports">
              <div className="table-row table-head" role="row">
                <span>Title</span>
                <span>Location</span>
                <span>Status</span>
                <span>Submitted</span>
              </div>
              {myReports.data.map((r) => (
                <Link
                  key={r.id}
                  className="table-row table-row-link"
                  role="row"
                  href={`/reports/${r.id}`}
                >
                  <strong>{r.title}</strong>
                  <span>{r.district?.name ?? '—'}</span>
                  <span className={`tag ${REPORT_STATUS_VARIANT[r.status] ?? 'muted'}`}>
                    {titleCase(r.status)}
                  </span>
                  <span>{relativeTime(r.createdAt)}</span>
                </Link>
              ))}
            </div>
          )}
        </article>

        {/* ── My observations ── */}
        <article className="panel" style={{ marginTop: 20 }}>
          <div className="panel-header">
            <div>
              <h2>My observations</h2>
              <p>Your submitted environmental observations</p>
            </div>
            <Link className="button ghost" href="/observations">Submit new</Link>
          </div>

          {myObservations.data.length === 0 ? (
            <div className="empty-state">
              No observations yet.{' '}
              <Link href="/observations">Submit your first observation</Link>.
            </div>
          ) : (
            <div className="table" role="table" aria-label="My observations">
              <div className="table-row table-head" role="row">
                <span>Category</span>
                <span>Location</span>
                <span>Trust level</span>
                <span>Observed</span>
              </div>
              {myObservations.data.map((o) => (
                <Link
                  key={o.id}
                  className="table-row table-row-link"
                  role="row"
                  href={`/observations/${o.id}`}
                >
                  <span>{titleCase(o.category)}</span>
                  <span>{o.district?.name ?? '—'}</span>
                  <span className={`tag ${TRUST_VARIANT[o.trustLevel] ?? 'muted'}`}>
                    {titleCase(o.trustLevel)}
                  </span>
                  <span>{relativeTime(o.observedAt)}</span>
                </Link>
              ))}
            </div>
          )}
        </article>

        {/* ── Alert subscriptions ── */}
        <article className="panel" style={{ marginTop: 20 }}>
          <div className="panel-header">
            <div>
              <h2>Alert subscriptions</h2>
              <p>Get email notifications when new alerts are issued</p>
            </div>
          </div>

          {searchParams.subscribed && (
            <p className="form-success">Subscription created.</p>
          )}
          {searchParams.unsubscribed && (
            <p className="form-success">Unsubscribed successfully.</p>
          )}
          {searchParams.sub_error && (
            <p className="form-error">{searchParams.sub_error}</p>
          )}

          {subscriptions.length > 0 ? (
            <div className="subscription-list">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="subscription-row">
                  <div className="subscription-info">
                    <strong>{sub.district?.name ?? 'Nationwide'}</strong>
                    <span className={`tag ${SEVERITY_VARIANT[sub.minSeverity] ?? 'muted'}`}>
                      {SEVERITY_LABEL[sub.minSeverity] ?? sub.minSeverity}
                    </span>
                  </div>
                  <form action={unsubscribeAction.bind(null, sub.id)}>
                    <button className="button ghost" type="submit">Remove</button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted-text">No subscriptions yet.</p>
          )}

          <div className="subscription-form-section">
            <h3>Add subscription</h3>
            <form action={subscribeAction} className="subscription-form">
              <div className="subscription-form-fields">
                <div className="field" style={{ margin: 0 }}>
                  <label htmlFor="districtId">Location</label>
                  <select id="districtId" name="districtId" className="select-field">
                    <option value="">Nationwide (all districts)</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label htmlFor="minSeverity">Minimum severity</label>
                  <select id="minSeverity" name="minSeverity" className="select-field">
                    <option value="INFO">All alerts (Info+)</option>
                    <option value="WATCH">Watch and above</option>
                    <option value="WARNING">Warning and above</option>
                    <option value="EMERGENCY">Emergency only</option>
                  </select>
                </div>
              </div>
              <button className="button" type="submit" style={{ marginTop: 12 }}>
                Subscribe
              </button>
            </form>
          </div>
        </article>

      </main>
    </div>
  );
}
