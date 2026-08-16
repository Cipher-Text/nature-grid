import Link from 'next/link';
import { registerAction } from '../../../lib/auth-actions';

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="auth-page">
      <div className="panel auth-panel">
        <div className="panel-header">
          <div>
            <h2>Create a free account</h2>
            <p>Submit reports, log observations, and track your impact</p>
          </div>
        </div>

        {searchParams.error && <p className="form-error">{searchParams.error}</p>}

        <form action={registerAction} className="auth-form">
          <div className="field">
            <label htmlFor="displayName">Display name</label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              required
              autoComplete="name"
              minLength={2}
              maxLength={60}
            />
          </div>
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
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
            />
          </div>
          <button className="button" type="submit" style={{ width: '100%' }}>
            Create account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
