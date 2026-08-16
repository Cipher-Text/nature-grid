import { Injectable, NotFoundException } from '@nestjs/common';
import { AlertStatus, AlertSeverity } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import type { JwtPayload } from '../common/decorators/current-user.decorator';

const ALERT_SELECT = {
  id: true,
  title: true,
  description: true,
  severity: true,
  status: true,
  instructions: true,
  issuedAt: true,
  expiresAt: true,
  createdAt: true,
  district: { select: { id: true, name: true, division: { select: { id: true, name: true } } } },
} as const;

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  list(status?: AlertStatus, severity?: AlertSeverity, districtId?: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const where = {
      ...(status ? { status } : { status: AlertStatus.ACTIVE }),
      ...(severity ? { severity } : {}),
      ...(districtId ? { districtId } : {}),
    };
    return Promise.all([
      this.prisma.alert.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ severity: 'desc' }, { issuedAt: 'desc' }],
        select: ALERT_SELECT,
      }),
      this.prisma.alert.count({ where }),
    ]).then(([data, total]) => ({ data, total, page, pageSize }));
  }

  async getById(id: string) {
    const alert = await this.prisma.alert.findUnique({
      where: { id },
      include: {
        district: { select: { id: true, name: true, division: { select: { id: true, name: true } } } },
      },
    });
    if (!alert) throw new NotFoundException('Alert not found');
    return alert;
  }

  async create(dto: CreateAlertDto, actor: JwtPayload) {
    const alert = await this.prisma.alert.create({
      data: {
        title: dto.title,
        severity: dto.severity,
        description: dto.description,
        instructions: dto.instructions,
        districtId: dto.districtId,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        status: AlertStatus.ACTIVE,
      },
      select: ALERT_SELECT,
    });
    await this.prisma.auditEvent.create({
      data: {
        action: 'ALERT_CREATE',
        userId: actor.sub,
        entityType: 'Alert',
        entityId: alert.id,
      },
    });
    return alert;
  }

  async update(id: string, dto: UpdateAlertDto, actor: JwtPayload) {
    await this.getById(id);
    const updated = await this.prisma.alert.update({
      where: { id },
      data: {
        ...(dto.status ? { status: dto.status } : {}),
        ...(dto.instructions ? { instructions: dto.instructions } : {}),
        ...(dto.expiresAt ? { expiresAt: new Date(dto.expiresAt) } : {}),
      },
      select: ALERT_SELECT,
    });
    if (dto.status) {
      await this.prisma.auditEvent.create({
        data: {
          action: 'ALERT_STATUS_CHANGE',
          userId: actor.sub,
          entityType: 'Alert',
          entityId: id,
          meta: { status: dto.status },
        },
      });
    }
    return updated;
  }
}
