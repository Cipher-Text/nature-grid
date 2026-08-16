import { redirect } from 'next/navigation';
import Link from 'next/link';
import AppSidebar from '../../components/app-sidebar';
import { getCurrentUser } from '../../lib/current-user';
import { logoutAction } from '../../lib/auth-actions';

const ROLE_LABELS: Record<string, string> = {
  CITIZEN: 'Citizen contributor',
  RESEARCHER: 'Researcher',
  ORGANIZATION_ADMIN: 'Organization admin',
  GOVERNMENT: 'Government',
  MODERATOR: 'Moderator',
  ADMIN: 'Admin',
};

function initials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function monthYear(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

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
      </main>
    </div>
  );
}
