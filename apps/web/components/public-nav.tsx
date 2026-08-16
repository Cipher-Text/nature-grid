import Link from 'next/link';
import { getCurrentUser } from '../lib/current-user';
import { logoutAction } from '../lib/auth-actions';

const NAV_LINKS = [
  { href: '/data', label: 'Data' },
  { href: '/observations', label: 'Observations' },
  { href: '/reports', label: 'Reports' },
  { href: '/alerts', label: 'Alerts' },
  { href: '/biodiversity', label: 'Biodiversity' },
  { href: '/restoration', label: 'Restoration' },
  { href: '/community', label: 'Community' },
] as const;

export default async function PublicNav() {
  const user = await getCurrentUser();

  return (
    <header className="public-nav">
      <Link className="public-brand" href="/">
        <span className="brand-mark">NG</span>
        <span>Nature Grid</span>
      </Link>

      <nav aria-label="Public sections">
        {NAV_LINKS.map(({ href, label }) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>

      <div className="nav-actions">
        <Link className="text-link" href="/data">
          Explore data
        </Link>
        {user ? (
          <div className="nav-user">
            <Link className="text-link" href="/profile">
              Hi, {user.displayName}
            </Link>
            <form action={logoutAction}>
              <button className="button ghost" type="submit">
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <Link className="button ghost" href="/login">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
