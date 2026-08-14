import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

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

  list(page = 1, pageSize = 20) {
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

  async updateRole(id: string, role: UserRole) {
    await this.getById(id);
    return this.prisma.user.update({ where: { id }, data: { role }, select: USER_SELECT });
  }

  async deactivate(id: string) {
    await this.getById(id);
    return this.prisma.user.update({ where: { id }, data: { isActive: false }, select: USER_SELECT });
  }
}
