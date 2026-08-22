import { Injectable, NotFoundException } from '@nestjs/common';
import { ObservationCategory, ObservationTrustLevel } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateObservationDto } from './dto/create-observation.dto';
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

@Injectable()
export class ObservationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateObservationDto, user: JwtPayload) {
    const observation = await this.prisma.observation.create({
      data: {
        category: dto.category,
        description: dto.description,
        districtId: dto.districtId,
        lat: dto.lat,
        lng: dto.lng,
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

  listMine(userId: string, page = 1, pageSize = 10) {
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
    page = 1,
    pageSize = 20,
  ) {
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
}
