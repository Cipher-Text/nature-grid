import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { apiGet, apiGetAuthed } from '../../../../lib/api';
import { getCurrentUser } from '../../../../lib/current-user';
import {
  addPostCommentAction,
  castVoteAction,
  deletePostAction,
  deleteCommentAction,
} from '../../../../lib/community-actions';
import { routes, type CommunityPostDetail } from '@nature-grid/contracts';
import { relativeTime } from '../../../../lib/format';
import { ACCESS_TOKEN_COOKIE } from '../../../../lib/session-constants';

export default async function CommunityPostDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    created?: string;
    commented?: string;
    voted?: string;
    commentDeleted?: string;
    error?: string;
  };
}) {
  const accessToken = cookies().get(ACCESS_TOKEN_COOKIE)?.value;
  const [post, user] = await Promise.all([
    accessToken
      ? apiGetAuthed<CommunityPostDetail>(routes.community.post(params.id), accessToken).catch(
          () => null,
        )
      : apiGet<CommunityPostDetail>(routes.community.post(params.id), 0).catch(() => null),
    getCurrentUser(),
  ]);

  if (!post) notFound();

  const canDeletePost =
    user && (user.id === post.author.id || user.role === 'ADMIN' || user.role === 'MODERATOR');

  return (
    <>
      <Link className="back-link" href="/community">
        ← Community
      </Link>

      <div className="post-detail-header">
        <h1>{post.title}</h1>
        <div className="post-detail-meta">
          <span>By {post.author.displayName}</span>
          {post.district && <span>{post.district.name}</span>}
          <span>{relativeTime(post.createdAt)}</span>
        </div>
      </div>

      {searchParams.error && (
        <p className="form-error">{decodeURIComponent(searchParams.error)}</p>
      )}

      {/* Post body */}
      <article className="panel">
        <p style={{ whiteSpace: 'pre-wrap' }}>{post.body}</p>
        {canDeletePost && (
          <form action={deletePostAction.bind(null, post.id)} style={{ marginTop: 12 }}>
            <button className="button danger" type="submit">
              Delete post
            </button>
          </form>
        )}
      </article>

      {/* Poll */}
      {post.poll && (() => {
        const poll = post.poll!;
        const isClosed = !!poll.endsAt && new Date() > new Date(poll.endsAt);
        const hasVoted = !!poll.userVotedOptionId;
        const showResults = hasVoted || isClosed || !user;
        const totalVotes = poll.options.reduce((s, o) => s + o._count.votes, 0);

        return (
          <article className="panel">
            <h2>Poll</h2>
            <p><strong>{poll.question}</strong></p>
            {poll.endsAt && (
              <p className="muted-text">
                {isClosed ? 'Poll closed' : `Closes ${relativeTime(poll.endsAt)}`}
              </p>
            )}

            {searchParams.voted && <p className="form-success">Vote recorded.</p>}

            {showResults ? (
              /* ── Results view ── */
              <div className="poll-results">
                {poll.options.map((opt) => {
                  const pct = totalVotes > 0 ? Math.round((opt._count.votes / totalVotes) * 100) : 0;
                  const isMyVote = poll.userVotedOptionId === opt.id;
                  return (
                    <div key={opt.id} className="poll-option-result">
                      <div className="poll-option-label">
                        <span>{isMyVote ? <strong>{opt.text}</strong> : opt.text}</span>
                        {isMyVote && <span className="poll-your-vote">Your vote</span>}
                        <span className="poll-pct">{pct}% ({opt._count.votes})</span>
                      </div>
                      <div className="poll-bar-track">
                        <div className="poll-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                <p className="muted-text" style={{ marginTop: 12, marginBottom: 0 }}>
                  {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
                </p>
                {hasVoted && !isClosed && user && (
                  /* Allow changing vote */
                  <form action={castVoteAction.bind(null, post.id)} className="poll-change-vote">
                    <fieldset className="poll-radio-group">
                      <legend className="poll-radio-legend">Change your vote</legend>
                      {poll.options.map((opt) => (
                        <label key={opt.id} className="poll-radio-label">
                          <input
                            type="radio"
                            name="optionId"
                            value={opt.id}
                            defaultChecked={poll.userVotedOptionId === opt.id}
                          />
                          {opt.text}
                        </label>
                      ))}
                    </fieldset>
                    <button className="button" type="submit">Change vote</button>
                  </form>
                )}
              </div>
            ) : (
              /* ── Voting view (authenticated, not yet voted, poll open) ── */
              <form action={castVoteAction.bind(null, post.id)} className="poll-vote-form">
                <fieldset className="poll-radio-group">
                  <legend className="poll-radio-legend">Select an option</legend>
                  {poll.options.map((opt) => (
                    <label key={opt.id} className="poll-radio-label">
                      <input type="radio" name="optionId" value={opt.id} required />
                      {opt.text}
                    </label>
                  ))}
                </fieldset>
                <button className="button" type="submit">Vote</button>
              </form>
            )}

            {!user && !isClosed && (
              <p className="access-note" style={{ marginTop: 12 }}>
                <a href="/login">Sign in</a> to vote.
              </p>
            )}
          </article>
        );
      })()}

      {/* Comments */}
      <article className="panel">
        <h2>
          Comments
          {post.comments.length > 0 && ` (${post.comments.length})`}
        </h2>

        {searchParams.commented && <p className="form-success">Comment posted.</p>}
        {searchParams.commentDeleted && <p className="form-success">Comment deleted.</p>}

        {post.comments.length === 0 ? (
          <p className="muted-text">No comments yet.</p>
        ) : (
          <div className="comment-list">
            {post.comments.map((c) => {
              const canDeleteComment =
                user &&
                (user.id === c.author.id ||
                  user.role === 'ADMIN' ||
                  user.role === 'MODERATOR');
              return (
                <div key={c.id} className="comment-row">
                  <div className="comment-header">
                    <strong>{c.author.displayName}</strong>
                    <span className="comment-time muted-text">{relativeTime(c.createdAt)}</span>
                    {canDeleteComment && (
                      <form
                        action={deleteCommentAction.bind(null, post.id, c.id)}
                        style={{ display: 'inline', marginLeft: 8 }}
                      >
                        <button className="button danger small" type="submit">
                          Delete
                        </button>
                      </form>
                    )}
                  </div>
                  <p className="comment-body">{c.body}</p>
                </div>
              );
            })}
          </div>
        )}

        {user && (
          <div className="comment-form" style={{ marginTop: 16 }}>
            <form action={addPostCommentAction.bind(null, post.id)} className="submit-form">
              <div className="field">
                <label htmlFor="body">Add a comment</label>
                <textarea
                  id="body"
                  name="body"
                  required
                  minLength={1}
                  maxLength={5000}
                  rows={3}
                  placeholder="Share your thoughts…"
                />
              </div>
              <button className="button" type="submit">
                Post comment
              </button>
            </form>
          </div>
        )}

        {!user && (
          <p className="access-note" style={{ marginTop: 12 }}>
            <Link href="/login">Sign in</Link> to join the discussion.
          </p>
        )}
      </article>
    </>
  );
}
