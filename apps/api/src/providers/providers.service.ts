import { Injectable, NotFoundException } from '@nestjs/common';
import { ProviderType } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

const PROVIDER_SELECT = {
  id: true,
  name: true,
  type: true,
  country: true,
  isActive: true,
  organization: { select: { id: true, name: true } },
} as const;

@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  list(type?: ProviderType, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const where = {
      isActive: true,
      ...(type ? { type } : {}),
    };
    return Promise.all([
      this.prisma.provider.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { name: 'asc' },
        select: PROVIDER_SELECT,
      }),
      this.prisma.provider.count({ where }),
    ]).then(([data, total]) => ({ data, total, page, pageSize }));
  }

  async getById(id: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { id },
      include: {
        organization: { select: { id: true, name: true } },
        datasets: { select: { id: true, name: true, category: true } },
      },
    });
    if (!provider) throw new NotFoundException('Provider not found');
    return provider;
  }
}
