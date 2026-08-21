import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type { AlertSeverity } from '@prisma/client';

export interface AlertForEmail {
  id: string;
  title: string;
  severity: AlertSeverity;
  description: string;
  instructions: string | null;
  issuedAt: Date;
  district: { name: string } | null;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter | null;
  private readonly smtpFrom: string;

  constructor(config: ConfigService) {
    const host = config.get<string>('SMTP_HOST');
    const port = Number(config.get<string>('SMTP_PORT') ?? 587);
    const user = config.get<string>('SMTP_USER');
    const pass = config.get<string>('SMTP_PASS');
    this.smtpFrom = config.get<string>('SMTP_FROM') ?? 'Nature Grid Alerts <alerts@naturegrid.bd>';

    if (!host) {
      this.transporter = null;
      this.logger.warn('SMTP_HOST not set — email delivery disabled. Set SMTP_HOST to enable alert notifications.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  async sendAlertEmail(to: string, displayName: string, alert: AlertForEmail): Promise<void> {
    if (!this.transporter) {
      this.logger.debug(`Skipping email to ${to} — SMTP not configured`);
      return;
    }

    const area = alert.district?.name ?? 'Nationwide';
    const subject = `[${alert.severity}] Nature Grid Alert: ${alert.title}`;
    const body = [
      `Hello ${displayName},`,
      '',
      `A ${alert.severity} environmental alert has been issued for ${area}.`,
      '',
      `Title: ${alert.title}`,
      `Area: ${area}`,
      `Severity: ${alert.severity}`,
      `Issued: ${alert.issuedAt.toISOString()}`,
      '',
      alert.description,
      ...(alert.instructions ? ['', 'Instructions:', alert.instructions] : []),
      '',
      '---',
      'You are receiving this because you subscribed to Nature Grid alert notifications.',
      'Visit Nature Grid to manage your subscriptions.',
    ].join('\n');

    await this.transporter.sendMail({
      from: this.smtpFrom,
      to,
      subject,
      text: body,
    });
  }
}
