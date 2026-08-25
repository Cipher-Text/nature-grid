import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { clampPagination } from '../common/pagination';

const USER_SELECT = {
  id: true,
  email: true,
  displayName: true,
  role: true,
  isActive: true,
  createdAt: true,
  lastLoginAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  list(rawPage = 1, rawPageSize = 20) {
    const { page, pageSize } = clampPagination(rawPage, rawPageSize);
    const skip = (page - 1) * pageSize;
    return Promise.all([
      this.prisma.user.findMany({ skip, take: pageSize, select: USER_SELECT, orderBy: { createdAt: 'desc' } }),
      this.prisma.user.count(),
    ]).then(([data, total]) => ({ data, total, page, pageSize }));
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: USER_SELECT });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateRole(id: string, role: UserRole, actor: JwtPayload) {
    const user = await this.getById(id);

    const [updated] = await this.prisma.$transaction([
      this.prisma.user.update({ where: { id }, data: { role }, select: USER_SELECT }),
      this.prisma.auditEvent.create({
        data: {
          action: 'USER_ROLE_CHANGE',
          userId: actor.sub,
          entityType: 'User',
          entityId: id,
          meta: { from: user.role, to: role },
        },
      }),
    ]);
    return updated;
  }

  async deactivate(id: string, actor: JwtPayload) {
    if (id === actor.sub) throw new BadRequestException('Cannot deactivate yourself');
    const user = await this.getById(id);

    const [updated] = await this.prisma.$transaction([
      this.prisma.user.update({ where: { id }, data: { isActive: false }, select: USER_SELECT }),
      this.prisma.auditEvent.create({
        data: {
          action: 'USER_DEACTIVATE',
          userId: actor.sub,
          entityType: 'User',
          entityId: id,
          meta: { wasActive: user.isActive },
        },
      }),
    ]);
    return updated;
  }
}
