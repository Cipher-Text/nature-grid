/**
 * Bangladesh administrative geography seed.
 *
 * Primary source: administrative.json — 8 divisions, 64 districts,
 * 494 upazilas, 4 540 unions with metadata (pcode, area, coordinates, urls).
 *
 * Supplementary: districts.geojson — 64 MultiPolygon district boundaries.
 *
 * Both files are copied to dist/ via nest-cli.json asset config.
 */

import * as fs from 'fs';
import * as path from 'path';

// ─── Raw JSON shapes ────────────────────────────────────────────────────────

interface RawUnion {
  id: string;
  name: string;
  bn_name: string;
  slug: string;
  pcode?: string;
  url?: string;
  center_lat?: string;
  center_lon?: string;
}

interface RawUpazila {
  id: string;
  name: string;
  bn_name: string;
  slug: string;
  pcode?: string;
  lat?: string;
  lon?: string;
  area_sqkm?: string;
  url?: string;
  unions: RawUnion[];
}

interface RawDistrict {
  id: string;
  name: string;
  bn_name: string;
  slug: string;
  pcode?: string;
  lat?: string;
  lon?: string;
  center_lat?: string;
  center_lon?: string;
  area_sqkm?: string;
  url?: string;
  upazilas: RawUpazila[];
}

interface RawDivision {
  id: string;
  name: string;
  bn_name: string;
  slug: string;
  pcode?: string;
  center_lat?: string;
  center_lon?: string;
  area_sqkm?: string;
  url?: string;
  districts: RawDistrict[];
}

interface AdminJson {
  country: Record<string, unknown>;
  divisions: RawDivision[];
}

interface GeoJsonFeature {
  type: string;
  properties: { ADM2_EN: string; ADM1_EN: string };
  geometry: Record<string, unknown>;
}

interface GeoJsonCollection {
  type: string;
  features: GeoJsonFeature[];
}

// ─── Parsed output shapes ───────────────────────────────────────────────────

export interface SeedUnion {
  name: string;
  bnName: string;
  slug: string;
  pcode: string | null;
  lat: number | null;
  lng: number | null;
  url: string | null;
}

export interface SeedUpazila {
  name: string;
  bnName: string;
  slug: string;
  pcode: string | null;
  lat: number | null;
  lng: number | null;
  areaSqKm: number | null;
  url: string | null;
  unions: SeedUnion[];
}

export interface SeedDistrict {
  name: string;
  bnName: string;
  slug: string;
  pcode: string | null;
  lat: number | null;
  lng: number | null;
  centerLat: number | null;
  centerLng: number | null;
  areaSqKm: number | null;
  url: string | null;
  boundary: Record<string, unknown> | null;
  upazilas: SeedUpazila[];
}

export interface SeedDivision {
  name: string;
  bnName: string;
  slug: string;
  pcode: string | null;
  lat: number | null;
  lng: number | null;
  areaSqKm: number | null;
  url: string | null;
  districts: SeedDistrict[];
}

// ─── GeoJSON district-name → admin.json district-name mapping ───────────────
// The two data sources use different romanisations for 9 districts.

const GEOJSON_TO_ADMIN: Record<string, string> = {
  Bogra: 'Bogura',
  Brahamanbaria: 'Brahmanbaria',
  Nawabganj: 'Chapainawabganj',
  Chittagong: 'Chattogram',
  "Cox's Bazar": 'Coxsbazar',
  Jessore: 'Jashore',
  Jhalokati: 'Jhalakathi',
  Maulvibazar: 'Moulvibazar',
  Netrakona: 'Netrokona',
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function toFloat(v: string | undefined): number | null {
  if (!v) return null;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

function nonEmpty(v: string | undefined): string | null {
  return v?.trim() || null;
}

// ─── Loaders ────────────────────────────────────────────────────────────────

export function loadAdministrativeData(): SeedDivision[] {
  const adminPath = path.join(__dirname, 'administrative.json');
  const geoPath = path.join(__dirname, 'districts.geojson');

  const admin: AdminJson = JSON.parse(fs.readFileSync(adminPath, 'utf-8'));
  const geo: GeoJsonCollection = JSON.parse(fs.readFileSync(geoPath, 'utf-8'));

  // Build boundary lookup keyed by admin.json district name
  const boundaryMap = new Map<string, Record<string, unknown>>();
  for (const feature of geo.features) {
    const geoName = feature.properties.ADM2_EN;
    const adminName = GEOJSON_TO_ADMIN[geoName] ?? geoName;
    boundaryMap.set(adminName, feature.geometry);
  }

  return admin.divisions.map((div) => ({
    name: div.name,
    bnName: div.bn_name,
    slug: div.slug,
    pcode: nonEmpty(div.pcode),
    lat: toFloat(div.center_lat),
    lng: toFloat(div.center_lon),
    areaSqKm: toFloat(div.area_sqkm),
    url: nonEmpty(div.url),
    districts: div.districts.map((dist) => ({
      name: dist.name,
      bnName: dist.bn_name,
      slug: dist.slug,
      pcode: nonEmpty(dist.pcode),
      lat: toFloat(dist.lat),
      lng: toFloat(dist.lon),
      centerLat: toFloat(dist.center_lat),
      centerLng: toFloat(dist.center_lon),
      areaSqKm: toFloat(dist.area_sqkm),
      url: nonEmpty(dist.url),
      boundary: boundaryMap.get(dist.name) ?? null,
      upazilas: dist.upazilas.map((up) => ({
        name: up.name,
        bnName: up.bn_name,
        slug: up.slug,
        pcode: nonEmpty(up.pcode),
        lat: toFloat(up.lat),
        lng: toFloat(up.lon),
        areaSqKm: toFloat(up.area_sqkm),
        url: nonEmpty(up.url),
        unions: up.unions.map((un) => ({
          name: un.name,
          bnName: un.bn_name,
          slug: un.slug,
          pcode: nonEmpty(un.pcode),
          lat: toFloat(un.center_lat),
          lng: toFloat(un.center_lon),
          url: nonEmpty(un.url),
        })),
      })),
    })),
  }));
}
