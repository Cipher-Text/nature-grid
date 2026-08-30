import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HydrologicalClass, Prisma, WaterBodyType } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { WATER_BODIES, WATER_LEVEL_STATIONS } from './seed/water-bodies';

/** Normalise a location name for fuzzy matching.
 *  Handles spelling variants that appear across the CSV sources. */
function normalised(name: string): string {
  return name
    .toLowerCase()
    .replace(/jessore/g, 'jashore')
    .replace(/barisal/g, 'barishal')
    .replace(/chittagong/g, 'chattogram')
    .replace(/comilla/g, 'cumilla')
    .replace(/[^a-z0-9]/g, '');
}

@Injectable()
export class WaterBodiesService implements OnModuleInit {
  private readonly logger = new Logger(WaterBodiesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // Skip if already seeded (same guard pattern as LocationsService)
    const existing = await this.prisma.waterBody.count();
    if (existing > 0) {
      this.logger.log(`Water bodies already seeded (${existing} records) — skipping`);
      return;
    }
    try {
      await this.seed();
    } catch (err) {
      this.logger.error('Water-body seed failed', err instanceof Error ? err.stack : String(err));
    }
  }

  private async seed() {
    this.logger.log('Seeding water bodies…');

    // ── Load geographic lookup tables ────────────────────────────────────────
    const districts = await this.prisma.district.findMany({ select: { id: true, name: true } });
    const upazilas = await this.prisma.upazila.findMany({
      select: { id: true, name: true, districtId: true },
    });

    if (districts.length === 0) {
      this.logger.warn('No districts found — location seeds have not run yet. Upazila links will be skipped.');
    }

    // name → district record
    const districtByName = new Map(districts.map((d) => [normalised(d.name), d]));

    // normalised-name → upazila[] (multiple upazilas can share a name across districts)
    const upazilasByName = new Map<string, typeof upazilas>();
    for (const u of upazilas) {
      const key = normalised(u.name);
      upazilasByName.set(key, [...(upazilasByName.get(key) ?? []), u]);
    }

    // waterBodyId keyed by code — needed for station linking in the second pass
    const idByCode = new Map<string, string>();
    let upazilaLinks = 0;
    let ambiguous = 0;
    let unmatched = 0;

    // ── Phase 1: water bodies + lentic/lotic details + upazila links ─────────
    for (const seed of WATER_BODIES) {
      const rawType = seed.waterBodyType.toUpperCase();
      const wbType: WaterBodyType =
        rawType === 'RIVER' ? WaterBodyType.RIVER
        : rawType === 'LAKE' ? WaterBodyType.LAKE
        : WaterBodyType.WETLAND;

      const data: Prisma.WaterBodyCreateInput = {
        code: seed.code,
        slug: seed.slug,
        nameEn: seed.nameEn,
        nameBn: seed.nameBn,
        hydrologicalClass: seed.hydrologicalClass as HydrologicalClass,
        waterBodyType: wbType,
        waterBodySubtype: seed.waterBodySubtype,
        latitude: seed.latitude,
        longitude: seed.longitude,
        transboundaryFlag: seed.transboundaryFlag,
        transboundaryCountries: seed.transboundaryCountries,
      };

      const wb = await this.prisma.waterBody.upsert({
        where: { code: seed.code },
        create: data,
        update: data,
      });
      idByCode.set(seed.code, wb.id);

      // Upazila links — use district IDs to disambiguate same-named upazilas across districts
      const districtIds = new Set(
        seed.districtNames
          .map((n) => districtByName.get(normalised(n))?.id)
          .filter((id): id is string => Boolean(id)),
      );

      for (const upazilaName of seed.upazilaNames) {
        const key = normalised(upazilaName);
        const candidates = (upazilasByName.get(key) ?? []).filter(
          (u) => !districtIds.size || districtIds.has(u.districtId),
        );

        if (candidates.length === 1) {
          await this.prisma.waterBodyUpazila.upsert({
            where: { waterBodyId_upazilaId: { waterBodyId: wb.id, upazilaId: candidates[0].id } },
            create: { waterBodyId: wb.id, upazilaId: candidates[0].id },
            update: {},
          });
          upazilaLinks++;
        } else if (candidates.length > 1) {
          this.logger.warn(`Ambiguous upazila "${upazilaName}" for ${seed.code} — skipped`);
          ambiguous++;
        } else {
          this.logger.warn(`No upazila match for "${upazilaName}" (${seed.code})`);
          unmatched++;
        }
      }

      // Lentic details
      if (seed.lentic) {
        const lenticData: Prisma.LenticWaterBodyDetailsCreateInput = {
          waterBody: { connect: { id: wb.id } },
          areaMonsoonSqKm: seed.lentic.areaMonsoonSqKm,
          areaDrySqKm: seed.lentic.areaDrySqKm,
          waterVolumeEst: seed.lentic.waterVolumeEst,
          seasonality: seed.lentic.seasonality,
        };
        await this.prisma.lenticWaterBodyDetails.upsert({
          where: { waterBodyId: wb.id },
          create: lenticData,
          update: lenticData,
        });
      }

      // Lotic details
      if (seed.lotic) {
        const loticData: Prisma.LoticWaterBodyDetailsCreateInput = {
          waterBody: { connect: { id: wb.id } },
          lengthKmBd: seed.lotic.lengthKmBd,
          averageWidthM: seed.lotic.averageWidthM,
          maxDepthM: seed.lotic.maxDepthM,
          meanDischargeM3s: seed.lotic.meanDischargeM3s,
          hydrologicalOrigin: seed.lotic.hydrologicalOrigin,
          outfallTo: seed.lotic.outfallTo,
          flowRegime: seed.lotic.flowRegime,
          divisionsTraversed: seed.lotic.divisionsTraversed,
          districtsTraversed: seed.lotic.districtsTraversed,
          bwdbGaugingStations: seed.lotic.stationCodes.join(', ') || undefined,
          banglapediaMatchName: seed.lotic.banglapediaMatchName,
          banglapediaLengthKm: seed.lotic.banglapediaLengthKm,
          banglapediaAreaCoveredOldDistricts: seed.lotic.banglapediaAreaCoveredOldDistricts,
          banglapediaSource: seed.lotic.banglapediaSource,
        };
        await this.prisma.loticWaterBodyDetails.upsert({
          where: { waterBodyId: wb.id },
          create: loticData,
          update: loticData,
        });
      }
    }

    // ── Phase 2: water-level stations ────────────────────────────────────────
    const stationIdByCode = new Map<string, string>();

    for (const seed of WATER_LEVEL_STATIONS) {
      const data: Prisma.WaterLevelStationCreateInput = {
        serial: seed.serial,
        stationCode: seed.stationCode,
        name: seed.name,
        riverName: seed.riverName,
        tidalStatus: seed.tidalStatus,
        district: seed.district,
        upazila: seed.upazila,
        latitude: seed.latitude,
        longitude: seed.longitude,
      };
      const station = await this.prisma.waterLevelStation.upsert({
        where: { stationCode: seed.stationCode },
        create: data,
        update: data,
      });
      stationIdByCode.set(seed.stationCode, station.id);
    }

    // ── Phase 3: link stations to water bodies via explicit station codes ─────
    // Lotic water bodies carry a stationCodes[] from the bwdb_gauging_stations
    // column — far more reliable than fuzzy river-name matching.
    let stationLinks = 0;
    for (const seed of WATER_BODIES) {
      if (!seed.lotic?.stationCodes.length) continue;
      const wbId = idByCode.get(seed.code);
      if (!wbId) continue;

      for (const code of seed.lotic.stationCodes) {
        const stationId = stationIdByCode.get(code);
        if (!stationId) {
          this.logger.debug(`Station ${code} referenced by ${seed.code} not found in station table — skipped`);
          continue;
        }
        await this.prisma.waterBodyStation.upsert({
          where: { waterBodyId_stationId: { waterBodyId: wbId, stationId } },
          create: { waterBodyId: wbId, stationId },
          update: {},
        });
        stationLinks++;
      }
    }

    this.logger.log(
      `Water bodies seeded: ${WATER_BODIES.length} bodies, ` +
        `${upazilaLinks} upazila links (${ambiguous} ambiguous, ${unmatched} unmatched), ` +
        `${WATER_LEVEL_STATIONS.length} stations, ${stationLinks} station↔body links`,
    );
  }

  // ── Public read methods ────────────────────────────────────────────────────

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
      include: {
        upazilas: { include: { upazila: { include: { district: true } } } },
        loticDetails: true,
        lenticDetails: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.waterBody.findFirst({
      where: { OR: [{ id }, { code: id }, { slug: id }] },
      include: {
        upazilas: { include: { upazila: { include: { district: true } } } },
        loticDetails: true,
        lenticDetails: true,
        stations: { include: { station: true } },
      },
    });
  }

  listStations(query: { districtName?: string; tidalStatus?: string } = {}) {
    return this.prisma.waterLevelStation.findMany({
      where: {
        district: query.districtName
          ? { contains: query.districtName, mode: 'insensitive' }
          : undefined,
        tidalStatus: query.tidalStatus,
      },
      orderBy: { serial: 'asc' },
      include: { waterBodies: { include: { waterBody: { select: { id: true, code: true, nameEn: true } } } } },
    });
  }
}
