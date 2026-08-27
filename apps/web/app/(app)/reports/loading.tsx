export default function ReportsLoading() {
  return (
    <div
      style={{
        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
      aria-label="Loading reports"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Page header skeleton */}
      <div
        style={{
          height: 32,
          width: 200,
          borderRadius: 6,
          background: 'var(--surface-2)',
          animation: 'pulse 1.4s ease-in-out infinite',
        }}
      />
      {/* Report row skeletons */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 72,
            borderRadius: 8,
            background: 'var(--surface-2)',
            animation: `pulse 1.4s ease-in-out ${i * 0.06}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
