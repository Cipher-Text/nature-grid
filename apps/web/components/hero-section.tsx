import Link from 'next/link';
import { routes, type PlatformMetrics } from '@nature-grid/contracts';
import { apiGet } from '../lib/api';

export default async function HeroSection() {
  let metrics: PlatformMetrics | null = null;
  try {
    metrics = await apiGet<PlatformMetrics>(routes.metrics.platform);
  } catch {
    // hero still renders — live bar is additive, not load-bearing
  }

  const hasEmergency = (metrics?.emergencyAlerts ?? 0) > 0;

  return (
    <section className="public-hero" aria-label="Platform overview">
      <p className="eyebrow">Public Environmental Intelligence · Bangladesh</p>
      <h1>Real-time environmental signals, open to everyone.</h1>
      <p>
        Live weather, air quality, flood risk, citizen reports, GBIF biodiversity
        records, and NGO restoration projects — across 8 divisions and 64 districts.
        No login required.
      </p>

      {metrics && (
        <div className="hero-live-bar" role="status" aria-label="Live platform statistics">
          {hasEmergency && (
            <span className="hero-live-stat hero-live-stat--emergency">
              <span className="hero-live-dot hero-live-dot--danger" aria-hidden="true" />
              {metrics.emergencyAlerts} emergency alert{metrics.emergencyAlerts > 1 ? 's' : ''}
            </span>
          )}
          <span className="hero-live-stat">
            <span
              className={`hero-live-dot${!hasEmergency ? ' hero-live-dot--pulse' : ''}`}
              aria-hidden="true"
            />
            {metrics.activeAlerts} active alert{metrics.activeAlerts !== 1 ? 's' : ''}
          </span>
          <span className="hero-live-stat hero-live-stat--divider">
            {metrics.verifiedReports.toLocaleString()} verified reports
          </span>
          <span className="hero-live-stat hero-live-stat--divider">
            {metrics.researchGradeObservations.toLocaleString()} biodiversity records
          </span>
        </div>
      )}

      <div className="button-row">
        <Link className="button" href="#map">
          Explore live map
        </Link>
        <Link className="button ghost" href="/login">
          Sign in to contribute
        </Link>
      </div>

      <p className="hero-open-note">
        Open data for researchers, NGOs, journalists, and citizens.{' '}
        <Link href="/data">Browse datasets →</Link>
      </p>
    </section>
  );
}
