'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminNavProps {
  canManageOrganizations: boolean;
}

export default function AdminNav({ canManageOrganizations }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav className="sidebar-nav">
      <Link
        href="/reports"
        className={`nav-link${pathname.startsWith('/reports') ? ' active' : ''}`}
      >
        Reports
      </Link>
      <Link
        href="/alerts"
        className={`nav-link${pathname.startsWith('/alerts') ? ' active' : ''}`}
      >
        Alerts
      </Link>
      <Link
        href="/ingestion"
        className={`nav-link${pathname.startsWith('/ingestion') ? ' active' : ''}`}
      >
        Ingestion
      </Link>
      {canManageOrganizations && (
        <>
          <Link
            href="/permissions"
            className={`nav-link${pathname.startsWith('/permissions') ? ' active' : ''}`}
          >
            Permissions
          </Link>
          <Link
            href="/datasets"
            className={`nav-link${pathname.startsWith('/datasets') ? ' active' : ''}`}
          >
            Datasets
          </Link>
          <Link
            href="/users"
            className={`nav-link${pathname.startsWith('/users') ? ' active' : ''}`}
          >
            Users
          </Link>
          <Link
            href="/organizations"
            className={`nav-link${pathname.startsWith('/organizations') ? ' active' : ''}`}
          >
            Organizations
          </Link>
        </>
      )}
    </nav>
  );
}
