'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { logoutAction } from '../lib/auth-actions';
import type { CurrentUser } from '../lib/current-user';

const NAV_SECTIONS = [
  {
    label: 'Explore',
    links: [
      { href: '/data', label: 'Data Hub' },
      { href: '/observations', label: 'Observations' },
      { href: '/reports', label: 'Citizen Reports' },
      { href: '/alerts', label: 'Alerts' },
      { href: '/biodiversity', label: 'Biodiversity' },
      { href: '/restoration', label: 'Restoration' },
      { href: '/community', label: 'Community' },
    ],
  },
] as const;

const ROLE_SHORT: Record<string, string> = {
  CITIZEN: 'Citizen',
  RESEARCHER: 'Researcher',
  ORGANIZATION_ADMIN: 'Org Admin',
  GOVERNMENT: 'Government',
  MODERATOR: 'Moderator',
  ADMIN: 'Admin',
};

function initials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

export default function AppSidebar({ user }: { user: CurrentUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  }

  function close() {
    setOpen(false);
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-header">
        <Link className="mobile-brand" href="/reports" onClick={close}>
          <span className="brand-mark">NG</span>
          <span>Nature Grid</span>
        </Link>
        <button
          className="mobile-menu-btn"
          aria-label="Open navigation"
          onClick={() => setOpen(true)}
        >
          <span className="hamburger-icon" />
        </button>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="sidebar-overlay"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${open ? ' sidebar-open' : ''}`}>
        {/* Brand header */}
        <div className="sidebar-header">
          <Link className="sidebar-brand" href="/reports" onClick={close}>
            <div className="brand-mark">NG</div>
            <div className="sidebar-brand-text">
              <strong>Nature Grid</strong>
              <span>Environmental intelligence</span>
            </div>
          </Link>
          <button
            className="sidebar-close-btn"
            aria-label="Close navigation"
            onClick={close}
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav aria-label="App navigation">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <span className="nav-label">{section.label}</span>
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={isActive(link.href) ? 'active' : undefined}
                  onClick={close}
                >
                  {link.label}
                </Link>
              ))}
              {user.permissions?.includes('organizations.access') && (
                <Link href="/organizations" className={isActive('/organizations') ? 'active' : undefined} onClick={close}>
                  Organizations
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="sidebar-footer">
          <Link className="sidebar-user sidebar-profile-link" href="/profile" onClick={close}>
            <div className="sidebar-avatar" aria-hidden="true">
              {initials(user.displayName)}
            </div>
            <div className="sidebar-user-info">
              <strong>{user.displayName}</strong>
              <span>{ROLE_SHORT[user.role] ?? user.role}</span>
            </div>
          </Link>
          <form action={logoutAction}>
            <button className="sidebar-logout-btn" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
