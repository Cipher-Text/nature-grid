import { cookies } from 'next/headers';
import { apiGet } from '../../../lib/api';
import { ADMIN_ACCESS_TOKEN_COOKIE } from '../../../lib/session-constants';
import {
  createOrganizationAction,
  upsertMembershipAction,
  updateMembershipAction,
  removeMembershipAction,
} from '../../../lib/organization-actions';

type Organization = {
  id: string;
  name: string;
  type: string;
  description: string | null;
  website: string | null;
  memberships: Array<{
    userId: string;
    role: 'ADMIN' | 'MEMBER';
    user: { id: string; displayName: string; email: string; isActive: boolean };
  }>;
};

type User = { id: string; displayName: string; email: string; isActive: boolean };

function titleCase(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string };
}) {
  const token = cookies().get(ADMIN_ACCESS_TOKEN_COOKIE)?.value ?? '';
  const [organizations, users] = await Promise.all([
    apiGet<Organization[]>('/api/v1/admin/organizations', token),
    apiGet<{ data: User[] }>('/api/v1/users?page=1&pageSize=100', token),
  ]);

  return (
    <>
      <div className="page-header">
        <h1>Organization Management</h1>
        <p>Create organizations and attach users to multiple organizations as admins or members.</p>
      </div>
      {searchParams.success && <div className="flash flash-success">Organization membership updated.</div>}
      {searchParams.error && <div className="flash flash-error">{searchParams.error}</div>}

      <section className="admin-section">
        <h2>Create organization</h2>
        <form action={createOrganizationAction} className="inline-form">
          <input name="name" className="text-input" placeholder="Organization name" required />
          <select name="type" className="role-select" defaultValue="NGO">
            {['GOVERNMENT_AGENCY', 'RESEARCH_INSTITUTION', 'NGO', 'COMMUNITY_GROUP', 'PRIVATE_COMPANY', 'INTERNATIONAL_ORG', 'OTHER'].map((type) => (
              <option key={type} value={type}>{titleCase(type)}</option>
            ))}
          </select>
          <input name="website" className="text-input" placeholder="Website (optional)" />
          <button className="btn btn-secondary" type="submit">Create</button>
        </form>
      </section>

      <div className="org-management-list">
        {organizations.map((organization) => (
          <section className="admin-section" key={organization.id}>
            <div className="section-heading-row">
              <div>
                <h2>{organization.name}</h2>
                <p>{titleCase(organization.type)} · {organization.memberships.length} members</p>
              </div>
            </div>
            <div className="member-list">
              {organization.memberships.map((membership) => (
                <div className="member-row" key={membership.userId}>
                  <div><strong>{membership.user.displayName}</strong><span>{membership.user.email}</span></div>
                  <form action={updateMembershipAction} className="inline-form">
                    <input type="hidden" name="organizationId" value={organization.id} />
                    <input type="hidden" name="userId" value={membership.userId} />
                    <select name="role" className="role-select" defaultValue={membership.role}>
                      <option value="ADMIN">Organization admin</option>
                      <option value="MEMBER">Member</option>
                    </select>
                    <button className="btn btn-secondary btn-sm" type="submit">Save</button>
                  </form>
                  <form action={removeMembershipAction}>
                    <input type="hidden" name="organizationId" value={organization.id} />
                    <input type="hidden" name="userId" value={membership.userId} />
                    <button className="btn btn-danger-outline btn-sm" type="submit">Remove</button>
                  </form>
                </div>
              ))}
            </div>
            <form action={upsertMembershipAction} className="inline-form member-add-form">
              <input type="hidden" name="organizationId" value={organization.id} />
              <select name="userId" className="role-select" required defaultValue="">
                <option value="" disabled>Attach user</option>
                {users.data.filter((user) => user.isActive).map((user) => (
                  <option key={user.id} value={user.id}>{user.displayName} · {user.email}</option>
                ))}
              </select>
              <select name="role" className="role-select" defaultValue="MEMBER">
                <option value="ADMIN">Organization admin</option>
                <option value="MEMBER">Member</option>
              </select>
              <button className="btn btn-secondary btn-sm" type="submit">Attach</button>
            </form>
          </section>
        ))}
      </div>
    </>
  );
}
