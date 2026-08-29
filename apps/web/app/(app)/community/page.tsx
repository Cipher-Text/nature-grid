export default function CommunityPage() {
  return (
    <>
      <div className="panel-header">
        <div>
          <h1>Community</h1>
          <p>Campaigns, learning, and environmental action.</p>
        </div>
      </div>

      <article className="panel">
        <div className="panel-header">
          <div>
            <h2>Community feed</h2>
            <p>Campaigns, challenges, and activity from contributors and organizations</p>
          </div>
        </div>
        <div className="empty-state">
          Community posts, comments, and polls are coming. This page will be
          replaced with a real feed once the <code>community</code> module
          ships.
        </div>
      </article>
    </>
  );
}
