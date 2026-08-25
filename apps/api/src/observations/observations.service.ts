import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ObservationCategory, ObservationTrustLevel } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { UpdateObservationTrustDto } from './dto/update-trust.dto';
import type { JwtPayload } from '../common/decorators/current-user.decorator';

const OBSERVATION_SELECT = {
  id: true,
  category: true,
  trustLevel: true,
  description: true,
  districtId: true,
  lat: true,
  lng: true,
  species: true,
  observedAt: true,
  createdAt: true,
  updatedAt: true,
  observer: { select: { id: true, displayName: true } },
  district: { select: { id: true, name: true, division: { select: { id: true, name: true } } } },
} as const;

/** Clamp page/pageSize to safe ranges to prevent negative skips or runaway queries. */
function clampPagination(page: number, pageSize: number, maxPageSize = 100) {
  return {
    page: Math.max(1, isFinite(page) ? page : 1),
    pageSize: Math.min(Math.max(1, isFinite(pageSize) ? pageSize : 20), maxPageSize),
  };
}

@Injectable()
export class ObservationsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertDistrictExists(districtId: string) {
    const exists = await this.prisma.district.findUnique({ where: { id: districtId }, select: { id: true } });
    if (!exists) throw new BadRequestException('District not found');
  }

  async create(dto: CreateObservationDto, user: JwtPayload) {
    if (dto.districtId) await this.assertDistrictExists(dto.districtId);

    if (dto.observedAt && new Date(dto.observedAt) > new Date()) {
      throw new BadRequestException('observedAt cannot be in the future');
    }

    const observation = await this.prisma.observation.create({
      data: {
        category: dto.category,
        description: dto.description,
        districtId: dto.districtId,
        lat: dto.lat,
        lng: dto.lng,
        species: dto.species,
        observedAt: dto.observedAt ? new Date(dto.observedAt) : undefined,
        observerId: user.sub,
        trustLevel: ObservationTrustLevel.UNVERIFIED,
      },
      select: OBSERVATION_SELECT,
    });

    await this.prisma.auditEvent.create({
      data: {
        action: 'OBSERVATION_SUBMIT',
        userId: user.sub,
        entityType: 'Observation',
        entityId: observation.id,
      },
    });

    return observation;
  }

  listMine(userId: string, rawPage = 1, rawPageSize = 10) {
    const { page, pageSize } = clampPagination(rawPage, rawPageSize);
    const skip = (page - 1) * pageSize;
    return Promise.all([
      this.prisma.observation.findMany({
        where: { observerId: userId },
        skip,
        take: pageSize,
        orderBy: { observedAt: 'desc' },
        select: OBSERVATION_SELECT,
      }),
      this.prisma.observation.count({ where: { observerId: userId } }),
    ]).then(([data, total]) => ({ data, total, page, pageSize }));
  }

  list(
    category?: ObservationCategory,
    trustLevel?: ObservationTrustLevel,
    districtId?: string,
    rawPage = 1,
    rawPageSize = 20,
  ) {
    const { page, pageSize } = clampPagination(rawPage, rawPageSize);
    const skip = (page - 1) * pageSize;
    const where = {
      ...(category ? { category } : {}),
      ...(trustLevel ? { trustLevel } : { trustLevel: { not: ObservationTrustLevel.FLAGGED } }),
      ...(districtId ? { districtId } : {}),
    };
    return Promise.all([
      this.prisma.observation.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { observedAt: 'desc' },
        select: OBSERVATION_SELECT,
      }),
      this.prisma.observation.count({ where }),
    ]).then(([data, total]) => ({ data, total, page, pageSize }));
  }

  async getById(id: string) {
    const observation = await this.prisma.observation.findUnique({
      where: { id },
      select: OBSERVATION_SELECT,
    });
    if (!observation) throw new NotFoundException('Observation not found');
    return observation;
  }

  /** Owner-only: edit description, location, species, or observedAt of an UNVERIFIED observation. */
  async update(id: string, dto: UpdateObservationDto, user: JwtPayload) {
    const observation = await this.getById(id);

    if (observation.observer?.id !== user.sub) {
      throw new ForbiddenException('You can only edit your own observations');
    }
    if (observation.trustLevel !== ObservationTrustLevel.UNVERIFIED) {
      throw new ForbiddenException('Only UNVERIFIED observations can be edited');
    }
    if (dto.districtId) await this.assertDistrictExists(dto.districtId);
    if (dto.observedAt && new Date(dto.observedAt) > new Date()) {
      throw new BadRequestException('observedAt cannot be in the future');
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.observation.update({
        where: { id },
        data: {
          ...(dto.description !== undefined && { description: dto.description }),
          ...(dto.districtId !== undefined && { districtId: dto.districtId }),
          ...(dto.lat !== undefined && { lat: dto.lat }),
          ...(dto.lng !== undefined && { lng: dto.lng }),
          ...(dto.species !== undefined && { species: dto.species }),
          ...(dto.observedAt !== undefined && { observedAt: new Date(dto.observedAt) }),
        },
        select: OBSERVATION_SELECT,
      }),
      this.prisma.auditEvent.create({
        data: {
          action: 'OBSERVATION_UPDATE',
          userId: user.sub,
          entityType: 'Observation',
          entityId: id,
        },
      }),
    ]);

    return updated;
  }

  async updateTrust(id: string, dto: UpdateObservationTrustDto, actor: JwtPayload) {
    const observation = await this.getById(id);

    const [updated] = await this.prisma.$transaction([
      this.prisma.observation.update({
        where: { id },
        data: { trustLevel: dto.trustLevel },
        select: OBSERVATION_SELECT,
      }),
      this.prisma.auditEvent.create({
        data: {
          action: 'OBSERVATION_TRUST_CHANGE',
          userId: actor.sub,
          entityType: 'Observation',
          entityId: id,
          meta: { from: observation.trustLevel, to: dto.trustLevel },
        },
      }),
    ]);

    return updated;
  }

  /** MODERATOR/ADMIN: permanently remove an observation. */
  async delete(id: string, actor: JwtPayload) {
    await this.getById(id); // throws 404 if not found

    await this.prisma.$transaction([
      this.prisma.observation.delete({ where: { id } }),
      this.prisma.auditEvent.create({
        data: {
          action: 'OBSERVATION_DELETE',
          userId: actor.sub,
          entityType: 'Observation',
          entityId: id,
        },
      }),
    ]);
  }
}
