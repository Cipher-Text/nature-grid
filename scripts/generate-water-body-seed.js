#!/usr/bin/env node
// Generates apps/api/src/water-bodies/seed/water-bodies.ts from the four CSV files.
// Usage: node scripts/generate-water-body-seed.js
// The output is written to stdout; redirect or pipe as needed.

'use strict';

const fs = require('fs');
const path = require('path');

// ─── CSV parser (handles quoted fields, CRLF, BOM) ───────────────────────────

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];

  function parseLine(line) {
    const cells = [];
    let cell = '';
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"' && line[i + 1] === '"' && quoted) {
        cell += '"';
        i++;
      } else if (ch === '"') {
        quoted = !quoted;
      } else if (ch === ',' && !quoted) {
        cells.push(cell);
        cell = '';
      } else {
        cell += ch;
      }
    }
    cells.push(cell);
    return cells;
  }

  const headers = parseLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function v(row, key) {
  const r = row[key]?.trim();
  return r || undefined;
}

function n(row, key) {
  const r = v(row, key);
  if (!r) return undefined;
  const parsed = Number(r);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** Split on "/" or ";" separators used in district/upazila columns */
function splitList(s) {
  return (s ?? '').split(/[/;]/).map((p) => p.trim()).filter(Boolean);
}

/**
 * Correct CSV location names to match the exact spelling used in the
 * Bangladesh seed DB (bangladesh.ts).  Only entries that differ after
 * basic normalisation are listed here.
 */
const DISTRICT_CORRECTIONS = {
  'Nawabganj': 'Chapainawabganj',
};

const UPAZILA_CORRECTIONS = {
  'Chaugachha':   'Chougachha',
  'Dacope':       'Dakop',
  'Dumuaria':     'Dumuria',
  'Fulchhari':    'Phulchari',
  'Goalandaghat': 'Goalanda',
  'Ishwardi':     'Ishurdi',
  'Jhikargachha': 'Jhikargacha',
  'Jjbannagar':   'Jibannagar',
  'Kaharole':     'Kaharol',
  'Kamalganj':    'Kamolganj',
  'Lohajang':     'Louhajanj',
  'Matlab Uttar': 'Matlab North',
  'Melandaha':    'Melandah',
  'Mohanganj':    'Mohongonj',
  'Paikgachha':   'Paikgasa',
  'Pangsha':      'Pangsa',
  'Phultala':     'Fultola',
  'Saghatta':     'Saghata',
  'Shivalaya':    'Shibaloy',
  'Tahiyapur':    'Tahirpur',
  'Thakurgaon':   'Thakurgaon Sadar', // district name used as upazila in CSV
};

function correctDistrict(name) { return DISTRICT_CORRECTIONS[name] ?? name; }
function correctUpazila(name)  { return UPAZILA_CORRECTIONS[name]  ?? name; }

/**
 * Extract BWDB station codes from the bwdb_gauging_stations cell.
 * Input examples:
 *   "SW147 (Kasalong)"
 *   "SW99 (Gorai Railway Bridge), SW101 (Kamarkhali)"
 *   "SW15J (Mathurpara-Milanpur); SW46.7R (Kristomonichar)"
 * Extracts: SW147, SW99, SW101, SW15J, SW46.7R …
 */
function parseStationCodes(s) {
  if (!s) return [];
  const matches = [...s.matchAll(/\bSW[\w.]+/g)];
  return matches.map((m) => m[0]);
}

function q(val) {
  if (val === undefined || val === null) return 'undefined';
  return JSON.stringify(val);
}

// ─── Read CSVs ────────────────────────────────────────────────────────────────

const root = path.resolve(__dirname, '..');

function readCsv(filename) {
  return parseCsv(fs.readFileSync(path.join(root, filename), 'utf8'));
}

const waterRows   = readCsv('water-bodies.csv');
const loticMap    = new Map(readCsv('lotic-water-bodies.csv').map((r) => [r['water_body_id'], r]));
const lenticMap   = new Map(readCsv('lentic-water-bodies.csv').map((r) => [r['water_body_id'], r]));
const stationRows = readCsv('water-level-station.csv');

// ─── Build TypeScript output ──────────────────────────────────────────────────

const lines = [];

lines.push(`// AUTO-GENERATED — do not edit by hand.`);
lines.push(`// Re-run: node scripts/generate-water-body-seed.js > apps/api/src/water-bodies/seed/water-bodies.ts`);
lines.push(``);

// ── Interfaces ──
lines.push(`export interface LenticSeed {`);
lines.push(`  areaMonsoonSqKm?: number;`);
lines.push(`  areaDrySqKm?: number;`);
lines.push(`  waterVolumeEst?: string;`);
lines.push(`  seasonality?: string;`);
lines.push(`}`);
lines.push(``);

lines.push(`export interface LoticSeed {`);
lines.push(`  lengthKmBd?: number;`);
lines.push(`  averageWidthM?: string;`);
lines.push(`  maxDepthM?: number;`);
lines.push(`  meanDischargeM3s?: number;`);
lines.push(`  hydrologicalOrigin?: string;`);
lines.push(`  outfallTo?: string;`);
lines.push(`  flowRegime?: string;`);
lines.push(`  divisionsTraversed?: string;`);
lines.push(`  districtsTraversed?: string;`);
lines.push(`  /** BWDB station codes (e.g. "SW99") used to link WaterBodyStation records */`);
lines.push(`  stationCodes: string[];`);
lines.push(`  banglapediaMatchName?: string;`);
lines.push(`  banglapediaLengthKm?: number;`);
lines.push(`  banglapediaAreaCoveredOldDistricts?: string;`);
lines.push(`  banglapediaSource?: string;`);
lines.push(`}`);
lines.push(``);

lines.push(`export interface WaterBodySeed {`);
lines.push(`  code: string;`);
lines.push(`  slug: string;`);
lines.push(`  nameEn: string;`);
lines.push(`  nameBn?: string;`);
lines.push(`  hydrologicalClass: 'LENTIC' | 'LOTIC';`);
lines.push(`  waterBodyType: 'RIVER' | 'WETLAND' | 'LAKE';`);
lines.push(`  waterBodySubtype?: string;`);
lines.push(`  latitude: number;`);
lines.push(`  longitude: number;`);
lines.push(`  transboundaryFlag: boolean;`);
lines.push(`  transboundaryCountries?: string;`);
lines.push(`  /** District name(s) from the CSV — used for upazila disambiguation at seed time */`);
lines.push(`  districtNames: string[];`);
lines.push(`  /** Upazila name(s) from the CSV — resolved to FK at seed time */`);
lines.push(`  upazilaNames: string[];`);
lines.push(`  lentic?: LenticSeed;`);
lines.push(`  lotic?: LoticSeed;`);
lines.push(`}`);
lines.push(``);

lines.push(`export interface WaterLevelStationSeed {`);
lines.push(`  serial: number;`);
lines.push(`  stationCode: string;`);
lines.push(`  name: string;`);
lines.push(`  riverName: string;`);
lines.push(`  tidalStatus?: string;`);
lines.push(`  /** Raw district name from CSV */`);
lines.push(`  district?: string;`);
lines.push(`  /** Raw upazila name from CSV */`);
lines.push(`  upazila?: string;`);
lines.push(`  latitude: number;`);
lines.push(`  longitude: number;`);
lines.push(`}`);
lines.push(``);

// ── WATER_BODIES ──
lines.push(`export const WATER_BODIES: WaterBodySeed[] = [`);

for (const row of waterRows) {
  const code = v(row, 'id');
  if (!code) continue;

  const rawType = (v(row, 'water_body_type') ?? '').toUpperCase();
  const wbType = rawType === 'RIVER' ? 'RIVER' : rawType === 'LAKE' ? 'LAKE' : 'WETLAND';
  const hClass = v(row, 'hydrological_class') ?? 'LOTIC';
  const districtNames = splitList(v(row, 'district')).map(correctDistrict);
  const upazilaNames  = splitList(v(row, 'upazila')).map(correctUpazila);
  const lenticRow = lenticMap.get(code);
  const loticRow  = loticMap.get(code);

  lines.push(`  {`);
  lines.push(`    code: ${q(code)},`);
  lines.push(`    slug: ${q(v(row, 'slug') ?? code.toLowerCase())},`);
  lines.push(`    nameEn: ${q(v(row, 'name_en') ?? code)},`);

  const nameBn = v(row, 'name_bn');
  if (nameBn) lines.push(`    nameBn: ${q(nameBn)},`);

  lines.push(`    hydrologicalClass: ${q(hClass)},`);
  lines.push(`    waterBodyType: ${q(wbType)},`);

  const subtype = v(row, 'water_body_subtype');
  if (subtype) lines.push(`    waterBodySubtype: ${q(subtype)},`);

  lines.push(`    latitude: ${v(row, 'latitude') ?? 0},`);
  lines.push(`    longitude: ${v(row, 'longitude') ?? 0},`);
  lines.push(`    transboundaryFlag: ${v(row, 'transboundary_flag') === 'true'},`);

  const txCountries = v(row, 'transboundary_countries');
  if (txCountries) lines.push(`    transboundaryCountries: ${q(txCountries)},`);

  lines.push(`    districtNames: ${JSON.stringify(districtNames)},`);
  lines.push(`    upazilaNames: ${JSON.stringify(upazilaNames)},`);

  // Lentic block
  if (lenticRow) {
    const areaMon = n(lenticRow, 'area_monsoon_sqkm');
    const areaDry = n(lenticRow, 'area_dry_sqkm');
    const volEst  = v(lenticRow, 'water_volume_est');
    const seas    = v(lenticRow, 'seasonality');
    lines.push(`    lentic: {`);
    if (areaMon !== undefined) lines.push(`      areaMonsoonSqKm: ${areaMon},`);
    if (areaDry !== undefined) lines.push(`      areaDrySqKm: ${areaDry},`);
    if (volEst)  lines.push(`      waterVolumeEst: ${q(volEst)},`);
    // Only emit seasonality when it differs from waterVolumeEst (CSV data quality issue)
    if (seas && seas !== volEst) lines.push(`      seasonality: ${q(seas)},`);
    lines.push(`    },`);
  }

  // Lotic block
  if (loticRow) {
    const lenKm   = n(loticRow, 'length_km_bd');
    const avgW    = v(loticRow, 'avg_width_m');
    const maxD    = n(loticRow, 'max_depth_m');
    const disch   = n(loticRow, 'mean_discharge_m3s');
    const orig    = v(loticRow, 'hydrological_origin');
    const outfall = v(loticRow, 'outfall_to');
    const flow    = v(loticRow, 'flow_regime');
    const divs    = v(loticRow, 'divisions_traversed');
    const dists   = v(loticRow, 'districts_traversed');
    const codes   = parseStationCodes(v(loticRow, 'bwdb_gauging_stations'));
    const bpName  = v(loticRow, 'banglapedia_match_name');
    const bpLen   = n(loticRow, 'banglapedia_length_km');
    const bpArea  = v(loticRow, 'banglapedia_area_covered_old_districts');
    const bpSrc   = v(loticRow, 'banglapedia_source');

    lines.push(`    lotic: {`);
    if (lenKm   !== undefined) lines.push(`      lengthKmBd: ${lenKm},`);
    if (avgW)                  lines.push(`      averageWidthM: ${q(avgW)},`);
    if (maxD    !== undefined) lines.push(`      maxDepthM: ${maxD},`);
    if (disch   !== undefined) lines.push(`      meanDischargeM3s: ${disch},`);
    if (orig)                  lines.push(`      hydrologicalOrigin: ${q(orig)},`);
    if (outfall)               lines.push(`      outfallTo: ${q(outfall)},`);
    if (flow)                  lines.push(`      flowRegime: ${q(flow)},`);
    if (divs)                  lines.push(`      divisionsTraversed: ${q(divs)},`);
    if (dists)                 lines.push(`      districtsTraversed: ${q(dists)},`);
    lines.push(`      stationCodes: ${JSON.stringify(codes)},`);
    if (bpName  !== undefined && bpName)  lines.push(`      banglapediaMatchName: ${q(bpName)},`);
    if (bpLen   !== undefined) lines.push(`      banglapediaLengthKm: ${bpLen},`);
    if (bpArea)                lines.push(`      banglapediaAreaCoveredOldDistricts: ${q(bpArea)},`);
    if (bpSrc)                 lines.push(`      banglapediaSource: ${q(bpSrc)},`);
    lines.push(`    },`);
  }

  lines.push(`  },`);
}

lines.push(`];`);
lines.push(``);

// ── WATER_LEVEL_STATIONS ──
lines.push(`export const WATER_LEVEL_STATIONS: WaterLevelStationSeed[] = [`);

for (const row of stationRows) {
  const stationCode = v(row, 'Station ID');
  if (!stationCode) continue;

  const serial = Number(row['SL']);
  const name   = v(row, 'Station') ?? stationCode;
  const river  = v(row, 'River') ?? 'Unknown';
  const tidal  = v(row, 'Tidal Status');
  const dist   = v(row, 'District');
  const upaz   = v(row, 'Upazila');
  const lat    = v(row, 'Latitude') ?? '0';
  const lng    = v(row, 'Longitude') ?? '0';

  lines.push(`  {`);
  lines.push(`    serial: ${serial},`);
  lines.push(`    stationCode: ${q(stationCode)},`);
  lines.push(`    name: ${q(name)},`);
  lines.push(`    riverName: ${q(river)},`);
  if (tidal) lines.push(`    tidalStatus: ${q(tidal)},`);
  if (dist)  lines.push(`    district: ${q(dist)},`);
  if (upaz)  lines.push(`    upazila: ${q(upaz)},`);
  lines.push(`    latitude: ${lat},`);
  lines.push(`    longitude: ${lng},`);
  lines.push(`  },`);
}

lines.push(`];`);
lines.push(``);

process.stdout.write(lines.join('\n'));
