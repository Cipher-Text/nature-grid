import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiGet } from '../../lib/api';
import { ADMIN_ACCESS_TOKEN_COOKIE } from '../../lib/session-constants';
import { logoutAction } from '../../lib/auth-actions';
import AdminNav from '../../components/admin-nav';

interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const accessToken = cookies().get(ADMIN_ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) redirect('/login');

  let user: AdminUser;
  try {
    user = await apiGet<AdminUser>('/api/v1/auth/profile', accessToken);
    if (!['MODERATOR', 'ADMIN'].includes(user.role)) redirect('/login');
  } catch {
    redirect('/login');
  }

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <p className="brand">Nature Grid</p>
          <h2>Admin Console</h2>
        </div>

        <AdminNav isAdmin={user.role === 'ADMIN'} />

        <div className="sidebar-footer">
          <p className="user-info">
            <strong>{user.displayName}</strong>
            {user.role}
          </p>
          <form action={logoutAction}>
            <button type="submit" className="btn-logout">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="main-content">{children}</div>
    </div>
  );
}
