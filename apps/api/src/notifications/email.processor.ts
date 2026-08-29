import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { DeliveryStatus, type AlertSeverity } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { EmailService, type AlertForEmail } from './email.service';

export const EMAIL_QUEUE = 'email';

/** Job sent when a user requests a password reset. */
export interface PasswordResetJobData {
  to: string;
  displayName: string;
  resetUrl: string;
}

/** Job sent when a new user registration needs email verification. */
export interface EmailVerificationJobData {
  to: string;
  displayName: string;
  verificationUrl: string;
}

/**
 * Job sent once per subscriber when an alert is dispatched.
 * The delivery record (status=PENDING) is created before the job is enqueued
 * so the dispatch is auditable even if the queue is backlogged.
 */
export interface AlertNotificationJobData {
  deliveryId: string;
  to: string;
  displayName: string;
  /** Alert snapshot at dispatch time — avoids an extra DB round-trip in the processor. */
  alert: {
    id: string;
    title: string;
    severity: AlertSeverity;
    description: string;
    instructions: string | null;
    issuedAt: string; // ISO-8601 string (Date is not JSON-serialisable)
    district: { name: string } | null;
  };
}

@Processor(EMAIL_QUEUE)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(
    private readonly email: EmailService,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case 'password-reset':
        return this.handlePasswordReset(job.data as PasswordResetJobData);
      case 'email-verification':
        return this.handleEmailVerification(job.data as EmailVerificationJobData);
      case 'alert-notification':
        return this.handleAlertNotification(job.data as AlertNotificationJobData);
      default:
        this.logger.warn(`Unknown email job type: ${job.name}`);
    }
  }

  private async handlePasswordReset(data: PasswordResetJobData): Promise<void> {
    await this.email.sendPasswordResetEmail(data.to, data.displayName, data.resetUrl);
    this.logger.debug(`Password-reset email sent to ${data.to}`);
  }

  private async handleEmailVerification(data: EmailVerificationJobData): Promise<void> {
    await this.email.sendVerificationEmail(data.to, data.displayName, data.verificationUrl);
    this.logger.debug(`Verification email sent to ${data.to}`);
  }

  private async handleAlertNotification(data: AlertNotificationJobData): Promise<void> {
    // Idempotency guard — the job may be retried after a partial success where the
    // email was sent but the DB update failed. Skip if already recorded as SENT.
    const delivery = await this.prisma.notificationDelivery.findUnique({
      where: { id: data.deliveryId },
      select: { id: true, status: true },
    });
    if (!delivery || delivery.status === DeliveryStatus.SENT) return;

    const alert: AlertForEmail = {
      id: data.alert.id,
      title: data.alert.title,
      severity: data.alert.severity,
      description: data.alert.description,
      instructions: data.alert.instructions,
      issuedAt: new Date(data.alert.issuedAt),
      district: data.alert.district,
    };

    try {
      await this.email.sendAlertEmail(data.to, data.displayName, alert);
      await this.prisma.notificationDelivery.update({
        where: { id: data.deliveryId },
        data: { status: DeliveryStatus.SENT, sentAt: new Date() },
      });
    } catch (err) {
      const error = String(err instanceof Error ? err.message : err);
      this.logger.error(`Alert email to ${data.to} failed: ${error}`);
      await this.prisma.notificationDelivery.update({
        where: { id: data.deliveryId },
        data: { status: DeliveryStatus.FAILED, failedAt: new Date(), error },
      });
      // Re-throw so BullMQ retries the job with exponential backoff.
      throw err;
    }
  }
}
