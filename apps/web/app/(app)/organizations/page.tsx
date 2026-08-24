import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '../../../lib/current-user';

function titleCase(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

export default async function OrganizationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="page-stack">
      <header className="page-heading">
        <p className="eyebrow">Your workspace</p>
        <h1>Organizations</h1>
        <p>Organizations you are attached to and your membership level.</p>
      </header>

      {user.organizations.length === 0 ? (
        <section className="empty-state">
          <h2>No organization membership</h2>
          <p>A platform administrator can attach your account to an organization.</p>
        </section>
      ) : (
        <div className="content-grid">
          {user.organizations.map((organization) => (
            <article className="content-card" key={organization.id}>
              <div className="card-kicker">{titleCase(organization.type)}</div>
              <h2>{organization.name}</h2>
              <p>{organization.isVerified ? 'Verified organization' : 'Organization verification pending'}</p>
              <div className="card-meta">
                <span>{organization.membershipRole === 'ADMIN' ? 'Organization admin' : 'Member'}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      <Link href="/restoration" className="text-link">View restoration projects</Link>
    </div>
  );
}
