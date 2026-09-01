import Link from 'next/link';
import { apiGet } from '../../../lib/api';
import { getCurrentUser } from '../../../lib/current-user';
import { createPostAction } from '../../../lib/community-actions';
import { routes, type CommunityPostSummary, type PaginatedEnvelope } from '@nature-grid/contracts';
import { relativeTime } from '../../../lib/format';
import DistrictSelect, { type DistrictWithDivision } from '../../../components/district-select';

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: { districtId?: string; created?: string; deleted?: string; error?: string };
}) {
  const districtId = searchParams.districtId;
  const postsPath = districtId
    ? `${routes.community.posts}?districtId=${districtId}`
    : routes.community.posts;

  const [postsRes, user] = await Promise.all([
    apiGet<PaginatedEnvelope<CommunityPostSummary>>(postsPath, 0).catch(
      (): PaginatedEnvelope<CommunityPostSummary> => ({ data: [], total: 0, page: 1, pageSize: 20 }),
    ),
    getCurrentUser(),
  ]);

  const districts: DistrictWithDivision[] = user
    ? await apiGet<DistrictWithDivision[]>(routes.locations.districts).catch(() => [])
    : [];

  return (
    <>
      <div className="panel-header">
        <div>
          <h1>Community</h1>
          <p>Posts, discussions, and polls from contributors across Bangladesh.</p>
        </div>
      </div>

      {searchParams.created && <p className="form-success">Post created.</p>}
      {searchParams.deleted && <p className="form-success">Post deleted.</p>}
      {searchParams.error && <p className="form-error">{decodeURIComponent(searchParams.error)}</p>}

      <div className="table" role="table" aria-label="Community posts">
        <div className="table-row table-head" role="row">
          <span>Post</span>
          <span>Author</span>
          <span>District</span>
          <span>Activity</span>
          <span>Posted</span>
        </div>
        {postsRes.data.map((p) => (
          <Link
            key={p.id}
            className="table-row table-row-link"
            role="row"
            href={`/community/${p.id}`}
          >
            <strong>
              {p.title}
              {p.poll && (
                <span className="tag muted" style={{ marginLeft: 6 }}>
                  Poll
                </span>
              )}
            </strong>
            <span>{p.author.displayName}</span>
            <span>{p.district?.name ?? '—'}</span>
            <span>
              {p._count.comments} comment{p._count.comments !== 1 ? 's' : ''}
            </span>
            <span>{relativeTime(p.createdAt)}</span>
          </Link>
        ))}
        {postsRes.data.length === 0 && (
          <div className="empty-state">No posts yet. Be the first to post!</div>
        )}
      </div>

      {user ? (
        <article className="panel">
          <div className="panel-header">
            <div>
              <h2>Create a post</h2>
              <p>Share an update, observation, or question with the community.</p>
            </div>
          </div>

          <form action={createPostAction} className="submit-form">
            <div className="field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                minLength={3}
                maxLength={300}
                placeholder="e.g. New mangrove planting near Sundarbans"
              />
            </div>
            <div className="field">
              <label htmlFor="body">Body</label>
              <textarea
                id="body"
                name="body"
                required
                minLength={10}
                maxLength={10000}
                rows={4}
                placeholder="Share details, links, or observations…"
              />
            </div>
            <div className="field">
              <label htmlFor="districtId">District (optional)</label>
              <DistrictSelect districts={districts} />
            </div>

            <fieldset
              style={{
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '12px 16px',
                marginTop: 8,
              }}
            >
              <legend style={{ padding: '0 6px', fontSize: '0.875rem', fontWeight: 600 }}>
                Poll (optional)
              </legend>
              <div className="field">
                <label htmlFor="pollQuestion">Poll question</label>
                <input
                  id="pollQuestion"
                  name="pollQuestion"
                  type="text"
                  maxLength={500}
                  placeholder="e.g. How often do you observe plastic waste near waterways?"
                />
              </div>
              {[0, 1, 2, 3].map((i) => (
                <div className="field" key={i}>
                  <label htmlFor={`pollOption${i}`}>
                    Option {i + 1}
                    {i < 2 ? ' *' : ' (optional)'}
                  </label>
                  <input
                    id={`pollOption${i}`}
                    name={`pollOption${i}`}
                    type="text"
                    maxLength={200}
                    placeholder={`Option ${i + 1}`}
                  />
                </div>
              ))}
            </fieldset>

            <button className="button" type="submit">
              Create post
            </button>
          </form>
        </article>
      ) : (
        <p className="access-note" style={{ marginTop: 16 }}>
          <Link href="/login">Sign in</Link> to create posts and join the discussion.
        </p>
      )}
    </>
  );
}
