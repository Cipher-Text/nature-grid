'use client';

/**
 * CivicScienceTabs — Client Component
 *
 * Receives pre-fetched, serialised data from CivicScienceSection (server) and
 * handles tab switching entirely in the client. No fetch, no API call here.
 */

import { useState } from 'react';
import Link from 'next/link';

// ── Shared serialisable types (exported so the server component can import them) ──

export interface ReportItem {
  id: string;
  title: string;
  district: string;
  category: string;
  status: string;
  updatedAt: string;
}

export interface AlertItem {
  id: string;
  title: string;
  severity: string;
  severityClass: string;
  district: string;
  issuedAt: string;
}

export interface BiodiversityStats {
  speciesTotal: number;
  occurrenceTotal: number;
}

export interface ProjectItem {
  id: string;
  title: string;
  org: string;
  district: string;
  summary: string | null;
}

interface Props {
  reports:     { items: ReportItem[];  isLive: boolean };
  alerts:      { items: AlertItem[];   isLive: boolean };
  biodiversity: BiodiversityStats | null;
  restoration: { items: ProjectItem[]; isLive: boolean };
}

type TabKey = 'reports' | 'alerts' | 'biodiversity' | 'restoration';

const TABS: { key: TabKey; label: string; viewAllHref: string; contributeHref: string; contributeLabel: string }[] = [
  { key: 'reports',      label: 'Verified Reports', viewAllHref: '/reports',      contributeHref: '/login', contributeLabel: 'Sign in to submit a report'    },
  { key: 'alerts',       label: 'Active Alerts',    viewAllHref: '/alerts',       contributeHref: '/alerts',contributeLabel: 'View all alerts'               },
  { key: 'biodiversity', label: 'Biodiversity',     viewAllHref: '/biodiversity', contributeHref: '/login', contributeLabel: 'Sign in to log an observation' },
  { key: 'restoration',  label: 'Restoration',      viewAllHref: '/restoration',  contributeHref: '/login', contributeLabel: 'Sign in to participate'        },
];

export default function CivicScienceTabs({ reports, alerts, biodiversity, restoration }: Props) {
  const [active, setActive] = useState<TabKey>('reports');
  const current = TABS.find((t) => t.key === active)!;

  return (
    <section
      id="civic"
      className="civic-science-section public-section"
      aria-label="Civic activity and science"
    >
      {/* ── Section header ── */}
      <div className="civic-section-header">
        <div>
          <p className="eyebrow">Verified · Real-time · Open</p>
          <h2>Civic Activity & Science</h2>
        </div>
        <Link href={current.viewAllHref} className="button ghost">
          View all {current.label.toLowerCase()}
        </Link>
      </div>

      {/* ── Tab navigation ── */}
      <nav className="civic-tabs-nav" role="tablist" aria-label="Content categories">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={active === tab.key}
            aria-controls={`civic-panel-${tab.key}`}
            id={`civic-tab-${tab.key}`}
            className={`civic-tab-btn${active === tab.key ? ' civic-tab-btn--active' : ''}`}
            onClick={() => setActive(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ── Panels ── */}

      {/* Reports */}
      <div
        role="tabpanel"
        id="civic-panel-reports"
        aria-labelledby="civic-tab-reports"
        hidden={active !== 'reports'}
        className="civic-tab-panel"
      >
        <div className="civic-record-list">
          {reports.isLive && reports.items.length === 0 && (
            <div className="empty-state">No verified reports yet.</div>
          )}
          {!reports.isLive && (
            <div className="empty-state" role="status">Verified reports are temporarily unavailable.</div>
          )}
          {reports.items.map((r) => (
            <div key={r.id} className="civic-record-item">
              <div className="civic-record-top">
                <strong>{r.title}</strong>
                {r.category && (
                  <span className="civic-record-tag">{r.category}</span>
                )}
              </div>
              {(r.district || r.updatedAt) && (
                <span className="civic-record-meta">
                  {[r.district, r.status, r.updatedAt].filter(Boolean).join(' · ')}
                </span>
              )}
            </div>
          ))}
        </div>
        <Link href={current.contributeHref} className="button ghost civic-contribute-link">
          {current.contributeLabel}
        </Link>
      </div>

      {/* Alerts */}
      <div
        role="tabpanel"
        id="civic-panel-alerts"
        aria-labelledby="civic-tab-alerts"
        hidden={active !== 'alerts'}
        className="civic-tab-panel"
      >
        <div className="civic-record-list">
          {alerts.isLive && alerts.items.length === 0 && (
            <div className="empty-state">No active alerts right now.</div>
          )}
          {!alerts.isLive && (
            <div className="empty-state" role="status">Alert data is temporarily unavailable.</div>
          )}
          {alerts.items.map((a) => (
            <div key={a.id} className="civic-record-item">
              <div className="civic-record-top">
                <strong className={a.severityClass}>{a.title}</strong>
                <span className={`civic-record-tag civic-record-tag--${a.severityClass}`}>
                  {a.severity}
                </span>
              </div>
              <span className="civic-record-meta">
                {[a.district, a.issuedAt].filter(Boolean).join(' · ')}
              </span>
            </div>
          ))}
        </div>
        <Link href={current.contributeHref} className="button ghost civic-contribute-link">
          {current.contributeLabel}
        </Link>
      </div>

      {/* Biodiversity */}
      <div
        role="tabpanel"
        id="civic-panel-biodiversity"
        aria-labelledby="civic-tab-biodiversity"
        hidden={active !== 'biodiversity'}
        className="civic-tab-panel"
      >
        <div className="civic-bio-panel">
          <div
            className="civic-bio-image species-image mangrove"
            role="img"
            aria-label="Sundarbans mangrove habitat illustration"
          />
          <div className="civic-bio-content">
            {biodiversity ? (
              <>
                <div className="civic-bio-stats">
                  <div className="civic-bio-stat">
                    <strong>{biodiversity.speciesTotal.toLocaleString()}</strong>
                    <span>species recorded</span>
                  </div>
                  <div className="civic-bio-stat">
                    <strong>{biodiversity.occurrenceTotal.toLocaleString()}</strong>
                    <span>occurrence records</span>
                  </div>
                </div>
                <p className="civic-bio-note">
                  Research-grade observations synced daily from GBIF — mangrove, freshwater,
                  and coastal species across Bangladesh.
                </p>
              </>
            ) : (
              <p className="civic-bio-note">
                Biodiversity totals are temporarily unavailable. Browse the biodiversity area
                for the latest records and source details.
              </p>
            )}
            <div className="button-row">
              <Link href="/biodiversity" className="button ghost">Species records</Link>
              <Link href="/observations" className="button ghost">All observations</Link>
            </div>
          </div>
        </div>
        <Link href={current.contributeHref} className="button ghost civic-contribute-link">
          {current.contributeLabel}
        </Link>
      </div>

      {/* Restoration */}
      <div
        role="tabpanel"
        id="civic-panel-restoration"
        aria-labelledby="civic-tab-restoration"
        hidden={active !== 'restoration'}
        className="civic-tab-panel"
      >
        <div className="civic-record-list">
          {restoration.isLive && restoration.items.length === 0 && (
            <div className="empty-state">No restoration projects registered yet.</div>
          )}
          {!restoration.isLive && (
            <div className="empty-state" role="status">Restoration projects are temporarily unavailable.</div>
          )}
          {restoration.items.map((p) => (
            <div key={p.id} className="civic-record-item">
              <div className="civic-record-top">
                <strong>{p.title}</strong>
              </div>
              <span className="civic-record-meta">
                {p.summary ?? [p.org, p.district].filter(Boolean).join(' · ')}
              </span>
            </div>
          ))}
        </div>
        <Link href={current.contributeHref} className="button ghost civic-contribute-link">
          {current.contributeLabel}
        </Link>
      </div>
    </section>
  );
}
