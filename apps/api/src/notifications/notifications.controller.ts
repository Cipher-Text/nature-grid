import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('subscriptions')
  subscribe(@CurrentUser() user: JwtPayload, @Body() dto: CreateSubscriptionDto) {
    return this.notificationsService.subscribe(user.sub, dto);
  }

  @Get('subscriptions')
  list(@CurrentUser() user: JwtPayload) {
    return this.notificationsService.listSubscriptions(user.sub);
  }

  @Delete('subscriptions/:id')
  async unsubscribe(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    await this.notificationsService.unsubscribe(id, user.sub);
    return { success: true };
  }
}
