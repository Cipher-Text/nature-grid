import { routes, type PlatformMetrics } from '@nature-grid/contracts';
import { apiGet } from '../lib/api';

interface Metric {
  label: string;
  value: string;
  note: string;
  noteVariant?: 'warning' | 'danger' | 'success';
  highlight?: boolean;
}

async function loadMetrics(): Promise<{ metrics: Metric[]; isLive: boolean }> {
  try {
    const m = await apiGet<PlatformMetrics>(routes.metrics.platform);

    return { isLive: true, metrics: [
      {
        label: 'Active alerts',
        value: String(m.activeAlerts),
        note: `${m.emergencyAlerts} emergency severity`,
        noteVariant: m.emergencyAlerts > 0 ? 'warning' : 'success',
        highlight: true,
      },
      {
        label: 'Verified reports',
        value: String(m.verifiedReports),
        note: 'Reviewed records only',
      },
      {
        label: 'Public datasets',
        value: String(m.publicDatasets),
        note: 'Downloads require sign in',
      },
      {
        label: 'Research-grade observations',
        value: String(m.researchGradeObservations),
        note: `Across ${m.districtsWithResearchGradeObservations} districts`,
      },
    ] };
  } catch {
    return { isLive: false, metrics: [] };
  }
}

export default async function MetricsSection() {
  const { metrics, isLive } = await loadMetrics();

  return (
    <section
      id="dashboard"
      className="metric-grid public-section"
      aria-label="Platform overview metrics"
    >
      {!isLive && (
        <div className="metric metric-unavailable" role="status">
          <span>Platform snapshot</span>
          <strong>Temporarily unavailable</strong>
          <small>Live platform totals could not be retrieved. Please try again shortly.</small>
        </div>
      )}
      {metrics.map((m) => (
        <article key={m.label} className={`metric${m.highlight ? ' highlight-metric' : ''}`}>
          <span>{m.label}</span>
          <strong>{m.value}</strong>
          <small className={m.noteVariant ?? ''}>{m.note}</small>
        </article>
      ))}
    </section>
  );
}
