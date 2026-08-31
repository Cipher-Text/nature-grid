#!/usr/bin/env node
// Run from repo root: node scripts/update-upazila-seed.js
// Updates upazila entries in apps/api/src/locations/seed/bangladesh.ts
// using upazilas-495-596-with-district.csv.
// - Existing upazilas: updates name, lat, lng, url, isThana
// - New upazilas (city thanas): appended to the matching district with isThana:true
// Preserves: slug, pcode, areaSqKm, unions

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT      = path.join(__dirname, '..');
const CSV_PATH  = path.join(ROOT, 'upazilas-495-596-with-district.csv');
const SEED_PATH = path.join(ROOT, 'apps/api/src/locations/seed/bangladesh.ts');

// ─── 1. Parse CSV ─────────────────────────────────────────────────────────────

function parseCSVLine(line) {
  const fields = [];
  let cur = '', inQ = false;
  for (const ch of line) {
    if (ch === '"')                  { inQ = !inQ; }
    else if (ch === ',' && !inQ)     { fields.push(cur); cur = ''; }
    else                             { cur += ch; }
  }
  fields.push(cur);
  return fields;
}

const csvRaw     = fs.readFileSync(CSV_PATH, 'utf-8');
const csvLines   = csvRaw.split('\n').filter(l => l.trim());
const headers    = parseCSVLine(csvLines[0]).map(h => h.trim());

const csvRows = csvLines.slice(1)
  .map(line => {
    const vals = parseCSVLine(line);
    const obj  = {};
    headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim(); });
    return obj;
  })
  .filter(r => r.name);

// districtBn → Map<upazilaBn, row>
const csvByDistrict = {};
for (const row of csvRows) {
  const dbn = row['district_bn_name'];
  if (!csvByDistrict[dbn]) csvByDistrict[dbn] = new Map();
  csvByDistrict[dbn].set(row['bn_name'], row);
}

console.log(`CSV loaded: ${csvRows.length} rows across ${Object.keys(csvByDistrict).length} districts`);

// ─── 2. Load SEED_DATA from bangladesh.ts ────────────────────────────────────

function removeInterfaceBlocks(content) {
  const out = [];
  let i = 0;
  while (i < content.length) {
    if (content.slice(i, i + 16) === 'export interface') {
      const brace = content.indexOf('{', i);
      if (brace === -1) { out.push(content[i++]); continue; }
      let depth = 0, j = brace;
      while (j < content.length) {
        if (content[j] === '{')      depth++;
        else if (content[j] === '}') { depth--; if (depth === 0) break; }
        j++;
      }
      i = j + 1;
      if (content[i] === '\n') i++;   // skip trailing newline
    } else {
      out.push(content[i++]);
    }
  }
  return out.join('');
}

function loadSeedData() {
  const ts      = fs.readFileSync(SEED_PATH, 'utf-8');
  const dataIdx = ts.indexOf('\nexport const SEED_DATA');
  const header  = ts.substring(0, dataIdx + 1);

  let js = removeInterfaceBlocks(ts);
  js = js.replace(/\nexport const SEED_DATA:\s*\w+(?:\[\])?\s*=/, '\nconst SEED_DATA =');
  js = js.replace(/^export /gm, '');
  js += '\nmodule.exports = { SEED_DATA };\n';

  const tmp = path.join(ROOT, '.tmp_seed_update.js');
  fs.writeFileSync(tmp, js, 'utf-8');
  try {
    delete require.cache[require.resolve(tmp)];
    const data = require(tmp).SEED_DATA;
    return { data, header };
  } finally {
    try { fs.unlinkSync(tmp); } catch (_) {}
  }
}

// ─── 3. Merge CSV into SEED_DATA ─────────────────────────────────────────────

function slugify(name) {
  return name.toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function csvUrl(raw) {
  if (!raw || raw === 'null') return null;
  return raw;
}

function mergeData(seedData) {
  let updated = 0, added = 0, noCSV = 0;

  for (const division of seedData) {
    for (const district of division.districts) {
      const distMap = csvByDistrict[district.bnName];
      if (!distMap) {
        console.warn(`  [WARN] No CSV data for district: ${district.bnName} (${district.name})`);
        continue;
      }

      const existingBns = new Set(district.upazilas.map(u => u.bnName));

      // Update existing upazilas
      for (const up of district.upazilas) {
        const row = distMap.get(up.bnName);
        if (row) {
          up.name    = row['name'];
          up.bnName  = row['bn_name'];
          if (row['lat']) up.lat = parseFloat(row['lat']);
          if (row['lon']) up.lng = parseFloat(row['lon']);
          up.url     = csvUrl(row['url']);
          up.isThana = row['is_thana'] === 'true';
          updated++;
        } else {
          noCSV++;
          console.warn(`  [WARN] No CSV match: ${up.bnName} (${up.name}) in ${district.bnName}`);
        }
      }

      // Add new upazilas/thanas from CSV not yet in seed
      for (const [bn, row] of distMap) {
        if (!existingBns.has(bn)) {
          district.upazilas.push({
            name:     row['name'],
            bnName:   bn,
            slug:     slugify(row['name']),
            pcode:    null,
            lat:      row['lat'] ? parseFloat(row['lat']) : null,
            lng:      row['lon'] ? parseFloat(row['lon']) : null,
            areaSqKm: null,
            url:      csvUrl(row['url']),
            isThana:  row['is_thana'] === 'true',
            unions:   [],
          });
          added++;
        }
      }
    }
  }

  console.log(`\nMerge: ${updated} updated, ${added} added, ${noCSV} seed upazilas with no CSV match`);
  return seedData;
}

// ─── 4. TypeScript code generator ────────────────────────────────────────────

function q(s) {
  if (s === null || s === undefined) return 'null';
  return `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function n(v) {
  return v === null || v === undefined ? 'null' : String(v);
}

function genUnion(un, ind) {
  const i2 = ind + '  ';
  const lines = [
    `${ind}{`,
    `${i2}name: ${q(un.name)}, bnName: ${q(un.bnName)},`,
    `${i2}slug: ${q(un.slug)}, pcode: ${q(un.pcode)},`,
    `${i2}lat: ${n(un.lat)}, lng: ${n(un.lng)}, url: ${q(un.url)},`,
  ];
  if (un.isCoastal !== undefined) lines.push(`${i2}isCoastal: ${un.isCoastal},`);
  lines.push(`${ind}},`);
  return lines.join('\n');
}

function genUpazila(up, ind) {
  const i2 = ind + '  ';
  const lines = [
    `${ind}{`,
    `${i2}name: ${q(up.name)}, bnName: ${q(up.bnName)},`,
    `${i2}slug: ${q(up.slug)}, pcode: ${q(up.pcode)},`,
    `${i2}lat: ${n(up.lat)}, lng: ${n(up.lng)}, areaSqKm: ${n(up.areaSqKm)}, url: ${q(up.url)},`,
  ];
  lines.push(`${i2}isThana: ${up.isThana === true},`);
  lines.push(`${i2}unions: [`);
  for (const un of (up.unions || [])) lines.push(genUnion(un, i2 + '  '));
  lines.push(`${i2}],`);
  lines.push(`${ind}},`);
  return lines.join('\n');
}

function genDistrict(dist, ind) {
  const i2 = ind + '  ';
  const lines = [
    `${ind}{`,
    `${i2}name: ${q(dist.name)}, bnName: ${q(dist.bnName)},`,
    `${i2}slug: ${q(dist.slug)}, pcode: ${q(dist.pcode)},`,
    `${i2}lat: ${n(dist.lat)}, lng: ${n(dist.lng)},`,
    `${i2}centerLat: ${n(dist.centerLat)}, centerLng: ${n(dist.centerLng)},`,
    `${i2}areaSqKm: ${n(dist.areaSqKm)}, url: ${q(dist.url)},`,
  ];
  if (dist.isCoastal) lines.push(`${i2}isCoastal: true,`);
  const boundaryStr = dist.boundary === null ? 'null' : JSON.stringify(dist.boundary);
  lines.push(`${i2}boundary: ${boundaryStr},`);
  lines.push(`${i2}upazilas: [`);
  for (const up of dist.upazilas) lines.push(genUpazila(up, i2 + '  '));
  lines.push(`${i2}],`);
  lines.push(`${ind}},`);
  return lines.join('\n');
}

function genDivision(div, ind) {
  const i2 = ind + '  ';
  const lines = [
    `${ind}{`,
    `${i2}name: ${q(div.name)}, bnName: ${q(div.bnName)},`,
    `${i2}slug: ${q(div.slug)}, pcode: ${q(div.pcode)},`,
    `${i2}lat: ${n(div.lat)}, lng: ${n(div.lng)}, areaSqKm: ${n(div.areaSqKm)}, url: ${q(div.url)},`,
    `${i2}districts: [`,
  ];
  for (const d of div.districts) lines.push(genDistrict(d, i2 + '  '));
  lines.push(`${i2}],`);
  lines.push(`${ind}},`);
  return lines.join('\n');
}

function generateTS(header, seedData) {
  const lines = [
    header.trimEnd(),
    '',
    'export const SEED_DATA: SeedDivision[] = [',
  ];
  for (const div of seedData) lines.push(genDivision(div, '  '));
  lines.push('];\n');
  return lines.join('\n');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('Loading seed data...');
const { data: seedData, header } = loadSeedData();
const totalDivisions = seedData.length;
const totalDistricts = seedData.reduce((s, d) => s + d.districts.length, 0);
const totalUpazilas  = seedData.reduce((s, d) => d.districts.reduce((s2, dist) => s2 + dist.upazilas.length, s), 0);
console.log(`Loaded: ${totalDivisions} divisions, ${totalDistricts} districts, ${totalUpazilas} upazilas`);

console.log('Merging CSV data...');
mergeData(seedData);

const totalAfter = seedData.reduce((s, d) => d.districts.reduce((s2, dist) => s2 + dist.upazilas.length, s), 0);
console.log(`Total upazilas after merge: ${totalAfter}`);

console.log('\nGenerating bangladesh.ts...');
const output = generateTS(header, seedData);
fs.writeFileSync(SEED_PATH, output, 'utf-8');
console.log(`Done → ${SEED_PATH}`);
