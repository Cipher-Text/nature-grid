import AppSidebar from '../../components/app-sidebar';

export default function BiodiversityPage() {
  return (
    <div className="app-shell">
      <AppSidebar active="biodiversity" />
      <main className="main">
        <div className="panel-header">
          <div>
            <h1>Biodiversity</h1>
            <p>Species, habitats, and research records.</p>
          </div>
        </div>

        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Species and occurrence records</h2>
              <p>Verified sightings tied to species and habitat data</p>
            </div>
          </div>
          <div className="empty-state">
            Species and occurrence records aren&apos;t available yet — this
            module depends on a GBIF ingestion pipeline that hasn&apos;t been
            built. Once it ships, verified occurrence data will appear here.
          </div>
        </article>
      </main>
    </div>
  );
}
