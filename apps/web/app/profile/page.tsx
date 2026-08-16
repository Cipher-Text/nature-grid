import { redirect } from 'next/navigation';
import { getCurrentUser } from '../../lib/current-user';
import { logoutAction } from '../../lib/auth-actions';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <main className="auth-page">
      <div className="panel auth-panel">
        <div className="panel-header">
          <div>
            <h2>Your profile</h2>
            <p>Account details</p>
          </div>
        </div>

        <div className="condition-list">
          <div className="condition-row">
            <span>Name</span>
            <strong>{user.displayName}</strong>
          </div>
          <div className="condition-row">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>
          <div className="condition-row">
            <span>Role</span>
            <strong>{user.role}</strong>
          </div>
          <div className="condition-row">
            <span>Member since</span>
            <strong>{new Date(user.createdAt).toLocaleDateString()}</strong>
          </div>
        </div>

        <form action={logoutAction} style={{ marginTop: '16px' }}>
          <button className="button ghost" type="submit" style={{ width: '100%' }}>
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
