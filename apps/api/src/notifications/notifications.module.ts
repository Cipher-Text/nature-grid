import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailService],
  // Export NotificationsService so AlertsModule can inject it for fire-and-forget dispatch.
  exports: [NotificationsService],
})
export class NotificationsModule {}
