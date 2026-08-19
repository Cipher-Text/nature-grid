import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ProjectStatus, RestorationCategory } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateRestorationProjectDto } from './dto/create-restoration-project.dto';
import { UpdateRestorationProjectDto } from './dto/update-restoration-project.dto';
import type { JwtPayload } from '../common/decorators/current-user.decorator';

const PROJECT_SELECT = {
  id: true,
  title: true,
  description: true,
  category: true,
  status: true,
  organizationId: true,
  districtId: true,
  startDate: true,
  endDate: true,
  impactSummary: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  organization: { select: { id: true, name: true } },
  district: { select: { id: true, name: true, division: { select: { id: true, name: true } } } },
  _count: { select: { participants: true } },
} as const;

@Injectable()
export class RestorationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRestorationProjectDto, user: JwtPayload) {
    const project = await this.prisma.restorationProject.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        organizationId: dto.organizationId,
        districtId: dto.districtId,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        impactSummary: dto.impactSummary,
        createdById: user.sub,
      },
      select: PROJECT_SELECT,
    });

    await this.prisma.auditEvent.create({
      data: {
        action: 'RESTORATION_PROJECT_CREATE',
        userId: user.sub,
        entityType: 'RestorationProject',
        entityId: project.id,
      },
    });

    return project;
  }

  list(category?: RestorationCategory, status?: ProjectStatus, districtId?: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const where = {
      ...(category ? { category } : {}),
      ...(status ? { status } : {}),
      ...(districtId ? { districtId } : {}),
    };
    return Promise.all([
      this.prisma.restorationProject.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: PROJECT_SELECT,
      }),
      this.prisma.restorationProject.count({ where }),
    ]).then(([data, total]) => ({ data, total, page, pageSize }));
  }

  async getById(id: string) {
    const project = await this.prisma.restorationProject.findUnique({
      where: { id },
      select: PROJECT_SELECT,
    });
    if (!project) throw new NotFoundException('Restoration project not found');
    return project;
  }

  async update(id: string, dto: UpdateRestorationProjectDto, actor: JwtPayload) {
    const project = await this.getById(id);
    if (project.createdById !== actor.sub && actor.role !== 'ADMIN') {
      throw new ForbiddenException('Only the project creator or an admin can update this project');
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.restorationProject.update({
        where: { id },
        data: {
          ...(dto.status ? { status: dto.status } : {}),
          ...(dto.impactSummary !== undefined ? { impactSummary: dto.impactSummary } : {}),
          ...(dto.endDate ? { endDate: new Date(dto.endDate) } : {}),
        },
        select: PROJECT_SELECT,
      }),
      this.prisma.auditEvent.create({
        data: {
          action: 'RESTORATION_PROJECT_UPDATE',
          userId: actor.sub,
          entityType: 'RestorationProject',
          entityId: id,
          meta: { ...dto },
        },
      }),
    ]);

    return updated;
  }

  async join(id: string, user: JwtPayload) {
    await this.getById(id);

    try {
      await this.prisma.restorationParticipant.create({
        data: { projectId: id, userId: user.sub },
      });
      await this.prisma.auditEvent.create({
        data: {
          action: 'RESTORATION_PROJECT_JOIN',
          userId: user.sub,
          entityType: 'RestorationProject',
          entityId: id,
        },
      });
    } catch (err) {
      if (!(err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002')) {
        throw err;
      }
      // Already joined — idempotent no-op.
    }

    return this.getById(id);
  }
}
