import { cookies } from 'next/headers';
import Link from 'next/link';
import { apiGet } from '../../../lib/api';
import { ADMIN_ACCESS_TOKEN_COOKIE } from '../../../lib/session-constants';
import { updateRoleAction, deactivateUserAction } from '../../../lib/user-actions';

const PAGE_SIZE = 20;

type UserRole =
  | 'CITIZEN'
  | 'RESEARCHER'
  | 'ORGANIZATION_ADMIN'
  | 'GOVERNMENT'
  | 'MODERATOR'
  | 'ADMIN';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

interface PaginatedResponse {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
}

// Roles that can be assigned via the API (ADMIN is intentionally excluded).
const ASSIGNABLE_ROLES: UserRole[] = [
  'CITIZEN',
  'RESEARCHER',
  'ORGANIZATION_ADMIN',
  'GOVERNMENT',
  'MODERATOR',
];

const ROLE_BADGE: Record<UserRole, string> = {
  ADMIN: 'role-admin',
  MODERATOR: 'role-moderator',
  GOVERNMENT: 'role-government',
  ORGANIZATION_ADMIN: 'role-org-admin',
  RESEARCHER: 'role-researcher',
  CITIZEN: 'role-citizen',
};

function titleCase(str: string) {
  return str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function relativeTime(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diffMs / 3_600_000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

/** Decode JWT payload without signature verification — used only to read the sub claim. */
function decodeJwtSub(token: string): string | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64)) as { sub?: string };
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { page?: string; success?: string; error?: string };
}) {
  const accessToken = cookies().get(ADMIN_ACCESS_TOKEN_COOKIE)?.value ?? '';
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const currentUserId = decodeJwtSub(accessToken);

  const result = await apiGet<PaginatedResponse>(
    `/api/v1/users?page=${page}&pageSize=${PAGE_SIZE}`,
    accessToken,
  );

  const totalPages = Math.ceil(result.total / PAGE_SIZE);
  const activeCount = result.data.filter((u) => u.isActive).length;

  return (
    <>
      <div className="page-header">
        <h1>User Management</h1>
        <p>
          {result.total} total users &mdash; {activeCount} active on this page
        </p>
      </div>

      {searchParams.success === 'role' && (
        <div className="flash flash-success">Role updated successfully.</div>
      )}
      {searchParams.success === 'deactivated' && (
        <div className="flash flash-success">User deactivated.</div>
      )}
      {searchParams.error && (
        <div className="flash flash-error">{searchParams.error}</div>
      )}

      <div className="table-wrapper">
        {result.data.length === 0 ? (
          <div className="empty-state">No users found.</div>
        ) : (
          result.data.map((user) => {
            const isSelf = user.id === currentUserId;
            const canChangeRole = user.role !== 'ADMIN';
            const canDeactivate = user.isActive && !isSelf;

            return (
              <div key={user.id} className={`user-row${!user.isActive ? ' user-inactive' : ''}`}>
                <div className="user-row-main">
                  <div className="user-identity">
                    <div className="user-name-row">
                      <span className={`role-badge ${ROLE_BADGE[user.role]}`}>
                        {titleCase(user.role)}
                      </span>
                      <span className="user-name">{user.displayName}</span>
                      {isSelf && <span className="self-label">you</span>}
                      {!user.isActive && <span className="inactive-label">inactive</span>}
                    </div>
                    <div className="user-email">{user.email}</div>
                    <div className="user-meta">
                      Joined {formatDate(user.createdAt)}
                      {' · '}
                      {user.lastLoginAt
                        ? `Last login ${relativeTime(user.lastLoginAt)}`
                        : 'Never logged in'}
                    </div>
                  </div>

                  <div className="user-actions">
                    {canChangeRole ? (
                      <form action={updateRoleAction} className="role-form">
                        <input type="hidden" name="id" value={user.id} />
                        <input type="hidden" name="returnPage" value={String(page)} />
                        <select name="role" className="role-select" defaultValue={user.role}>
                          {ASSIGNABLE_ROLES.map((r) => (
                            <option key={r} value={r}>
                              {titleCase(r)}
                            </option>
                          ))}
                        </select>
                        <button type="submit" className="btn btn-secondary btn-sm">
                          Update role
                        </button>
                      </form>
                    ) : (
                      <p className="role-fixed-note">Admin role cannot be changed via console.</p>
                    )}

                    {canDeactivate && (
                      <details className="deactivate-details">
                        <summary className="btn btn-danger-outline btn-sm">Deactivate</summary>
                        <div className="deactivate-confirm">
                          <p>
                            Deactivate <strong>{user.displayName}</strong>? They will not be able
                            to log in until manually reactivated via the database.
                          </p>
                          <form action={deactivateUserAction}>
                            <input type="hidden" name="id" value={user.id} />
                            <input type="hidden" name="returnPage" value={String(page)} />
                            <button type="submit" className="btn btn-danger btn-sm">
                              Confirm deactivate
                            </button>
                          </form>
                        </div>
                      </details>
                    )}

                    {!user.isActive && (
                      <p className="inactive-note">
                        Account inactive &mdash; reactivation requires direct DB access.
                      </p>
                    )}

                    {isSelf && user.isActive && (
                      <p className="self-note">Cannot deactivate your own account.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {page > 1 && (
            <Link href={`/users?page=${page - 1}`} className="btn btn-ghost">
              Previous
            </Link>
          )}
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/users?page=${page + 1}`} className="btn btn-ghost">
              Next
            </Link>
          )}
        </div>
      )}
    </>
  );
}
