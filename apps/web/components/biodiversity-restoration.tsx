import Link from 'next/link';
import { RESTORATION_PROJECTS } from '../lib/static-data';

export default function BiodiversityRestoration() {
  return (
    <section
      className="public-grid public-section"
      aria-label="Biodiversity and restoration"
    >
      {/* ── Biodiversity ── */}
      <article className="panel">
        <div className="panel-header">
          <div>
            <h2>Biodiversity highlights</h2>
            <p>Research-grade observations and habitat signals.</p>
          </div>
          <Link className="button ghost" href="/biodiversity">
            Explore
          </Link>
        </div>

        <div
          className="species-image mangrove"
          role="img"
          aria-label="Sundarbans mangrove habitat illustration"
          style={{ height: '120px', marginBottom: '14px' }}
        />

        <p className="muted-copy">
          Mangrove records, Sundarbans wetland sightings, and freshwater species
          signals across 38 indexed districts.
        </p>

        <div className="button-row" style={{ marginTop: '14px' }}>
          <Link className="button ghost" href="/biodiversity">
            Species records
          </Link>
          <Link className="button ghost" href="/observations">
            All observations
          </Link>
        </div>
      </article>

      {/* ── Restoration and community ── */}
      <article className="panel">
        <div className="panel-header">
          <div>
            <h2>Restoration and community</h2>
            <p>Projects and campaigns show action, not only problems.</p>
          </div>
          <Link className="button ghost" href="/restoration">
            View projects
          </Link>
        </div>

        <div className="record-list">
          {RESTORATION_PROJECTS.map((p) => (
            <div key={p.title} className="record-item">
              <strong>{p.title}</strong>
              <span>{p.meta}</span>
            </div>
          ))}
        </div>

        <Link className="button ghost gated-action" href="/profile">
          Sign in to participate
        </Link>
      </article>
    </section>
  );
}
