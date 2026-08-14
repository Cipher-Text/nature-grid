const adminAreas = [
  'Report moderation',
  'Dataset operations',
  'Alert management',
  'Organization review',
];

export default function AdminHomePage() {
  return (
    <main className="admin-shell">
      <header>
        <p>Nature Grid Admin</p>
        <h1>Operations console</h1>
      </header>
      <section>
        {adminAreas.map((area) => (
          <article key={area}>
            <h2>{area}</h2>
            <p>Workflow implementation will connect through shared API contracts.</p>
          </article>
        ))}
      </section>
    </main>
  );
}

