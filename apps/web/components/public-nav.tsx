import Link from 'next/link';

const NAV_LINKS = [
  { href: '/data', label: 'Data' },
  { href: '/observations', label: 'Observations' },
  { href: '/reports', label: 'Reports' },
  { href: '/alerts', label: 'Alerts' },
  { href: '/biodiversity', label: 'Biodiversity' },
  { href: '/restoration', label: 'Restoration' },
  { href: '/community', label: 'Community' },
] as const;

export default function PublicNav() {
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
        <Link className="button ghost" href="/profile">
          Sign in
        </Link>
      </div>
    </header>
  );
}
