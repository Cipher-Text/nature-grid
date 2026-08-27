export default function BiodiversityLoading() {
  return (
    <div
      style={{
        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
      aria-label="Loading biodiversity data"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Page header skeleton */}
      <div
        style={{
          height: 32,
          width: 260,
          borderRadius: 6,
          background: 'var(--surface-2)',
          animation: 'pulse 1.4s ease-in-out infinite',
        }}
      />
      {/* Card grid skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 180,
              borderRadius: 10,
              background: 'var(--surface-2)',
              animation: `pulse 1.4s ease-in-out ${i * 0.05}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
