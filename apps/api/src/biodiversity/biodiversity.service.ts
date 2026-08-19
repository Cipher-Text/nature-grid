import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { GbifClient } from './gbif.client';
import { GbifOccurrenceRecord } from './dto/gbif-response.dto';

const MAX_RECORDS_PER_SYNC = 1000;

const SPECIES_SELECT = {
  id: true,
  gbifKey: true,
  canonicalName: true,
  vernacularName: true,
  kingdom: true,
  phylum: true,
  class: true,
  order: true,
  family: true,
  genus: true,
  iucnStatus: true,
  imageUrl: true,
  _count: { select: { occurrences: true } },
} as const;

const OCCURRENCE_SELECT = {
  id: true,
  speciesId: true,
  districtId: true,
  lat: true,
  lng: true,
  observedAt: true,
  recordedBy: true,
  basisOfRecord: true,
  createdAt: true,
  species: { select: SPECIES_SELECT },
  district: { select: { id: true, name: true, division: { select: { id: true, name: true } } } },
} as const;

@Injectable()
export class BiodiversityService {
  private readonly logger = new Logger(BiodiversityService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gbifClient: GbifClient,
  ) {}

  /** Nearest-centroid approximation — no polygon boundaries exist yet (see PostGIS open item). */
  private nearestDistrictId(
    lat: number,
    lng: number,
    districts: { id: string; lat: number; lng: number }[],
  ): string | undefined {
    let closest: { id: string; distSq: number } | undefined;
    for (const d of districts) {
      const distSq = (d.lat - lat) ** 2 + (d.lng - lng) ** 2;
      if (!closest || distSq < closest.distSq) {
        closest = { id: d.id, distSq };
      }
    }
    return closest?.id;
  }

  async syncFromGbif(): Promise<{ speciesUpserted: number; occurrencesUpserted: number }> {
    const districts = await this.prisma.district.findMany({
      where: { lat: { not: null }, lng: { not: null } },
      select: { id: true, lat: true, lng: true },
    });
    const districtCentroids = districts as { id: string; lat: number; lng: number }[];

    let offset = 0;
    let fetched = 0;
    let speciesUpserted = 0;
    let occurrencesUpserted = 0;
    let endOfRecords = false;

    while (fetched < MAX_RECORDS_PER_SYNC && !endOfRecords) {
      const page = await this.gbifClient.fetchOccurrencePage(offset);
      endOfRecords = page.endOfRecords;
      offset += page.results.length;

      for (const record of page.results) {
        if (fetched >= MAX_RECORDS_PER_SYNC) break;
        fetched++;

        const speciesId = await this.upsertSpecies(record);
        if (!speciesId) continue;
        speciesUpserted++;

        if (record.decimalLatitude == null || record.decimalLongitude == null) continue;

        const districtId = this.nearestDistrictId(
          record.decimalLatitude,
          record.decimalLongitude,
          districtCentroids,
        );

        await this.prisma.occurrence.upsert({
          where: { gbifOccurrenceKey: BigInt(record.key) },
          create: {
            gbifOccurrenceKey: BigInt(record.key),
            speciesId,
            districtId,
            lat: record.decimalLatitude,
            lng: record.decimalLongitude,
            observedAt: record.eventDate ? new Date(record.eventDate) : undefined,
            recordedBy: record.recordedBy,
            basisOfRecord: record.basisOfRecord,
          },
          update: {
            districtId,
            lat: record.decimalLatitude,
            lng: record.decimalLongitude,
          },
        });
        occurrencesUpserted++;
      }

      if (page.results.length === 0) break;
    }

    this.logger.log(`GBIF sync: ${speciesUpserted} species, ${occurrencesUpserted} occurrences upserted`);
    return { speciesUpserted, occurrencesUpserted };
  }

  private async upsertSpecies(record: GbifOccurrenceRecord): Promise<string | undefined> {
    if (!record.taxonKey) return undefined;
    const canonicalName = record.species ?? record.scientificName;
    if (!canonicalName) return undefined;

    const species = await this.prisma.species.upsert({
      where: { gbifKey: record.taxonKey },
      create: {
        gbifKey: record.taxonKey,
        canonicalName,
        vernacularName: record.vernacularName,
        kingdom: record.kingdom,
        phylum: record.phylum,
        class: record.class,
        order: record.order,
        family: record.family,
        genus: record.genus,
        imageUrl: record.media?.[0]?.identifier,
      },
      update: {
        vernacularName: record.vernacularName,
        imageUrl: record.media?.[0]?.identifier,
      },
      select: { id: true },
    });
    return species.id;
  }

  list(search: string | undefined, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const where = search
      ? {
          OR: [
            { canonicalName: { contains: search, mode: 'insensitive' as const } },
            { vernacularName: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};
    return Promise.all([
      this.prisma.species.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { canonicalName: 'asc' },
        select: SPECIES_SELECT,
      }),
      this.prisma.species.count({ where }),
    ]).then(([data, total]) => ({ data, total, page, pageSize }));
  }

  async getSpeciesById(id: string) {
    const species = await this.prisma.species.findUnique({
      where: { id },
      select: SPECIES_SELECT,
    });
    if (!species) throw new NotFoundException('Species not found');
    return species;
  }

  listOccurrences(speciesId: string | undefined, districtId: string | undefined, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const where = {
      ...(speciesId ? { speciesId } : {}),
      ...(districtId ? { districtId } : {}),
    };
    return Promise.all([
      this.prisma.occurrence.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { observedAt: 'desc' },
        select: OCCURRENCE_SELECT,
      }),
      this.prisma.occurrence.count({ where }),
    ]).then(([data, total]) => ({ data, total, page, pageSize }));
  }
}
