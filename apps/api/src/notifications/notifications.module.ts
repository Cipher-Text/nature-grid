import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailService],
  // NotificationsService consumed by AlertsModule; EmailService consumed by AuthModule.
  exports: [NotificationsService, EmailService],
})
export class NotificationsModule {}
