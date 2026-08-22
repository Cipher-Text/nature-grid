import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import AppSidebar from '../../components/app-sidebar';
import { getCurrentUser } from '../../lib/current-user';
import { apiGet, apiGetAuthed } from '../../lib/api';
import { logoutAction } from '../../lib/auth-actions';
import { subscribeAction, unsubscribeAction } from '../../lib/notification-actions';
import { routes, type AlertSubscription } from '@nature-grid/contracts';
import { ACCESS_TOKEN_COOKIE } from '../../lib/session-constants';

const ROLE_LABELS: Record<string, string> = {
  CITIZEN: 'Citizen contributor',
  RESEARCHER: 'Researcher',
  ORGANIZATION_ADMIN: 'Organization admin',
  GOVERNMENT: 'Government',
  MODERATOR: 'Moderator',
  ADMIN: 'Admin',
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

interface DistrictOption {
  id: string;
  name: string;
}

function initials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function monthYear(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: { subscribed?: string; unsubscribed?: string; sub_error?: string };
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const accessToken = cookies().get(ACCESS_TOKEN_COOKIE)?.value ?? '';

  const [subscriptions, districts] = await Promise.all([
    apiGetAuthed<AlertSubscription[]>(routes.notifications.subscriptions, accessToken).catch(
      (): AlertSubscription[] => [],
    ),
    apiGet<DistrictOption[]>(routes.locations.districts),
  ]);

  return (
    <div className="app-shell">
      <AppSidebar active="profile" />
      <main className="main">
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
                <strong>{ROLE_LABELS[user.role] ?? user.role}</strong>
                <span>Role</span>
              </div>
              <div>
                <strong>{monthYear(user.createdAt)}</strong>
                <span>Member since</span>
              </div>
              <div>
                <strong>{user.lastLoginAt ? monthYear(user.lastLoginAt) : 'This session'}</strong>
                <span>Last sign-in</span>
              </div>
            </div>
          </div>
          <form action={logoutAction} style={{ alignSelf: 'start' }}>
            <button className="button ghost" type="submit">
              Sign out
            </button>
          </form>
        </header>

        <nav className="tab-nav" aria-label="Profile sections">
          <Link className="active" href="/profile">
            Activity
          </Link>
          <Link href="/reports">My Reports</Link>
          <Link href="/observations">My Observations</Link>
          <Link href="/community">Campaigns</Link>
        </nav>

        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Recent activity</h2>
              <p>Your contributions and platform interactions</p>
            </div>
          </div>
          <div className="empty-state">
            No activity yet. Once report and observation submission are live, your
            contributions will show up here.
          </div>
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
                    <button className="button ghost" type="submit">
                      Remove
                    </button>
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
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
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
