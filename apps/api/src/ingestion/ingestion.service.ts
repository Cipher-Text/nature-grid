import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { DatasetCategory, IngestionStatus } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { clampPagination } from '../common/pagination';

const JOB_SELECT = {
  id: true,
  status: true,
  startedAt: true,
  endedAt: true,
  errorMsg: true,
  createdAt: true,
  updatedAt: true,
  provider: { select: { id: true, name: true, type: true } },
} as const;

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async startJob(providerId: string): Promise<string> {
    const job = await this.prisma.ingestionJob.create({
      data: { providerId, status: 'RUNNING', startedAt: new Date() },
      select: { id: true },
    });
    return job.id;
  }

  async completeJob(jobId: string, categories?: DatasetCategory[]): Promise<void> {
    await this.prisma.ingestionJob.update({
      where: { id: jobId },
      data: { status: 'SUCCEEDED', endedAt: new Date() },
    });
    if (categories?.length) {
      await this.prisma.dataset.updateMany({
        where: { category: { in: categories } },
        data: { lastSyncedAt: new Date() },
      });
    }
  }

  async failJob(jobId: string, errorMsg: string): Promise<void> {
    await this.prisma.ingestionJob.update({
      where: { id: jobId },
      data: { status: 'FAILED', endedAt: new Date(), errorMsg: String(errorMsg).slice(0, 1000) },
    });
  }

  /** Look up a provider by name — returns null if not found (job tracking gracefully skipped). */
  async findProviderIdByName(name: string): Promise<string | null> {
    const provider = await this.prisma.provider.findFirst({
      where: { name },
      select: { id: true },
    });
    return provider?.id ?? null;
  }

  list(status?: IngestionStatus, providerId?: string, rawPage = 1, rawPageSize = 20) {
    const { page, pageSize } = clampPagination(rawPage, rawPageSize);
    const skip = (page - 1) * pageSize;
    const where = {
      ...(status ? { status } : {}),
      ...(providerId ? { providerId } : {}),
    };
    return Promise.all([
      this.prisma.ingestionJob.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: JOB_SELECT,
      }),
      this.prisma.ingestionJob.count({ where }),
    ]).then(([data, total]) => ({ data, total, page, pageSize }));
  }

  async getById(id: string) {
    const job = await this.prisma.ingestionJob.findUnique({
      where: { id },
      select: JOB_SELECT,
    });
    if (!job) throw new NotFoundException('Ingestion job not found');
    return job;
  }
}
