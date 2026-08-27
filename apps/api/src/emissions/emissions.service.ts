import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PollutantType, PollutionSourceType } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreatePollutionSourceDto } from './dto/create-pollution-source.dto';
import { UpdatePollutionSourceDto } from './dto/update-pollution-source.dto';
import { CreateEmissionEntryDto } from './dto/create-emission-entry.dto';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { clampPagination } from '../common/pagination';
import { assertDistrictExists } from '../common/validate-district';

const SOURCE_SELECT = {
  id: true,
  name: true,
  type: true,
  description: true,
  districtId: true,
  lat: true,
  lng: true,
  organizationId: true,
  isActive: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  district: { select: { id: true, name: true } },
  organization: { select: { id: true, name: true } },
  _count: { select: { entries: true } },
} as const;

const ENTRY_SELECT = {
  id: true,
  sourceId: true,
  pollutant: true,
  value: true,
  unit: true,
  measurementMethod: true,
  periodStart: true,
  periodEnd: true,
  notes: true,
  reportedById: true,
  createdAt: true,
  updatedAt: true,
  reportedBy: { select: { id: true, displayName: true } },
} as const;

@Injectable()
export class EmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Pollution Sources ───────────────────────────────────────────────────────

  async createSource(dto: CreatePollutionSourceDto, user: JwtPayload) {
    if (dto.districtId) await assertDistrictExists(this.prisma, dto.districtId);
    if (dto.organizationId) {
      const org = await this.prisma.organization.findUnique({
        where: { id: dto.organizationId },
        select: { id: true },
      });
      if (!org) throw new BadRequestException('Organization not found');
    }

    const source = await this.prisma.pollutionSource.create({
      data: {
        name: dto.name,
        type: dto.type,
        description: dto.description,
        districtId: dto.districtId,
        lat: dto.lat,
        lng: dto.lng,
        organizationId: dto.organizationId,
        createdById: user.sub,
      },
      select: SOURCE_SELECT,
    });

    await this.prisma.auditEvent.create({
      data: {
        action: 'EMISSION_SOURCE_CREATE',
        userId: user.sub,
        entityType: 'PollutionSource',
        entityId: source.id,
      },
    });

    return source;
  }

  listSources(
    type?: PollutionSourceType,
    districtId?: string,
    isActive?: boolean,
    rawPage = 1,
    rawPageSize = 20,
  ) {
    const { page, pageSize } = clampPagination(rawPage, rawPageSize);
    const where = {
      ...(type ? { type } : {}),
      ...(districtId ? { districtId } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
    };
    return Promise.all([
      this.prisma.pollutionSource.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: SOURCE_SELECT,
      }),
      this.prisma.pollutionSource.count({ where }),
    ]).then(([data, total]) => ({ data, total, page, pageSize }));
  }

  async getSourceById(id: string) {
    const source = await this.prisma.pollutionSource.findUnique({
      where: { id },
      select: SOURCE_SELECT,
    });
    if (!source) throw new NotFoundException('Pollution source not found');
    return source;
  }

  async updateSource(id: string, dto: UpdatePollutionSourceDto, actor: JwtPayload) {
    const source = await this.getSourceById(id);
    if (source.createdById !== actor.sub && actor.role !== 'ADMIN') {
      throw new ForbiddenException('Only the source creator or an admin can update this record');
    }

    return this.prisma.pollutionSource.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
      select: SOURCE_SELECT,
    });
  }

  // ─── Emission Entries ────────────────────────────────────────────────────────

  async createEntry(sourceId: string, dto: CreateEmissionEntryDto, user: JwtPayload) {
    await this.getSourceById(sourceId); // 404 if source doesn't exist

    const entry = await this.prisma.emissionEntry.create({
      data: {
        sourceId,
        pollutant: dto.pollutant,
        value: dto.value,
        unit: dto.unit,
        measurementMethod: dto.measurementMethod,
        periodStart: dto.periodStart ? new Date(dto.periodStart) : undefined,
        periodEnd: dto.periodEnd ? new Date(dto.periodEnd) : undefined,
        notes: dto.notes,
        reportedById: user.sub,
      },
      select: ENTRY_SELECT,
    });

    await this.prisma.auditEvent.create({
      data: {
        action: 'EMISSION_ENTRY_CREATE',
        userId: user.sub,
        entityType: 'EmissionEntry',
        entityId: entry.id,
        meta: { sourceId, pollutant: dto.pollutant, value: dto.value, unit: dto.unit },
      },
    });

    return entry;
  }

  listEntries(
    sourceId: string,
    pollutant?: PollutantType,
    rawPage = 1,
    rawPageSize = 20,
  ) {
    const { page, pageSize } = clampPagination(rawPage, rawPageSize);
    const where = {
      sourceId,
      ...(pollutant ? { pollutant } : {}),
    };
    return Promise.all([
      this.prisma.emissionEntry.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: ENTRY_SELECT,
      }),
      this.prisma.emissionEntry.count({ where }),
    ]).then(([data, total]) => ({ data, total, page, pageSize }));
  }
}
