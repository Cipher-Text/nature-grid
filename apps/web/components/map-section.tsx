import dynamic from 'next/dynamic';
import Link from 'next/link';
import { routes, type Alert, type CitizenReport, type CurrentWeatherReading, type HourlyAirQualityReading } from '@nature-grid/contracts';
import { apiGet } from '../lib/api';
import { CONDITIONS as FALLBACK_CONDITIONS, type Condition } from '../lib/static-data';
import type { MapDistrict, MapAlert, MapReport } from './map-client';

// Leaflet requires browser APIs — must load with ssr: false
const MapClient = dynamic(() => import('./map-client'), {
  ssr: false,
  loading: () => (
    <div className="map-canvas" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 14 }}>
      Loading map…
    </div>
  ),
});

// ── Types for the district API response (includes lat/lng, not in DistrictSummary) ──

interface DistrictRow {
  id: string;
  name: string;
  lat: number | null;
  lng: number | null;
}

interface PaginatedAlerts {
  data: Alert[];
}

interface PaginatedReports {
  data: CitizenReport[];
}

// ── Conditions sidebar data ──

const SYNC_STALE_AFTER_MINUTES = 20;
const PM25_DANGER_THRESHOLD = 55.4;
const PM25_WARNING_THRESHOLD = 35.4;

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

// ── Map data ──

async function loadMapData(): Promise<{
  districts: MapDistrict[];
  alerts: MapAlert[];
  reports: MapReport[];
}> {
  try {
    const [districtRows, alertRes, reportRes] = await Promise.all([
      apiGet<DistrictRow[]>(routes.locations.districts),
      apiGet<PaginatedAlerts>(`${routes.alerts.list}?status=ACTIVE&pageSize=50`),
      apiGet<PaginatedReports>(`${routes.reports.list}?status=VERIFIED&pageSize=50`),
    ]);

    const districts: MapDistrict[] = districtRows
      .filter((d): d is DistrictRow & { lat: number; lng: number } => d.lat != null && d.lng != null)
      .map((d) => ({ id: d.id, name: d.name, lat: d.lat, lng: d.lng }));

    const districtById = new Map(districts.map((d) => [d.id, d]));

    const alerts: MapAlert[] = alertRes.data.map((a) => ({
      id: a.id,
      title: a.title,
      severity: a.severity,
      districtId: a.district?.id ?? null,
      districtName: a.district?.name ?? null,
    }));

    const reports: MapReport[] = reportRes.data
      .filter((r) => {
        if (r.lat != null && r.lng != null) return true;
        if (r.districtId && districtById.has(r.districtId)) return true;
        return false;
      })
      .map((r) => {
        const fallbackDistrict = r.districtId ? districtById.get(r.districtId) : undefined;
        return {
          id: r.id,
          title: r.title,
          category: r.category,
          lat: r.lat ?? fallbackDistrict!.lat,
          lng: r.lng ?? fallbackDistrict!.lng,
          districtName: r.district?.name ?? null,
        };
      });

    return { districts, alerts, reports };
  } catch {
    return { districts: [], alerts: [], reports: [] };
  }
}

// ── Component ──

export default async function MapSection() {
  const [conditions, { districts, alerts, reports }] = await Promise.all([
    loadConditions(),
    loadMapData(),
  ]);

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
              Active alerts, verified reports, and district coverage across Bangladesh
            </p>
          </div>
          <div className="map-legend" aria-label="Map legend">
            <span className="legend-item legend-alert-emergency">Emergency</span>
            <span className="legend-item legend-alert-warning">Warning</span>
            <span className="legend-item legend-alert-watch">Watch</span>
            <span className="legend-item legend-report">Report</span>
          </div>
        </div>

        <div className="map-canvas" style={{ padding: 0, overflow: 'hidden' }}>
          <MapClient districts={districts} alerts={alerts} reports={reports} />
        </div>

        <div className="button-row" style={{ marginTop: '14px' }}>
          <Link className="button ghost" href="/#reports">
            All alerts
          </Link>
          <Link className="button ghost" href="/#reports">
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
          href="/#data"
          style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}
        >
          Explore all datasets
        </Link>
      </aside>
    </section>
  );
}
