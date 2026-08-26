import Link from 'next/link';
import { loginAction } from '../../../lib/auth-actions';

const SEED_PASSWORD = 'NatureGrid123!';
const SEED_USERS = [
  { email: 'citizen@naturegrid.bd', label: 'Citizen' },
  { email: 'researcher@naturegrid.bd', label: 'Researcher' },
  { email: 'organization.admin@naturegrid.bd', label: 'Organization Admin' },
  { email: 'government@naturegrid.bd', label: 'Government' },
  { email: 'moderator@naturegrid.bd', label: 'Moderator' },
  { email: 'admin@naturegrid.bd', label: 'Admin' },
];

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const showSeedLogin = process.env.NEXT_PUBLIC_ENABLE_SEED_LOGIN === 'true';

  return (
    <main className="auth-page">
      <div className="auth-panel">
        <div className="auth-brand">
          <div className="brand-mark">NG</div>
          <span>Nature Grid</span>
        </div>

        <div className="panel auth-panel-card">
          <div className="panel-header">
            <div>
              <h2>Sign in</h2>
              <p>Access your Nature Grid account</p>
            </div>
          </div>

          {searchParams.error && <p className="form-error">{searchParams.error}</p>}

          <form action={loginAction} className="auth-form">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                minLength={8}
              />
            </div>
            <button className="button button-full" type="submit">
              Sign in
            </button>
          </form>

          {showSeedLogin && (
            <section className="seed-login">
              <p className="seed-login-title">Seed accounts</p>
              <div className="seed-login-grid">
                {SEED_USERS.map((user) => (
                  <form key={user.email} action={loginAction}>
                    <input type="hidden" name="email" value={user.email} />
                    <input type="hidden" name="password" value={SEED_PASSWORD} />
                    <button className="seed-login-button" type="submit">
                      <span>{user.label}</span>
                      <small>{user.email}</small>
                    </button>
                  </form>
                ))}
              </div>
            </section>
          )}

          <p className="auth-switch">
            Don&apos;t have an account? <Link href="/register">Create one</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
