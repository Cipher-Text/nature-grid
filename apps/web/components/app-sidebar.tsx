import Link from 'next/link';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    links: [{ key: 'board', href: '/', label: 'Public Board' }],
  },
  {
    label: 'Explore',
    links: [
      { key: 'data', href: '/data', label: 'Data Hub' },
      { key: 'observations', href: '/observations', label: 'Observations' },
      { key: 'reports', href: '/reports', label: 'Citizen Reports' },
      { key: 'alerts', href: '/alerts', label: 'Alerts' },
      { key: 'biodiversity', href: '/biodiversity', label: 'Biodiversity' },
      { key: 'restoration', href: '/restoration', label: 'Restoration' },
      { key: 'community', href: '/community', label: 'Community' },
    ],
  },
  {
    label: 'Account',
    links: [{ key: 'profile', href: '/profile', label: 'Profile' }],
  },
] as const;

type NavKey = (typeof NAV_SECTIONS)[number]['links'][number]['key'];

/** Sidebar shell for the authenticated app pages (mirrors mocks/frontend-design's .app-shell). */
export default function AppSidebar({ active }: { active: NavKey }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">NG</div>
        <div>
          <strong>Nature Grid</strong>
          <span>Environmental intelligence</span>
        </div>
      </div>
      <nav aria-label="Main navigation">
        {NAV_SECTIONS.flatMap((section) => [
          <span className="nav-label" key={`${section.label}-label`}>
            {section.label}
          </span>,
          ...section.links.map((link) => (
            <Link
              key={link.key}
              className={link.key === active ? 'active' : undefined}
              href={link.href}
            >
              {link.label}
            </Link>
          )),
        ])}
      </nav>
    </aside>
  );
}
