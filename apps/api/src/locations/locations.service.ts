import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { loadAdministrativeData } from './seed/bangladesh';

/**
 * Name mapping: old seed names → administrative.json names.
 * Applied once on boot to align existing DB records before upserting.
 */
const DIVISION_RENAMES: Record<string, string> = {
  Barishal: 'Barisal',
  Chattogram: 'Chattagram',
};

const DISTRICT_RENAMES: Record<string, string> = {
  Cumilla: 'Comilla',
  "Cox's Bazar": 'Coxsbazar',
  Jhalokati: 'Jhalakathi',
  Barishal: 'Barisal',
};

@Injectable()
export class LocationsService implements OnModuleInit {
  private readonly logger = new Logger(LocationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const divisionCount = await this.prisma.division.count();
    const upazilaCount = await this.prisma.upazila.count();

    if (divisionCount === 0) {
      await this.seed();
    } else if (upazilaCount === 0) {
      // Existing DB with divisions + districts but no upazilas/unions.
      // Rename legacy names, then run full upsert to enrich + populate.
      await this.renameLegacyRecords();
      await this.seed();
    }
  }

  /** Rename division/district records whose names differ from administrative.json. */
  private async renameLegacyRecords() {
    for (const [oldName, newName] of Object.entries(DIVISION_RENAMES)) {
      const result = await this.prisma.division.updateMany({
        where: { name: oldName },
        data: { name: newName },
      });
      if (result.count > 0) {
        this.logger.log(`Renamed division "${oldName}" → "${newName}"`);
      }
    }

    for (const [oldName, newName] of Object.entries(DISTRICT_RENAMES)) {
      const result = await this.prisma.district.updateMany({
        where: { name: oldName },
        data: { name: newName },
      });
      if (result.count > 0) {
        this.logger.log(`Renamed district "${oldName}" → "${newName}"`);
      }
    }
  }

  private async seed() {
    this.logger.log('Seeding Bangladesh geography…');
    const divisions = loadAdministrativeData();

    let districtCount = 0;
    let upazilaCount = 0;
    let unionCount = 0;

    for (const div of divisions) {
      const division = await this.prisma.division.upsert({
        where: { name: div.name },
        update: {
          bnName: div.bnName,
          slug: div.slug,
          pcode: div.pcode,
          lat: div.lat,
          lng: div.lng,
          areaSqKm: div.areaSqKm,
          url: div.url,
        },
        create: {
          name: div.name,
          bnName: div.bnName,
          slug: div.slug,
          pcode: div.pcode,
          lat: div.lat,
          lng: div.lng,
          areaSqKm: div.areaSqKm,
          url: div.url,
        },
      });

      for (const dist of div.districts) {
        const district = await this.prisma.district.upsert({
          where: {
            name_divisionId: { name: dist.name, divisionId: division.id },
          },
          update: {
            bnName: dist.bnName,
            slug: dist.slug,
            pcode: dist.pcode,
            lat: dist.lat,
            lng: dist.lng,
            centerLat: dist.centerLat,
            centerLng: dist.centerLng,
            areaSqKm: dist.areaSqKm,
            url: dist.url,
            boundary: (dist.boundary as Prisma.InputJsonValue) ?? undefined,
          },
          create: {
            name: dist.name,
            bnName: dist.bnName,
            slug: dist.slug,
            pcode: dist.pcode,
            lat: dist.lat,
            lng: dist.lng,
            centerLat: dist.centerLat,
            centerLng: dist.centerLng,
            areaSqKm: dist.areaSqKm,
            url: dist.url,
            boundary: (dist.boundary as Prisma.InputJsonValue) ?? undefined,
            divisionId: division.id,
          },
        });
        districtCount++;

        for (const up of dist.upazilas) {
          const upazila = await this.prisma.upazila.upsert({
            where: {
              name_districtId: { name: up.name, districtId: district.id },
            },
            update: {
              bnName: up.bnName,
              slug: up.slug,
              pcode: up.pcode,
              lat: up.lat,
              lng: up.lng,
              areaSqKm: up.areaSqKm,
              url: up.url,
            },
            create: {
              name: up.name,
              bnName: up.bnName,
              slug: up.slug,
              pcode: up.pcode,
              lat: up.lat,
              lng: up.lng,
              areaSqKm: up.areaSqKm,
              url: up.url,
              districtId: district.id,
            },
          });
          upazilaCount++;

          for (const un of up.unions) {
            await this.prisma.union.upsert({
              where: {
                name_upazilaId: { name: un.name, upazilaId: upazila.id },
              },
              update: {
                bnName: un.bnName,
                slug: un.slug,
                pcode: un.pcode,
                lat: un.lat,
                lng: un.lng,
                url: un.url,
              },
              create: {
                name: un.name,
                bnName: un.bnName,
                slug: un.slug,
                pcode: un.pcode,
                lat: un.lat,
                lng: un.lng,
                url: un.url,
                upazilaId: upazila.id,
              },
            });
            unionCount++;
          }
        }
      }
    }

    this.logger.log(
      `Geography seeded: ${divisions.length} divisions, ${districtCount} districts, ` +
        `${upazilaCount} upazilas, ${unionCount} unions`,
    );
  }

  // ─── Read queries ───────────────────────────────────────────────────────────

  getDivisions() {
    return this.prisma.division.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { districts: true } } },
    });
  }

  getDistricts(divisionId?: string) {
    return this.prisma.district.findMany({
      where: divisionId ? { divisionId } : undefined,
      orderBy: { name: 'asc' },
      include: {
        division: { select: { id: true, name: true } },
        _count: { select: { upazilas: true } },
      },
    });
  }

  async getDistrict(id: string) {
    const district = await this.prisma.district.findUnique({
      where: { id },
      include: {
        division: { select: { id: true, name: true } },
        upazilas: {
          orderBy: { name: 'asc' },
          select: { id: true, name: true, bnName: true },
        },
      },
    });
    if (!district) throw new NotFoundException('District not found');
    return district;
  }

  getUpazilas(districtId?: string) {
    return this.prisma.upazila.findMany({
      where: districtId ? { districtId } : undefined,
      orderBy: { name: 'asc' },
      include: {
        district: { select: { id: true, name: true } },
        _count: { select: { unions: true } },
      },
    });
  }

  async getUpazila(id: string) {
    const upazila = await this.prisma.upazila.findUnique({
      where: { id },
      include: {
        district: {
          select: {
            id: true,
            name: true,
            division: { select: { id: true, name: true } },
          },
        },
        unions: {
          orderBy: { name: 'asc' },
          select: { id: true, name: true, bnName: true },
        },
      },
    });
    if (!upazila) throw new NotFoundException('Upazila not found');
    return upazila;
  }

  getUnions(upazilaId?: string) {
    return this.prisma.union.findMany({
      where: upazilaId ? { upazilaId } : undefined,
      orderBy: { name: 'asc' },
      include: {
        upazila: {
          select: {
            id: true,
            name: true,
            district: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  async getUnion(id: string) {
    const union = await this.prisma.union.findUnique({
      where: { id },
      include: {
        upazila: {
          select: {
            id: true,
            name: true,
            district: {
              select: {
                id: true,
                name: true,
                division: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });
    if (!union) throw new NotFoundException('Union not found');
    return union;
  }
}
