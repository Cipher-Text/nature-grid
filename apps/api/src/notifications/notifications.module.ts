import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailService } from './email.service';
import { EmailProcessor, EMAIL_QUEUE } from './email.processor';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [BullModule.registerQueue({ name: EMAIL_QUEUE })],
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailService, EmailProcessor],
  // NotificationsService consumed by AlertsModule; EmailService consumed by AuthModule.
  exports: [NotificationsService, EmailService],
})
export class NotificationsModule {}
