import { METRICS } from '../lib/static-data';

export default function MetricsSection() {
  return (
    <section
      id="dashboard"
      className="metric-grid public-section"
      aria-label="Platform overview metrics"
    >
      {METRICS.map((m) => (
        <article key={m.label} className={`metric${m.highlight ? ' highlight-metric' : ''}`}>
          <span>{m.label}</span>
          <strong>{m.value}</strong>
          <small className={m.noteVariant ?? ''}>{m.note}</small>
        </article>
      ))}
    </section>
  );
}
