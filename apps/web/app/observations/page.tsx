import Link from 'next/link';
import AppSidebar from '../../components/app-sidebar';

export default function ObservationsPage() {
  return (
    <div className="app-shell">
      <AppSidebar active="observations" />
      <main className="main">
        <div className="panel-header">
          <div>
            <h1>Observations</h1>
            <p>Environmental observations from citizens and researchers.</p>
          </div>
        </div>

        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Observation records</h2>
              <p>Sightings, water/air readings, and habitat notes with trust-level review</p>
            </div>
          </div>
          <div className="empty-state">
            Observations aren&apos;t available yet — this module (citizen and
            researcher sightings with trust-level review) hasn&apos;t been built.
            Once it ships, verified sightings will appear here.
          </div>
        </article>

        <div className="info-banner" style={{ marginTop: '20px' }}>
          In the meantime, you can{' '}
          <Link className="text-link" href="/reports">
            file a citizen report
          </Link>
          .
        </div>
      </main>
    </div>
  );
}
