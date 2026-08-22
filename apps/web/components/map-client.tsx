'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

// Bangladesh bounding box — ensures the map always opens showing the full country
const BD_BOUNDS: [[number, number], [number, number]] = [
  [20.3, 87.8],
  [26.8, 92.8],
];

// Fallback centre used for nationwide alerts (no district pinned)
const BD_CENTER: [number, number] = [23.7, 90.4];

const SEVERITY_COLOR: Record<string, string> = {
  INFO: '#3b82f6',
  WATCH: '#d97706',
  WARNING: '#ea580c',
  EMERGENCY: '#dc2626',
};

const SEVERITY_RADIUS: Record<string, number> = {
  INFO: 10,
  WATCH: 12,
  WARNING: 14,
  EMERGENCY: 18,
};

export interface MapDistrict {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface MapAlert {
  id: string;
  title: string;
  severity: string;
  districtId: string | null;
  districtName: string | null;
}

export interface MapReport {
  id: string;
  title: string;
  category: string;
  lat: number;
  lng: number;
  districtName: string | null;
}

interface Props {
  districts: MapDistrict[];
  alerts: MapAlert[];
  reports: MapReport[];
}

function titleCase(str: string) {
  return str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function MapClient({ districts, alerts, reports }: Props) {
  const districtById = new Map(districts.map((d) => [d.id, d]));

  return (
    <MapContainer
      bounds={BD_BOUNDS}
      boundsOptions={{ padding: [8, 8] }}
      style={{ height: '100%', width: '100%', minHeight: 400, borderRadius: 8 }}
      scrollWheelZoom={false}
      attributionControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* District reference dots */}
      {districts.map((d) => (
        <CircleMarker
          key={d.id}
          center={[d.lat, d.lng]}
          radius={4}
          pathOptions={{ color: '#9db5a8', fillColor: '#9db5a8', fillOpacity: 0.5, weight: 1 }}
        >
          <Popup>
            <strong>{d.name}</strong>
          </Popup>
        </CircleMarker>
      ))}

      {/* Active alert pins */}
      {alerts.map((alert) => {
        const district = alert.districtId ? districtById.get(alert.districtId) : null;
        const center: [number, number] = district
          ? [district.lat, district.lng]
          : BD_CENTER;
        const color = SEVERITY_COLOR[alert.severity] ?? '#6b7280';
        const radius = SEVERITY_RADIUS[alert.severity] ?? 12;

        return (
          <CircleMarker
            key={alert.id}
            center={center}
            radius={radius}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.85,
              weight: 2,
            }}
          >
            <Popup>
              <div style={{ minWidth: 160 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color,
                    marginBottom: 4,
                  }}
                >
                  {alert.severity} ALERT
                </div>
                <strong style={{ fontSize: 13 }}>{alert.title}</strong>
                {alert.districtName && (
                  <div style={{ marginTop: 4, fontSize: 12, color: '#65736b' }}>
                    {alert.districtName}
                  </div>
                )}
                {!alert.districtId && (
                  <div style={{ marginTop: 4, fontSize: 12, color: '#65736b' }}>
                    Nationwide
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      {/* Verified report pins */}
      {reports.map((report) => (
        <CircleMarker
          key={report.id}
          center={[report.lat, report.lng]}
          radius={7}
          pathOptions={{
            color: '#2f7d5c',
            fillColor: '#2f7d5c',
            fillOpacity: 0.75,
            weight: 1.5,
          }}
        >
          <Popup>
            <div style={{ minWidth: 160 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#2f7d5c',
                  marginBottom: 4,
                }}
              >
                {titleCase(report.category)}
              </div>
              <strong style={{ fontSize: 13 }}>{report.title}</strong>
              {report.districtName && (
                <div style={{ marginTop: 4, fontSize: 12, color: '#65736b' }}>
                  {report.districtName}
                </div>
              )}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
