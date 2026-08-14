import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { DIVISIONS, DISTRICTS_BY_DIVISION } from './seed/bangladesh';

@Injectable()
export class LocationsService implements OnModuleInit {
  private readonly logger = new Logger(LocationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Seed geography on first boot if the table is empty. */
  async onModuleInit() {
    const count = await this.prisma.division.count();
    if (count === 0) {
      await this.seed();
    }
  }

  private async seed() {
    this.logger.log('Seeding Bangladesh geography…');
    for (const div of DIVISIONS) {
      const division = await this.prisma.division.upsert({
        where: { name: div.name },
        update: {},
        create: { name: div.name, bnName: div.bnName },
      });
      const districts = DISTRICTS_BY_DIVISION[div.name] ?? [];
      for (const dist of districts) {
        await this.prisma.district.upsert({
          where: { name_divisionId: { name: dist.name, divisionId: division.id } },
          update: {},
          create: { name: dist.name, bnName: dist.bnName, divisionId: division.id },
        });
      }
    }
    this.logger.log('Geography seeded: 8 divisions, 64 districts');
  }

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
      include: { division: { select: { id: true, name: true } } },
    });
  }

  async getDistrict(id: string) {
    const district = await this.prisma.district.findUnique({
      where: { id },
      include: { division: { select: { id: true, name: true } } },
    });
    if (!district) throw new NotFoundException('District not found');
    return district;
  }

  getUpazilas(districtId?: string) {
    return this.prisma.upazila.findMany({
      where: districtId ? { districtId } : undefined,
      orderBy: { name: 'asc' },
      include: { district: { select: { id: true, name: true } } },
    });
  }

  getUnions(upazilaId?: string) {
    return this.prisma.union.findMany({
      where: upazilaId ? { upazilaId } : undefined,
      orderBy: { name: 'asc' },
    });
  }
}
