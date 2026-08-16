import Link from 'next/link';
import { loginAction } from '../../lib/auth-actions';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="auth-page">
      <div className="panel auth-panel">
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
          <button className="button" type="submit" style={{ width: '100%' }}>
            Sign in
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account? <Link href="/register">Create one</Link>
        </p>
      </div>
    </main>
  );
}
