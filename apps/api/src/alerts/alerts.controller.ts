import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  list() {
    return this.alertsService.list();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.alertsService.getById(id);
  }

  @Post()
  create(@Body() body: unknown) {
    return this.alertsService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: unknown) {
    return this.alertsService.update(id, body);
  }
}

