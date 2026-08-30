import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HydrologicalClass, Prisma, WaterBodyType } from '@prisma/client';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { PrismaService } from '../database/prisma.service';

type CsvRow = Record<string, string>;

function parseCsv(text: string): CsvRow[] {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const parseLine = (line: string) => {
    const cells: string[] = [];
    let cell = '';
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && line[i + 1] === '"' && quoted) {
        cell += '"';
        i++;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === ',' && !quoted) {
        cells.push(cell);
        cell = '';
      } else {
        cell += char;
      }
    }
    cells.push(cell);
    return cells;
  };
  const headers = parseLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
}

function value(row: CsvRow, key: string) {
  const result = row[key]?.trim();
  return result || undefined;
}

function numberValue(row: CsvRow, key: string) {
  const result = value(row, key);
  if (!result) return undefined;
  const parsed = Number(result);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalized(valueToNormalize: string) {
  return valueToNormalize
    .toLowerCase()
    .replace(/jessore/g, 'jashore')
    .replace(/barisal/g, 'barishal')
    .replace(/chittagong/g, 'chattogram')
    .replace(/comilla/g, 'cumilla')
    .replace(/[^a-z0-9]/g, '');
}

function listValues(input?: string) {
  return (input ?? '')
    .split(/[/;]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

@Injectable()
export class WaterBodiesService implements OnModuleInit {
  private readonly logger = new Logger(WaterBodiesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const files = ['water-bodies.csv', 'lotic-water-bodies.csv', 'lentic-water-bodies.csv', 'water-level-station.csv'];
    const roots = [process.cwd(), resolve(process.cwd(), '../..'), resolve(__dirname, '../../../..')];
    const root = roots.find((candidate) => files.every((file) => existsSync(resolve(candidate, file))));
    if (!root) {
      this.logger.warn('Water-body CSV files not found; skipping water-body seed');
      return;
    }
    await this.seed(root);
  }

  private async seed(root: string) {
    const read = (file: string) => parseCsv(readFileSync(resolve(root, file), 'utf8'));
    const waterRows = read('water-bodies.csv');
    const loticRows = new Map(read('lotic-water-bodies.csv').map((row) => [row.water_body_id, row]));
    const lenticRows = new Map(read('lentic-water-bodies.csv').map((row) => [row.water_body_id, row]));
    const stationRows = read('water-level-station.csv');

    const districts = await this.prisma.district.findMany({ select: { id: true, name: true } });
    const upazilas = await this.prisma.upazila.findMany({
      select: { id: true, name: true, districtId: true, district: { select: { name: true } } },
    });
    const districtNames = new Map(districts.map((district) => [normalized(district.name), district]));
    const upazilaNames = new Map<string, typeof upazilas>();
    const waterBodyNameIds = new Map<string, string>();
    for (const upazila of upazilas) {
      const key = normalized(upazila.name);
      upazilaNames.set(key, [...(upazilaNames.get(key) ?? []), upazila]);
    }

    let linkedLocations = 0;
    for (const row of waterRows) {
      const code = value(row, 'id');
      if (!code) continue;
      const type = value(row, 'water_body_type')?.toUpperCase();
      const data = {
        code,
        slug: value(row, 'slug') ?? code.toLowerCase(),
        nameEn: value(row, 'name_en') ?? code,
        nameBn: value(row, 'name_bn'),
        hydrologicalClass: value(row, 'hydrological_class') as HydrologicalClass,
        waterBodyType: (type === 'RIVER' ? WaterBodyType.RIVER : type === 'LAKE' ? WaterBodyType.LAKE : WaterBodyType.WETLAND),
        waterBodySubtype: value(row, 'water_body_subtype'),
        latitude: numberValue(row, 'latitude') ?? 0,
        longitude: numberValue(row, 'longitude') ?? 0,
        transboundaryFlag: value(row, 'transboundary_flag') === 'true',
        transboundaryCountries: value(row, 'transboundary_countries'),
      } satisfies Prisma.WaterBodyCreateInput;

      const waterBody = await this.prisma.waterBody.upsert({ where: { code }, update: data, create: data });
      waterBodyNameIds.set(normalized(data.nameEn), waterBody.id);
      const districtKeys = listValues(value(row, 'district')).map(normalized);
      const districtIds = new Set(
        districtKeys.map((key) => districtNames.get(key)?.id).filter((id): id is string => Boolean(id)),
      );
      for (const upazilaName of listValues(value(row, 'upazila'))) {
        const candidates = (upazilaNames.get(normalized(upazilaName)) ?? []).filter(
          (upazila) => !districtIds.size || districtIds.has(upazila.districtId),
        );
        if (candidates.length === 1) {
          await this.prisma.waterBodyUpazila.upsert({
            where: { waterBodyId_upazilaId: { waterBodyId: waterBody.id, upazilaId: candidates[0].id } },
            update: {},
            create: { waterBodyId: waterBody.id, upazilaId: candidates[0].id },
          });
          linkedLocations++;
        } else if (candidates.length !== 0) {
          this.logger.warn(`Ambiguous upazila mapping: ${code} -> ${upazilaName}`);
        } else {
          this.logger.warn(`Unmatched upazila mapping: ${code} -> ${upazilaName}`);
        }
      }

      const lotic = loticRows.get(code);
      if (lotic) {
        await this.prisma.loticWaterBodyDetails.upsert({
          where: { waterBodyId: waterBody.id },
          update: this.loticData(lotic, waterBody.id),
          create: this.loticData(lotic, waterBody.id),
        });
      }
      const lentic = lenticRows.get(code);
      if (lentic) {
        await this.prisma.lenticWaterBodyDetails.upsert({
          where: { waterBodyId: waterBody.id },
          update: this.lenticData(lentic, waterBody.id),
          create: this.lenticData(lentic, waterBody.id),
        });
      }
    }

    for (const row of stationRows) {
      const stationCode = value(row, 'Station ID');
      if (!stationCode) continue;
      const data = {
        serial: Number(row.SL),
        stationCode,
        name: value(row, 'Station') ?? stationCode,
        riverName: value(row, 'River') ?? 'Unknown',
        tidalStatus: value(row, 'Tidal Status'),
        district: value(row, 'District'),
        upazila: value(row, 'Upazila'),
        latitude: numberValue(row, 'Latitude') ?? 0,
        longitude: numberValue(row, 'Longitude') ?? 0,
      } satisfies Prisma.WaterLevelStationCreateInput;
      await this.prisma.waterLevelStation.upsert({ where: { stationCode }, update: data, create: data });
      const matchedWaterBodyId = waterBodyNameIds.get(normalized(data.riverName));
      if (matchedWaterBodyId) {
        const station = await this.prisma.waterLevelStation.findUniqueOrThrow({ where: { stationCode } });
        await this.prisma.waterBodyStation.upsert({
          where: { waterBodyId_stationId: { waterBodyId: matchedWaterBodyId, stationId: station.id } },
          update: {},
          create: { waterBodyId: matchedWaterBodyId, stationId: station.id },
        });
      }
    }

    this.logger.log(`Water bodies seeded: ${waterRows.length} bodies, ${loticRows.size} lotic, ${lenticRows.size} lentic, ${stationRows.length} stations, ${linkedLocations} upazila links`);
  }

  private loticData(row: CsvRow, waterBodyId: string): Prisma.LoticWaterBodyDetailsCreateInput {
    return {
      waterBody: { connect: { id: waterBodyId } },
      lengthKmBd: numberValue(row, 'length_km_bd'),
      averageWidthM: value(row, 'avg_width_m'),
      maxDepthM: numberValue(row, 'max_depth_m'),
      meanDischargeM3s: numberValue(row, 'mean_discharge_m3s'),
      hydrologicalOrigin: value(row, 'hydrological_origin'),
      outfallTo: value(row, 'outfall_to'),
      flowRegime: value(row, 'flow_regime'),
      divisionsTraversed: value(row, 'divisions_traversed'),
      districtsTraversed: value(row, 'districts_traversed'),
      bwdbGaugingStations: value(row, 'bwdb_gauging_stations'),
      banglapediaMatchName: value(row, 'banglapedia_match_name'),
      banglapediaLengthKm: numberValue(row, 'banglapedia_length_km'),
      banglapediaAreaCoveredOldDistricts: value(row, 'banglapedia_area_covered_old_districts'),
      banglapediaSource: value(row, 'banglapedia_source'),
    };
  }

  private lenticData(row: CsvRow, waterBodyId: string): Prisma.LenticWaterBodyDetailsCreateInput {
    return {
      waterBody: { connect: { id: waterBodyId } },
      areaMonsoonSqKm: numberValue(row, 'area_monsoon_sqkm'),
      areaDrySqKm: numberValue(row, 'area_dry_sqkm'),
      waterVolumeEst: value(row, 'water_volume_est'),
      seasonality: value(row, 'seasonality'),
    };
  }

  list(query: { hydrologicalClass?: HydrologicalClass; upazilaId?: string; districtId?: string }) {
    return this.prisma.waterBody.findMany({
      where: {
        hydrologicalClass: query.hydrologicalClass,
        upazilas: query.upazilaId
          ? { some: { upazilaId: query.upazilaId } }
          : query.districtId
            ? { some: { upazila: { districtId: query.districtId } } }
            : undefined,
      },
      orderBy: { nameEn: 'asc' },
      include: { upazilas: { include: { upazila: { include: { district: true } } } }, loticDetails: true, lenticDetails: true },
    });
  }

  findOne(id: string) {
    return this.prisma.waterBody.findFirst({
      where: { OR: [{ id }, { code: id }, { slug: id }] },
      include: { upazilas: { include: { upazila: { include: { district: true } } } }, loticDetails: true, lenticDetails: true, stations: { include: { station: true } } },
    });
  }

  listStations() {
    return this.prisma.waterLevelStation.findMany({ orderBy: { serial: 'asc' }, include: { waterBodies: { include: { waterBody: true } } } });
  }
}
