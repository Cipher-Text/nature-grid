'use client';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '2rem',
        minHeight: '50vh',
        textAlign: 'center',
      }}
    >
      <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
        Something went wrong loading this page.
      </p>
      {error.digest && (
        <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
          Reference: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        style={{
          padding: '0.5rem 1.25rem',
          background: 'var(--primary)',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
      >
        Try again
      </button>
    </div>
  );
}
