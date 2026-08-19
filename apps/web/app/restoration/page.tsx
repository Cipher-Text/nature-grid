import Link from 'next/link';
import AppSidebar from '../../components/app-sidebar';
import { apiGet } from '../../lib/api';
import { getCurrentUser } from '../../lib/current-user';
import { createRestorationProjectAction, joinRestorationProjectAction } from '../../lib/restoration-actions';
import { routes, type RestorationProject, type PaginatedEnvelope } from '@nature-grid/contracts';
import { titleCase, relativeTime } from '../../lib/format';

const CATEGORIES = [
  'TREE_PLANTING',
  'WETLAND_RESTORATION',
  'RIVERBANK_PROTECTION',
  'MANGROVE',
  'WASTE_MANAGEMENT',
  'OTHER',
] as const;

const STATUS_VARIANT: Record<string, string> = {
  ACTIVE: 'success',
  COMPLETED: 'success',
  PLANNED: 'info',
  PAUSED: 'muted',
};

const CREATOR_ROLES = new Set(['ORGANIZATION_ADMIN', 'ADMIN']);

interface DistrictOption {
  id: string;
  name: string;
}

interface OrganizationOption {
  id: string;
  name: string;
}

export default async function RestorationPage({
  searchParams,
}: {
  searchParams: { category?: string; created?: string; joined?: string; error?: string };
}) {
  const category = searchParams.category;
  const projectsPath = category
    ? `${routes.restoration.projects}?category=${category}`
    : routes.restoration.projects;

  const [projectsRes, user] = await Promise.all([
    apiGet<PaginatedEnvelope<RestorationProject>>(projectsPath),
    getCurrentUser(),
  ]);

  const canCreate = user !== null && CREATOR_ROLES.has(user.role);

  const [districts, organizations] = canCreate
    ? await Promise.all([
        apiGet<DistrictOption[]>(routes.locations.districts),
        apiGet<PaginatedEnvelope<OrganizationOption>>(`${routes.organizations.list}?pageSize=100`).then(
          (res) => res.data,
        ),
      ])
    : [[], []];

  return (
    <div className="app-shell">
      <AppSidebar active="restoration" />
      <main className="main">
        <div className="panel-header">
          <div>
            <h1>Restoration</h1>
            <p>Conservation and restoration projects.</p>
          </div>
          {!user && (
            <Link className="button ghost" href="/login">
              Sign in to join
            </Link>
          )}
        </div>

        {searchParams.joined && <p className="form-success">You&apos;ve joined the project.</p>}
        {searchParams.created && <p className="form-success">Project created.</p>}
        {searchParams.error && <p className="form-error">{searchParams.error}</p>}

        <div className="toolbar" aria-label="Category filter">
          <Link className={`chip${!category ? ' active' : ''}`} href="/restoration">
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              className={`chip${category === c ? ' active' : ''}`}
              href={`/restoration?category=${c}`}
            >
              {titleCase(c)}
            </Link>
          ))}
        </div>

        <div className="table" role="table" aria-label="Restoration projects">
          <div className="table-row table-head" role="row">
            <span>Project</span>
            <span>Organization / Location</span>
            <span>Status</span>
            <span>Participants</span>
          </div>
          {projectsRes.data.map((p) => (
            <div className="table-row" role="row" key={p.id}>
              <strong>{p.title}</strong>
              <span>
                {p.organization?.name ?? '—'}
                {p.district?.name ? ` · ${p.district.name}` : ''}
              </span>
              <span className={`tag ${STATUS_VARIANT[p.status] ?? 'muted'}`}>{titleCase(p.status)}</span>
              <span>
                {p._count.participants}
                {user && !canCreate && (
                  <form action={joinRestorationProjectAction} style={{ display: 'inline', marginLeft: '8px' }}>
                    <input type="hidden" name="projectId" value={p.id} />
                    <button className="button ghost" type="submit">
                      Join
                    </button>
                  </form>
                )}
              </span>
            </div>
          ))}
          {projectsRes.data.length === 0 && (
            <div className="empty-state">No restoration projects match this category yet.</div>
          )}
        </div>

        {canCreate && (
          <article className="panel" style={{ marginTop: '20px' }}>
            <div className="panel-header">
              <div>
                <h2>Register a restoration project</h2>
                <p>Visible to the public immediately — no moderation queue yet.</p>
              </div>
            </div>
            <form action={createRestorationProjectAction} className="auth-form">
              <div className="field">
                <label htmlFor="title">Title</label>
                <input id="title" name="title" type="text" required minLength={5} maxLength={200}
                  placeholder="e.g. Sundarbans mangrove buffer restoration" />
              </div>
              <div className="field">
                <label htmlFor="category">Category</label>
                <select id="category" name="category" className="select-field" required>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{titleCase(c)}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="organizationId">Organization (optional)</label>
                <select id="organizationId" name="organizationId" className="select-field">
                  <option value="">Not specified</option>
                  {organizations.map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="districtId">District (optional)</label>
                <select id="districtId" name="districtId" className="select-field">
                  <option value="">Not specified</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" required minLength={20} maxLength={2000} rows={4}
                  placeholder="What is this project doing, and where? (at least 20 characters)" />
              </div>
              <div className="field">
                <label htmlFor="impactSummary">Impact summary (optional)</label>
                <input id="impactSummary" name="impactSummary" type="text" maxLength={500}
                  placeholder="e.g. 640 ha mangrove restored" />
              </div>
              <button className="button" type="submit">
                Register project
              </button>
            </form>
          </article>
        )}
      </main>
    </div>
  );
}
