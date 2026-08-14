const featureAreas = [
  'Environmental data hub',
  'Citizen reports',
  'Biodiversity observations',
  'Disaster and environmental alerts',
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Nature Grid</p>
        <h1>Environmental intelligence for Bangladesh and beyond.</h1>
        <p>
          A public platform for locations, datasets, observations, reports, alerts,
          and GIS-backed environmental action.
        </p>
      </section>

      <section className="feature-grid" aria-label="Initial feature areas">
        {featureAreas.map((feature) => (
          <article key={feature}>
            <h2>{feature}</h2>
            <p>Implementation starts from the shared contracts and API modules.</p>
          </article>
        ))}
      </section>
    </main>
  );
}

