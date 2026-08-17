import AppSidebar from '../../components/app-sidebar';

export default function RestorationPage() {
  return (
    <div className="app-shell">
      <AppSidebar active="restoration" />
      <main className="main">
        <div className="panel-header">
          <div>
            <h1>Restoration</h1>
            <p>Conservation and restoration projects.</p>
          </div>
        </div>

        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Active projects</h2>
              <p>Verified restoration and conservation initiatives</p>
            </div>
          </div>
          <div className="empty-state">
            Restoration project tracking isn&apos;t available yet — no project
            model has been built. Once organizations can register projects,
            verified restoration work will appear here.
          </div>
        </article>
      </main>
    </div>
  );
}
