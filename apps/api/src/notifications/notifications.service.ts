import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AlertSeverity, AlertStatus, DeliveryStatus, NotificationChannel } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { EmailService, type AlertForEmail } from './email.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

/**
 * Which subscription minSeverity values qualify for a given alert severity.
 *
 * A subscriber with minSeverity WARNING means "only send WARNING and above",
 * so their minSeverity must be <= the alert's severity to match.
 *
 * Example: alert is EMERGENCY → minSeverity values INFO, WATCH, WARNING,
 * and EMERGENCY all qualify. Alert is INFO → only INFO qualifies.
 */
const QUALIFYING_MIN_SEVERITIES: Record<AlertSeverity, AlertSeverity[]> = {
  INFO:      ['INFO'],
  WATCH:     ['INFO', 'WATCH'],
  WARNING:   ['INFO', 'WATCH', 'WARNING'],
  EMERGENCY: ['INFO', 'WATCH', 'WARNING', 'EMERGENCY'],
};

const SUBSCRIPTION_SELECT = {
  id: true,
  userId: true,
  districtId: true,
  channel: true,
  minSeverity: true,
  createdAt: true,
  district: { select: { id: true, name: true } },
} as const;

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {}

  async subscribe(userId: string, dto: CreateSubscriptionDto) {
    const channel = dto.channel ?? NotificationChannel.EMAIL;
    const districtId = dto.districtId ?? null;

    // Postgres treats NULL != NULL in unique indexes, so we enforce uniqueness
    // at the application level for the (userId, districtId, channel) triple.
    const existing = await this.prisma.alertSubscription.findFirst({
      where: { userId, districtId, channel },
    });
    if (existing) {
      throw new ConflictException(
        districtId
          ? 'You already have a subscription for this district and channel'
          : 'You already have a nationwide subscription for this channel',
      );
    }

    return this.prisma.alertSubscription.create({
      data: {
        userId,
        districtId,
        channel,
        minSeverity: dto.minSeverity ?? AlertSeverity.INFO,
      },
      select: SUBSCRIPTION_SELECT,
    });
  }

  listSubscriptions(userId: string) {
    return this.prisma.alertSubscription.findMany({
      where: { userId },
      select: SUBSCRIPTION_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  async unsubscribe(id: string, userId: string): Promise<void> {
    const existing = await this.prisma.alertSubscription.findFirst({
      where: { id, userId },
    });
    if (!existing) throw new NotFoundException('Subscription not found');
    await this.prisma.alertSubscription.deleteMany({ where: { id, userId } });
  }

  /**
   * Fire-and-forget entry point called from AlertsService.
   * Does not throw — all errors are caught and logged internally.
   */
  dispatchForAlert(alertId: string): void {
    void this.runDispatch(alertId).catch((err) =>
      this.logger.error(`Dispatch failed for alert ${alertId}: ${String(err)}`),
    );
  }

  private async runDispatch(alertId: string): Promise<void> {
    const alert = await this.prisma.alert.findUnique({
      where: { id: alertId },
      select: {
        id: true,
        title: true,
        severity: true,
        status: true,
        description: true,
        instructions: true,
        issuedAt: true,
        districtId: true,
        district: { select: { name: true } },
      },
    });

    if (!alert || alert.status !== AlertStatus.ACTIVE) return;

    const qualifyingMinSeverities = QUALIFYING_MIN_SEVERITIES[alert.severity];

    // Find subscriptions that match:
    // 1. The alert's district (or global subscriptions that have no district)
    // 2. The alert's severity meets the subscriber's threshold
    // 3. The subscriber's account is still active
    const subscriptions = await this.prisma.alertSubscription.findMany({
      where: {
        minSeverity: { in: qualifyingMinSeverities },
        OR: [
          { districtId: null },                                                   // global
          ...(alert.districtId ? [{ districtId: alert.districtId }] : []),        // district-specific
        ],
        user: { isActive: true },
      },
      select: {
        id: true,
        userId: true,
        channel: true,
        user: { select: { id: true, email: true, displayName: true } },
      },
      orderBy: { createdAt: 'asc' }, // deterministic: earliest subscription wins for dedup
    });

    // Deduplicate: a user may have both a global and a district-specific subscription
    // matching the same alert. Send only once per user.
    const seen = new Set<string>();
    for (const sub of subscriptions) {
      if (seen.has(sub.userId)) continue;
      seen.add(sub.userId);
      await this.sendToUser(sub, alert);
    }

    this.logger.log(
      `Alert ${alertId} dispatched to ${seen.size} subscriber(s) (${subscriptions.length} matching subscriptions)`,
    );
  }

  private async sendToUser(
    subscription: {
      id: string;
      channel: NotificationChannel;
      user: { id: string; email: string; displayName: string };
    },
    alert: AlertForEmail & { id: string; status: AlertStatus; districtId: string | null },
  ): Promise<void> {
    const delivery = await this.prisma.notificationDelivery.create({
      data: {
        subscriptionId: subscription.id,
        alertId: alert.id,
        userId: subscription.user.id,
        channel: subscription.channel,
        // Capture the address at send time — preserved if the user changes email later.
        address: subscription.user.email,
        status: DeliveryStatus.PENDING,
      },
    });

    try {
      await this.email.sendAlertEmail(
        subscription.user.email,
        subscription.user.displayName,
        alert,
      );
      await this.prisma.notificationDelivery.update({
        where: { id: delivery.id },
        data: { status: DeliveryStatus.SENT, sentAt: new Date() },
      });
    } catch (err) {
      const error = String(err instanceof Error ? err.message : err);
      this.logger.error(`Email to ${subscription.user.email} failed: ${error}`);
      await this.prisma.notificationDelivery.update({
        where: { id: delivery.id },
        data: { status: DeliveryStatus.FAILED, failedAt: new Date(), error },
      });
    }
  }
}
