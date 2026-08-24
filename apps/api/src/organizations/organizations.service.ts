import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationMemberRole, OrganizationType } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

const ORG_SELECT = {
  id: true,
  name: true,
  type: true,
  description: true,
  website: true,
  country: true,
  isVerified: true,
  createdAt: true,
} as const;

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  manageList() {
    return this.prisma.organization.findMany({
      orderBy: { name: 'asc' },
      include: {
        memberships: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { id: true, displayName: true, email: true, isActive: true } } },
        },
      },
    });
  }

  create(dto: { name: string; type: OrganizationType; description?: string; website?: string; country?: string }) {
    return this.prisma.organization.create({
      data: {
        name: dto.name,
        type: dto.type,
        description: dto.description,
        website: dto.website,
        country: dto.country ?? 'Bangladesh',
      },
    });
  }

  async upsertMembership(organizationId: string, dto: { userId: string; role: OrganizationMemberRole }) {
    const [organization, user] = await Promise.all([
      this.prisma.organization.findUnique({ where: { id: organizationId }, select: { id: true } }),
      this.prisma.user.findUnique({ where: { id: dto.userId }, select: { id: true } }),
    ]);
    if (!organization) throw new BadRequestException('Organization not found');
    if (!user) throw new BadRequestException('User not found');

    return this.prisma.organizationMembership.upsert({
      where: { organizationId_userId: { organizationId, userId: dto.userId } },
      create: { organizationId, userId: dto.userId, role: dto.role },
      update: { role: dto.role },
      include: { user: { select: { id: true, displayName: true, email: true, isActive: true } } },
    });
  }

  async removeMembership(organizationId: string, userId: string) {
    return this.prisma.organizationMembership.delete({
      where: { organizationId_userId: { organizationId, userId } },
    });
  }

  list(type?: OrganizationType, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    return Promise.all([
      this.prisma.organization.findMany({
        where: type ? { type } : undefined,
        skip,
        take: pageSize,
        orderBy: { name: 'asc' },
        select: ORG_SELECT,
      }),
      this.prisma.organization.count({ where: type ? { type } : undefined }),
    ]).then(([data, total]) => ({ data, total, page, pageSize }));
  }

  async getById(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: { providers: { select: { id: true, name: true, type: true, isActive: true } } },
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }
}
