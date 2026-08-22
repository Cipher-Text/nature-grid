'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminNavProps {
  isAdmin: boolean;
}

export default function AdminNav({ isAdmin }: AdminNavProps) {
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
      {isAdmin && (
        <>
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
        </>
      )}
    </nav>
  );
}
