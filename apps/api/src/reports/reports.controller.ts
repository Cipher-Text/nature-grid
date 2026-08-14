import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  create(@Body() body: unknown) {
    return this.reportsService.create(body);
  }

  @Get()
  list() {
    return this.reportsService.list();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.reportsService.getById(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: unknown) {
    return this.reportsService.updateStatus(id, body);
  }
}

