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
          Community content isn&apos;t a built module yet — there&apos;s no
          campaign, challenge, or feed backend behind this page. It&apos;ll
          be built once a real content workflow exists.
        </div>
      </article>
    </>
  );
}
