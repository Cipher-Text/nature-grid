import Link from 'next/link';

export interface Crumb {
  label: string;
  href?: string;
}

export default function LocationBreadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="location-breadcrumb" aria-label="Location hierarchy">
      {crumbs.map((crumb, i) => (
        <span key={i}>
          {i > 0 && (
            <span className="crumb-sep" aria-hidden="true">›</span>
          )}
          {crumb.href ? (
            <Link href={crumb.href}>{crumb.label}</Link>
          ) : (
            <span>{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
