import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getCurrentUser } from '../../../lib/current-user';
import { apiGetAuthed } from '../../../lib/api';
import { ACCESS_TOKEN_COOKIE } from '../../../lib/session-constants';

type Organization = {
  id: string;
  name: string;
  type: string;
  description: string | null;
  website: string | null;
  country: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

type OrgListResponse = {
  data: Organization[];
  total: number;
  page: number;
  pageSize: number;
};

function titleCase(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams: { type?: string; page?: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const accessToken = cookies().get(ACCESS_TOKEN_COOKIE)?.value ?? '';
  const typeFilter = searchParams.type ? `&type=${searchParams.type}` : '';
  const page = searchParams.page ?? '1';
  const result = await apiGetAuthed<OrgListResponse>(
    `/api/v1/organizations?page=${page}&pageSize=20${typeFilter}`,
    accessToken,
  );

  const myOrgIds = new Set(user.organizations.map((o) => o.id));

  return (
    <div className="page-stack">
      <header className="page-heading">
        <p className="eyebrow">Directory</p>
        <h1>Organizations</h1>
        <p>{result.total} organization{result.total !== 1 ? 's' : ''} registered on the platform.</p>
      </header>

      {result.data.length === 0 ? (
        <section className="empty-state">
          <h2>No organizations found</h2>
          <p>No organizations have been registered yet.</p>
        </section>
      ) : (
        <div className="content-grid">
          {result.data.map((org) => (
            <Link href={`/organizations/${org.id}`} key={org.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <article className="content-card">
                <div className="card-kicker">{titleCase(org.type)}</div>
                <h2>{org.name}</h2>
                {org.description && <p>{org.description}</p>}
                <div className="card-meta">
                  <span>{org.country}</span>
                  {org.isVerified && <span style={{ color: '#16a34a' }}>Verified</span>}
                  {myOrgIds.has(org.id) && <span style={{ fontWeight: 600 }}>Member</span>}
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {result.total > result.pageSize && (
        <nav className="pagination" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          {result.page > 1 && (
            <Link href={`/organizations?page=${result.page - 1}${typeFilter}`} className="text-link">Previous</Link>
          )}
          <span>Page {result.page} of {Math.ceil(result.total / result.pageSize)}</span>
          {result.page * result.pageSize < result.total && (
            <Link href={`/organizations?page=${result.page + 1}${typeFilter}`} className="text-link">Next</Link>
          )}
        </nav>
      )}
    </div>
  );
}
