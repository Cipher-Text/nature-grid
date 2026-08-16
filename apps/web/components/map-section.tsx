import Link from 'next/link';
import { routes, type CurrentWeatherReading, type HourlyAirQualityReading } from '@nature-grid/contracts';
import { apiGet } from '../lib/api';
import { CONDITIONS as FALLBACK_CONDITIONS, type Condition } from '../lib/static-data';

const FILTER_TABS: { label: string; href: string; active?: boolean }[] = [
  { label: 'All', href: '/#map', active: true },
  { label: 'Alerts', href: '/alerts' },
  { label: 'Reports', href: '/reports' },
  { label: 'Species', href: '/biodiversity' },
];

const SYNC_STALE_AFTER_MINUTES = 20;
const PM25_DANGER_THRESHOLD = 55.4; // EPA "Unhealthy" breakpoint
const PM25_WARNING_THRESHOLD = 35.4; // EPA "Unhealthy for Sensitive Groups" breakpoint

function findByDistrict<T extends { district?: { name: string } }>(
  rows: T[],
  districtName: string,
): T | undefined {
  return rows.find((row) => row.district?.name === districtName);
}

async function loadConditions(): Promise<Condition[]> {
  try {
    const [weather, airQuality] = await Promise.all([
      apiGet<CurrentWeatherReading[]>(routes.weather.current),
      apiGet<HourlyAirQualityReading[]>(routes.weather.airQuality),
    ]);

    const dhakaAir = findByDistrict(airQuality, 'Dhaka');
    const sylhetWeather = findByDistrict(weather, 'Sylhet');
    const khulnaWeather = findByDistrict(weather, 'Khulna');
    const coxsBazarWeather = findByDistrict(weather, "Cox's Bazar");

    const newestReadingMs = weather.reduce<number | null>((latest, row) => {
      const t = new Date(row.readingTime).getTime();
      return latest === null || t > latest ? t : latest;
    }, null);
    const minutesSinceSync =
      newestReadingMs !== null ? Math.round((Date.now() - newestReadingMs) / 60_000) : null;
    const isLive = minutesSinceSync !== null && minutesSinceSync <= SYNC_STALE_AFTER_MINUTES;

    return [
      {
        label: 'Dhaka PM2.5',
        value: dhakaAir?.pm25 != null ? `${dhakaAir.pm25.toFixed(0)} µg/m³` : 'No data',
        variant:
          dhakaAir?.pm25 != null && dhakaAir.pm25 >= PM25_DANGER_THRESHOLD
            ? 'danger'
            : dhakaAir?.pm25 != null && dhakaAir.pm25 >= PM25_WARNING_THRESHOLD
              ? 'warning'
              : undefined,
      },
      {
        label: 'Sylhet precipitation (current)',
        value:
          sylhetWeather?.precipitation != null ? `${sylhetWeather.precipitation} mm` : 'No data',
        variant: 'info',
      },
      {
        label: 'Khulna humidity',
        value:
          khulnaWeather?.relativeHumidity2m != null
            ? `${khulnaWeather.relativeHumidity2m}%`
            : 'No data',
      },
      {
        label: "Cox's Bazar wind",
        value:
          coxsBazarWeather?.windSpeed10m != null
            ? `${coxsBazarWeather.windSpeed10m} km/h`
            : 'No data',
      },
      {
        label: 'OpenMeteo sync',
        value: isLive
          ? 'Live'
          : minutesSinceSync !== null
            ? `Delayed (${minutesSinceSync}m ago)`
            : 'Unavailable',
        variant: isLive ? 'success' : 'warning',
      },
    ];
  } catch {
    return FALLBACK_CONDITIONS;
  }
}

export default async function MapSection() {
  const conditions = await loadConditions();

  return (
    <section
      id="map"
      className="content-grid public-section"
      aria-label="Environmental map"
    >
      {/* ── Map panel ── */}
      <article className="panel">
        <div className="panel-header">
          <div>
            <h2>Environmental map</h2>
            <p>
              Verified reports, active alerts, biodiversity and restoration
              coverage
            </p>
          </div>
          <div className="segmented" role="group" aria-label="Map filter">
            {FILTER_TABS.map(({ label, href, active }) => (
              <Link
                key={label}
                href={href}
                className={`segmented-btn${active ? ' active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* CSS-rendered map canvas — replace with real map library in Phase 4 */}
        <div
          className="map-canvas polished"
          role="img"
          aria-label="Bangladesh environmental data map showing districts, alert zones, and verified reports"
        >
          <div className="map-river" aria-hidden="true" />
          <div className="map-zone map-zone-one" aria-hidden="true" />
          <div className="map-zone map-zone-two" aria-hidden="true" />
          <div className="map-zone map-zone-three" aria-hidden="true" />
          <div className="map-point map-point-a" aria-hidden="true" />
          <div className="map-point map-point-b" aria-hidden="true" />
          <div className="map-label map-label-primary" aria-hidden="true">
            Dhaka verified reports
          </div>
          <div className="map-label map-label-alert" aria-hidden="true">
            Sylhet flood watch
          </div>
        </div>

        <div className="button-row" style={{ marginTop: '14px' }}>
          <Link className="button ghost" href="/alerts">
            Full alert map
          </Link>
          <Link className="button ghost" href="/reports">
            All verified reports
          </Link>
        </div>
      </article>

      {/* ── Conditions sidebar ── */}
      <aside className="panel" aria-label="Current environmental conditions">
        <div className="panel-header">
          <div>
            <h2>Current conditions</h2>
            <p>Public preview from approved data sources</p>
          </div>
        </div>

        <div className="condition-list">
          {conditions.map(({ label, value, variant }) => (
            <div key={label} className="condition-row">
              <span>{label}</span>
              <strong className={variant ?? ''}>{value}</strong>
            </div>
          ))}
        </div>

        <div className="access-note">
          <strong>Advanced filters and downloads</strong>
          <span>
            Sign in and request dataset access to export data or use API keys.
          </span>
        </div>

        <Link
          className="button ghost"
          href="/data"
          style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}
        >
          Explore all datasets
        </Link>
      </aside>
    </section>
  );
}
