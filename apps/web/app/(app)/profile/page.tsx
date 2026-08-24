import { cookies } from 'next/headers';
import Link from 'next/link';
import { getCurrentUser } from '../../../lib/current-user';
import { apiGet, apiGetAuthed } from '../../../lib/api';
import { subscribeAction, unsubscribeAction } from '../../../lib/notification-actions';
import {
  routes,
  type CitizenReport,
  type Observation,
  type AlertSubscription,
  type PaginatedEnvelope,
} from '@nature-grid/contracts';
import { titleCase, relativeTime } from '../../../lib/format';
import { ACCESS_TOKEN_COOKIE } from '../../../lib/session-constants';
import { updateProfileAction } from '../../../lib/profile-actions';
import { ENVIRONMENTAL_EXPERTISE, ENVIRONMENTAL_RESEARCH_INTERESTS } from '@nature-grid/shared';
import TagInput from '../../../components/tag-input';

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

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: { subscribed?: string; unsubscribed?: string; sub_error?: string; profileSaved?: string; profileError?: string };
}) {
  const user = await getCurrentUser();
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
  const profile = user?.profile;
  const social = Object.fromEntries((user?.socialLinks ?? []).map((link) => [link.platform, link.url]));

  return (
    <>
      {/* ── Hero ── */}
      <header className="profile-hero" aria-label="Your profile">
        <div className="avatar" aria-hidden="true">
          {user ? initials(user.displayName) : '?'}
        </div>
        <div>
          <p className="eyebrow">{user ? (ROLE_LABELS[user.role] ?? user.role) : ''}</p>
          <h1>{user?.displayName}</h1>
          <p>{user?.email}</p>
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
              <strong>{user ? monthYear(user.createdAt) : '—'}</strong>
              <span>Member since</span>
            </div>
          </div>
        </div>
      </header>

      {searchParams.profileSaved && <div className="flash flash-success">Profile updated.</div>}
      {searchParams.profileError && <div className="flash flash-error">{searchParams.profileError}</div>}

      <article className="panel profile-edit-panel">
        <div className="panel-header">
          <div>
            <h2>Profile information</h2>
            <p>Keep your professional identity and public links up to date.</p>
          </div>
        </div>
        <form action={updateProfileAction} className="profile-form">
          <div className="profile-form-grid">
            <label>Name<input name="displayName" defaultValue={user?.displayName} required /></label>
            <label>Email<input value={user?.email} readOnly /></label>
            <label>Phone<input name="phone" defaultValue={profile?.phone ?? ''} placeholder="Optional" /></label>
            <label>Occupation<input name="occupation" defaultValue={profile?.occupation ?? ''} placeholder="Researcher, ecologist..." /></label>
            <label>Education<input name="education" defaultValue={profile?.education ?? ''} placeholder="Degree or qualification" /></label>
            <label>Institution<input name="institution" defaultValue={profile?.institution ?? ''} placeholder="University or employer" /></label>
            <label>District<select name="locationDistrict" defaultValue={profile?.locationDistrict ?? ''}>
              <option value="">Select district</option>
              {districts.map((district) => (
                <option key={district.id} value={district.name}>{district.name}</option>
              ))}
            </select></label>
            <label>Country<input value={profile?.locationCountry ?? 'Bangladesh'} readOnly /></label>
          </div>
          <label>Biography<textarea name="bio" defaultValue={profile?.bio ?? ''} rows={3} placeholder="A short introduction" /></label>
          <div className="profile-form-grid">
            <TagInput name="expertise" label="Expertise" initialValues={profile?.expertise ?? []} suggestions={ENVIRONMENTAL_EXPERTISE} placeholder="Add expertise" />
            <TagInput name="researchInterests" label="Research interests" initialValues={profile?.researchInterests ?? []} suggestions={ENVIRONMENTAL_RESEARCH_INTERESTS} placeholder="Add research interest" />
          </div>
          <h3>Professional and social links</h3>
          <div className="profile-form-grid">
            <label>Google Scholar<input name="googleScholar" defaultValue={social.googleScholar ?? ''} placeholder="https://scholar.google.com/..." /></label>
            <label>ResearchGate<input name="researchGate" defaultValue={social.researchGate ?? ''} placeholder="https://researchgate.net/..." /></label>
            <label>ORCID<input name="orcid" defaultValue={social.orcid ?? ''} placeholder="https://orcid.org/..." /></label>
            <label>LinkedIn<input name="linkedin" defaultValue={social.linkedin ?? ''} placeholder="https://linkedin.com/in/..." /></label>
            <label>Personal website<input name="website" defaultValue={social.website ?? ''} placeholder="https://..." /></label>
            <label>GitHub<input name="github" defaultValue={social.github ?? ''} placeholder="https://github.com/..." /></label>
            <label>Facebook<input name="facebook" defaultValue={social.facebook ?? ''} placeholder="https://facebook.com/..." /></label>
          </div>
          <h3>Visibility</h3>
          <div className="profile-form-grid">
            <label>Profile visibility<select name="profileVisibility" defaultValue={profile?.profileVisibility ?? 'PUBLIC'}><option value="PUBLIC">Public</option><option value="MEMBERS_ONLY">Members only</option><option value="PRIVATE">Private</option></select></label>
            <label>Contact visibility<select name="contactVisibility" defaultValue={profile?.contactVisibility ?? 'PRIVATE'}><option value="PUBLIC">Public</option><option value="MEMBERS_ONLY">Members only</option><option value="PRIVATE">Private</option></select></label>
            <label>Links visibility<select name="linksVisibility" defaultValue={profile?.linksVisibility ?? 'PUBLIC'}><option value="PUBLIC">Public</option><option value="MEMBERS_ONLY">Members only</option><option value="PRIVATE">Private</option></select></label>
          </div>
          <button className="button" type="submit">Save profile</button>
        </form>
      </article>

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
    </>
  );
}
