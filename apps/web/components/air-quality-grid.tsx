import Link from 'next/link';
import { routes, type DistrictWithClimate } from '@nature-grid/contracts';
import { apiGet } from '../lib/api';

// WHO PM2.5 AQI breakpoints
function aqiClass(pm25: number): {
  label: string;
  css: string;
  advice: string;
} {
  if (pm25 <= 12)    return { label: 'Good',        css: 'aqi-good',      advice: 'Air is clean' };
  if (pm25 <= 35.4)  return { label: 'Moderate',    css: 'aqi-moderate',  advice: 'Acceptable' };
  if (pm25 <= 55.4)  return { label: 'Unhealthy*',  css: 'aqi-sensitive', advice: 'Sensitive groups: limit outdoors' };
  if (pm25 <= 150.4) return { label: 'Unhealthy',   css: 'aqi-unhealthy', advice: 'Reduce outdoor exertion' };
  return               { label: 'Hazardous',         css: 'aqi-hazardous', advice: 'Stay indoors' };
}

// Trend arrow: compare today's 30d avg to itself is meaningless, so we compute
// a simple visual indicator based on absolute level for now.
// When UnionDailyClimate history is exposed via API this can become a real delta.
function trendHint(pm25: number): string {
  if (pm25 > 100) return '↑ High';
  if (pm25 > 55)  return '↑ Elevated';
  return '';
}

export default async function AirQualityGrid() {
  let districts: DistrictWithClimate[] = [];
  try {
    districts = await apiGet<DistrictWithClimate[]>(routes.locations.districts);
  } catch {
    return null;
  }

  const withAqi = districts
    .filter((d): d is DistrictWithClimate & { avgPm25_30d: number } => d.avgPm25_30d != null)
    .sort((a, b) => b.avgPm25_30d - a.avgPm25_30d)
    .slice(0, 12);

  if (withAqi.length === 0) return null;

  const nationalAvg =
    withAqi.reduce((sum, d) => sum + d.avgPm25_30d, 0) / withAqi.length;

  const unhealthyCount = withAqi.filter((d) => d.avgPm25_30d > 55.4).length;

  return (
    <section className="aqi-section public-section" aria-label="Air quality ranking by district">
      <div className="aqi-section-header">
        <div>
          <p className="eyebrow">30-Day Average PM2.5 · Top Districts</p>
          <h2>Air Quality Index</h2>
          <p className="aqi-summary">
            National avg {nationalAvg.toFixed(0)} µg/m³
            {unhealthyCount > 0 && (
              <span className="danger">
                {' '}· {unhealthyCount} district{unhealthyCount > 1 ? 's' : ''} in Unhealthy range
              </span>
            )}
          </p>
        </div>
        <p className="aqi-legend-note">
          * Unhealthy for sensitive groups (children, elderly, respiratory conditions)
        </p>
      </div>

      <div className="aqi-ranking">
        {withAqi.map((d, i) => {
          const aqi = aqiClass(d.avgPm25_30d);
          const barWidth = Math.min(100, (d.avgPm25_30d / 200) * 100);
          return (
            <div key={d.id} className={`aqi-row ${aqi.css}-border`} aria-label={`${d.name}: ${d.avgPm25_30d.toFixed(0)} µg/m³, ${aqi.label}`}>
              <span className="aqi-rank">#{i + 1}</span>
              <div className="aqi-row-main">
                <div className="aqi-row-top">
                  <strong className="aqi-district-name">{d.name}</strong>
                  {d.division?.name && (
                    <span className="aqi-division">{d.division.name}</span>
                  )}
                  <span className={`aqi-badge ${aqi.css}`}>{aqi.label}</span>
                  {trendHint(d.avgPm25_30d) && (
                    <span className="aqi-trend danger">{trendHint(d.avgPm25_30d)}</span>
                  )}
                </div>
                <div className="aqi-bar-track" title={aqi.advice}>
                  <div
                    className={`aqi-bar-fill ${aqi.css}-fill`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <span className="aqi-value">{d.avgPm25_30d.toFixed(0)} µg/m³</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="aqi-footer">
        <div className="aqi-legend">
          {([
            ['aqi-good', 'Good (0–12)'],
            ['aqi-moderate', 'Moderate (12–35)'],
            ['aqi-sensitive', 'Unhealthy* (35–55)'],
            ['aqi-unhealthy', 'Unhealthy (55–150)'],
            ['aqi-hazardous', 'Hazardous (>150)'],
          ] as [string, string][]).map(([cls, label]) => (
            <span key={cls} className="aqi-legend-item">
              <span className={`aqi-swatch ${cls}-fill`} />
              {label}
            </span>
          ))}
        </div>
        <Link href="/data" className="button ghost" style={{ flexShrink: 0 }}>
          Download air quality data
        </Link>
      </div>
    </section>
  );
}
