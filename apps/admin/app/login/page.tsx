import { loginAction } from '../../lib/auth-actions';

const SEED_PASSWORD = 'NatureGrid123!';
const ADMIN_SEED_USERS = [
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
    <main className="login-page">
      <div className="login-card">
        <header>
          <p className="brand">Nature Grid</p>
          <h1>Admin Console</h1>
          <p className="subtitle">Sign in with a Moderator or Admin account to continue.</p>
        </header>

        {searchParams.error && (
          <p className="form-error">{searchParams.error}</p>
        )}

        <form action={loginAction} className="form">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@example.com"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Sign in
          </button>
        </form>

        {showSeedLogin && (
          <section className="seed-login">
            <p className="seed-login-title">Seed accounts</p>
            <div className="seed-login-grid">
              {ADMIN_SEED_USERS.map((user) => (
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
      </div>
    </main>
  );
}
