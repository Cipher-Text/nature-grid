import { Injectable, NotFoundException } from '@nestjs/common';
import { AlertStatus, AlertSeverity } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { clampPagination } from '../common/pagination';
import { assertDistrictExists } from '../common/validate-district';

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  list(status?: AlertStatus, severity?: AlertSeverity, districtId?: string, rawPage = 1, rawPageSize = 20) {
    const { page, pageSize } = clampPagination(rawPage, rawPageSize);
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
      select: ALERT_SELECT,
    });
    if (!alert) throw new NotFoundException('Alert not found');
    return alert;
  }

  async create(dto: CreateAlertDto, actor: JwtPayload) {
    if (dto.districtId) await assertDistrictExists(this.prisma, dto.districtId);

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
    // Dispatch is fire-and-forget: delivery failures must not fail the HTTP response.
    this.notifications.dispatchForAlert(alert.id);
    return alert;
  }

  async update(id: string, dto: UpdateAlertDto, actor: JwtPayload) {
    const existing = await this.getById(id);
    const updated = await this.prisma.alert.update({
      where: { id },
      data: {
        ...(dto.status ? { status: dto.status } : {}),
        ...(dto.instructions ? { instructions: dto.instructions } : {}),
        ...(dto.expiresAt ? { expiresAt: new Date(dto.expiresAt) } : {}),
      },
      select: ALERT_SELECT,
    });

    await this.prisma.auditEvent.create({
      data: {
        action: 'ALERT_STATUS_CHANGE',
        userId: actor.sub,
        entityType: 'Alert',
        entityId: id,
        meta: {
          ...(dto.status ? { from: existing.status, to: dto.status } : {}),
          ...(dto.instructions ? { instructionsUpdated: true } : {}),
          ...(dto.expiresAt ? { expiresAt: dto.expiresAt } : {}),
        },
      },
    });

    // Dispatch when a DRAFT alert is manually activated.
    if (dto.status === AlertStatus.ACTIVE) {
      this.notifications.dispatchForAlert(id);
    }
    return updated;
  }
}
