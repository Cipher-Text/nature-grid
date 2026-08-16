import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../database/prisma.service';

const RETENTION_DAYS = 30;

@Injectable()
export class RefreshTokenCleanupScheduler {
  private readonly logger = new Logger(RefreshTokenCleanupScheduler.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Deletes refresh tokens that expired more than RETENTION_DAYS ago (revoked or not). */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupExpiredTokens() {
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
    const { count } = await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: cutoff } },
    });
    if (count > 0) {
      this.logger.log(`Cleaned up ${count} expired refresh tokens`);
    }
  }
}
