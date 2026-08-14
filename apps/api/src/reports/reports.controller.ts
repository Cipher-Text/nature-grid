import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ReportStatus, ReportCategory } from '@prisma/client';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Public, Roles } from '../common/decorators/roles.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /** Public: verified and resolved reports only. */
  @Public()
  @Get()
  list(
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('districtId') districtId?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.reportsService.list(
      status as ReportStatus | undefined,
      category as ReportCategory | undefined,
      districtId,
      Number(page ?? 1),
      Number(pageSize ?? 20),
    );
  }

  @Public()
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.reportsService.getById(id);
  }

  @Post()
  create(@Body() dto: CreateReportDto, @CurrentUser() user: JwtPayload) {
    return this.reportsService.create(dto, user);
  }

  @Roles('moderator', 'admin')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateReportStatusDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reportsService.updateStatus(id, dto, user);
  }
}
