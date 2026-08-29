import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ReportStatus, ReportCategory } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-status.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AddMediaDto } from './dto/add-media.dto';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { clampPagination } from '../common/pagination';
import { assertDistrictExists } from '../common/validate-district';
import { GamificationService } from '../gamification/gamification.service';

/** Allowed status transitions per role. */
const STATUS_TRANSITIONS: Record<ReportStatus, ReportStatus[]> = {
  SUBMITTED:    ['UNDER_REVIEW'],
  UNDER_REVIEW: ['VERIFIED', 'REJECTED'],
  VERIFIED:     ['RESOLVED'],
  REJECTED:     [],
  RESOLVED:     [],
};

const REPORT_SELECT = {
  id: true,
  title: true,
  description: true,
  category: true,
  status: true,
  summary: true,
  districtId: true,
  lat: true,
  lng: true,
  createdAt: true,
  updatedAt: true,
  reporter: { select: { id: true, displayName: true } },
  district: { select: { id: true, name: true, division: { select: { id: true, name: true } } } },
} as const;

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gamification: GamificationService,
  ) {}

  async create(dto: CreateReportDto, user: JwtPayload) {
    if (dto.districtId) await assertDistrictExists(this.prisma, dto.districtId);

    return this.prisma.$transaction(async (tx) => {
      const report = await tx.citizenReport.create({
        data: {
          title: dto.title,
          category: dto.category,
          description: dto.description,
          districtId: dto.districtId,
          lat: dto.lat,
          lng: dto.lng,
          reporterId: user.sub,
          statusHistory: {
            create: { status: ReportStatus.SUBMITTED },
          },
        },
        select: REPORT_SELECT,
      });

      await tx.auditEvent.create({
        data: {
          action: 'REPORT_SUBMIT',
          userId: user.sub,
          entityType: 'CitizenReport',
          entityId: report.id,
        },
      });

      return report;
    });
  }

  listMine(userId: string, rawPage = 1, rawPageSize = 10) {
    const { page, pageSize } = clampPagination(rawPage, rawPageSize);
    const skip = (page - 1) * pageSize;
    return Promise.all([
      this.prisma.citizenReport.findMany({
        where: { reporterId: userId },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: REPORT_SELECT,
      }),
      this.prisma.citizenReport.count({ where: { reporterId: userId } }),
    ]).then(([data, total]) => ({ data, total, page, pageSize }));
  }

  list(status?: ReportStatus, category?: ReportCategory, districtId?: string, rawPage = 1, rawPageSize = 20) {
    const { page, pageSize } = clampPagination(rawPage, rawPageSize);
    const skip = (page - 1) * pageSize;
    // Public view: only verified/resolved reports
    const where = {
      ...(status ? { status } : { status: { in: [ReportStatus.VERIFIED, ReportStatus.RESOLVED] } }),
      ...(category ? { category } : {}),
      ...(districtId ? { districtId } : {}),
    };
    return Promise.all([
      this.prisma.citizenReport.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: REPORT_SELECT,
      }),
      this.prisma.citizenReport.count({ where }),
    ]).then(([data, total]) => ({ data, total, page, pageSize }));
  }

  async getById(id: string) {
    const report = await this.prisma.citizenReport.findUnique({
      where: { id },
      select: {
        ...REPORT_SELECT,
        // Detail endpoint additionally exposes the status audit trail.
        // Not part of the list contract but useful for the detail view.
        statusHistory: {
          select: { id: true, status: true, note: true, createdAt: true },
          orderBy: { createdAt: 'desc' as const },
        },
      },
    });
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  async listComments(id: string, includeInternal: boolean) {
    await this.getById(id);
    return this.prisma.reportComment.findMany({
      where: {
        reportId: id,
        ...(includeInternal ? {} : { isInternal: false }),
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        body: true,
        isInternal: true,
        createdAt: true,
        author: { select: { id: true, displayName: true } },
      },
    });
  }

  async addComment(id: string, dto: CreateCommentDto, actor: JwtPayload) {
    await this.getById(id);
    const canMarkInternal = actor.role === 'MODERATOR' || actor.role === 'ADMIN';
    const isInternal = canMarkInternal ? (dto.isInternal ?? false) : false;

    return this.prisma.$transaction(async (tx) => {
      const comment = await tx.reportComment.create({
        data: {
          reportId: id,
          authorId: actor.sub,
          body: dto.body,
          isInternal,
        },
        select: {
          id: true,
          body: true,
          isInternal: true,
          createdAt: true,
          author: { select: { id: true, displayName: true } },
        },
      });

      await tx.auditEvent.create({
        data: {
          action: 'REPORT_COMMENT_ADD',
          userId: actor.sub,
          entityType: 'CitizenReport',
          entityId: id,
          meta: { commentId: comment.id, isInternal },
        },
      });

      return comment;
    });
  }

  async listMedia(id: string) {
    await this.getById(id);
    return this.prisma.reportMedia.findMany({
      where: { reportId: id },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        url: true,
        mimeType: true,
        fileSize: true,
        caption: true,
        createdAt: true,
        uploadedBy: { select: { id: true, displayName: true } },
      },
    });
  }

  async addMedia(id: string, dto: AddMediaDto, actor: JwtPayload) {
    await this.getById(id);

    return this.prisma.$transaction(async (tx) => {
      const media = await tx.reportMedia.create({
        data: {
          reportId: id,
          uploadedById: actor.sub,
          url: dto.url,
          mimeType: dto.mimeType,
          fileSize: dto.fileSize,
          caption: dto.caption,
        },
        select: {
          id: true,
          url: true,
          mimeType: true,
          fileSize: true,
          caption: true,
          createdAt: true,
          uploadedBy: { select: { id: true, displayName: true } },
        },
      });

      await tx.auditEvent.create({
        data: {
          action: 'REPORT_MEDIA_ADD',
          userId: actor.sub,
          entityType: 'CitizenReport',
          entityId: id,
          meta: { mediaId: media.id, mimeType: dto.mimeType ?? null },
        },
      });

      return media;
    });
  }

  async updateStatus(id: string, dto: UpdateReportStatusDto, actor: JwtPayload) {
    const report = await this.getById(id);
    const allowed = STATUS_TRANSITIONS[report.status];
    if (!allowed.includes(dto.status)) {
      throw new ForbiddenException(
        `Cannot transition from ${report.status} to ${dto.status}`,
      );
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.citizenReport.update({
        where: { id },
        data: {
          status: dto.status,
          ...(dto.status === ReportStatus.RESOLVED ? { resolvedAt: new Date() } : {}),
        },
        select: REPORT_SELECT,
      }),
      this.prisma.reportStatusEvent.create({
        data: { reportId: id, status: dto.status, note: dto.note },
      }),
      this.prisma.auditEvent.create({
        data: {
          action: 'REPORT_STATUS_CHANGE',
          userId: actor.sub,
          entityType: 'CitizenReport',
          entityId: id,
          meta: { from: report.status, to: dto.status },
        },
      }),
    ]);
    // Award civic_guardian / clean_air_defender badges when a report is verified or resolved.
    if (
      (dto.status === ReportStatus.VERIFIED || dto.status === ReportStatus.RESOLVED) &&
      report.reporter?.id
    ) {
      this.gamification.evaluateBadges(report.reporter.id).catch(() => {});
    }

    return updated;
  }
}
