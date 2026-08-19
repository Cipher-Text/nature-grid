import Link from 'next/link';

export default function CommunitySection() {
  return (
    <section className="panel public-section" aria-label="Community activity">
      <div className="panel-header">
        <div>
          <h2>Community</h2>
          <p>
            Campaigns, education, and environmental action open to everyone.
          </p>
        </div>
        <Link className="button ghost" href="/community">
          All community content
        </Link>
      </div>

      <div className="empty-state">
        Community content isn&apos;t a built module yet — there&apos;s no
        campaign, challenge, or feed backend behind this section.
      </div>
    </section>
  );
}
