import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AlertSeverity, NotificationChannel } from '@prisma/client';

export class CreateSubscriptionDto {
  /** District to subscribe to. Omit (or send null) for a nationwide subscription. */
  @IsOptional()
  @IsString()
  districtId?: string;

  /** Delivery channel. Defaults to EMAIL. */
  @IsOptional()
  @IsEnum(NotificationChannel)
  channel?: NotificationChannel;

  /**
   * Minimum severity to trigger a notification. Defaults to INFO (all alerts).
   * A subscriber with minSeverity WARNING only receives WARNING and EMERGENCY alerts.
   */
  @IsOptional()
  @IsEnum(AlertSeverity)
  minSeverity?: AlertSeverity;
}
