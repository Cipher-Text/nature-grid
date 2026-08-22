import { loginAction } from '../../lib/auth-actions';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
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
      </div>
    </main>
  );
}
