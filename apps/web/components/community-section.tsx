import Link from 'next/link';
import { COMMUNITY_FEED } from '../lib/static-data';

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

      <div className="public-grid">
        {/* Feed: left column (first two items) */}
        <div className="feed-list">
          {COMMUNITY_FEED.slice(0, 2).map((item) => (
            <FeedItem key={item.title} {...item} />
          ))}
        </div>

        {/* Feed: right column (last two items) */}
        <div className="feed-list">
          {COMMUNITY_FEED.slice(2).map((item) => (
            <FeedItem key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeedItem({
  initials,
  title,
  meta,
}: {
  initials: string;
  title: string;
  meta: string;
}) {
  return (
    <div className="feed-item">
      <div className="feed-avatar" aria-hidden="true">
        {initials}
      </div>
      <div className="feed-body">
        <strong>{title}</strong>
        <span>{meta}</span>
      </div>
    </div>
  );
}
