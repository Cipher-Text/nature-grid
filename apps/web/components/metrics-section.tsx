import { routes, type PlatformMetrics } from '@nature-grid/contracts';
import { apiGet } from '../lib/api';
import { METRICS as FALLBACK_METRICS, type Metric } from '../lib/static-data';

async function loadMetrics(): Promise<Metric[]> {
  try {
    const m = await apiGet<PlatformMetrics>(routes.metrics.platform);

    return [
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
    ];
  } catch {
    return FALLBACK_METRICS;
  }
}

export default async function MetricsSection() {
  const metrics = await loadMetrics();

  return (
    <section
      id="dashboard"
      className="metric-grid public-section"
      aria-label="Platform overview metrics"
    >
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
