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

  async sendPasswordResetEmail(to: string, displayName: string, resetUrl: string): Promise<void> {
    if (!this.transporter) {
      this.logger.debug(`Skipping password-reset email to ${to} — SMTP not configured`);
      return;
    }
    const subject = 'Nature Grid — Reset your password';
    const body = [
      `Hello ${displayName},`,
      '',
      'We received a request to reset the password for your Nature Grid account.',
      '',
      'Click the link below to choose a new password (expires in 1 hour):',
      resetUrl,
      '',
      'If you did not request a password reset, you can safely ignore this email.',
      'Your password will not change unless you click the link above.',
      '',
      '---',
      'Nature Grid — Environmental Monitoring Platform',
    ].join('\n');

    await this.transporter.sendMail({ from: this.smtpFrom, to, subject, text: body });
  }

  async sendVerificationEmail(to: string, displayName: string, verificationUrl: string): Promise<void> {
    if (!this.transporter) {
      this.logger.debug(`Skipping verification email to ${to} — SMTP not configured`);
      return;
    }
    const subject = 'Nature Grid — Verify your email address';
    const body = [
      `Hello ${displayName},`,
      '',
      'Thank you for registering with Nature Grid.',
      'Please verify your email address by clicking the link below (expires in 24 hours):',
      verificationUrl,
      '',
      'If you did not create a Nature Grid account, you can safely ignore this email.',
      '',
      '---',
      'Nature Grid — Environmental Monitoring Platform',
    ].join('\n');

    await this.transporter.sendMail({ from: this.smtpFrom, to, subject, text: body });
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
