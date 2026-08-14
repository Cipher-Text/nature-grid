import { Injectable, NotFoundException } from '@nestjs/common';
import { ProviderType } from '@prisma/client';
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

  list(type?: ProviderType, page = 1, pageSize = 20) {
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
