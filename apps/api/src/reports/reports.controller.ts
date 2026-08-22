import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ReportStatus, ReportCategory } from '@prisma/client';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-status.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AddMediaDto } from './dto/add-media.dto';
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

  /** Authenticated: returns the caller's own reports across all statuses. */
  @Get('mine')
  listMine(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.reportsService.listMine(
      user.sub,
      Number(page ?? 1),
      Number(pageSize ?? 10),
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

  @Roles('MODERATOR', 'ADMIN')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateReportStatusDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reportsService.updateStatus(id, dto, user);
  }

  /** Public: returns only non-internal comments. */
  @Public()
  @Get(':id/comments')
  listComments(@Param('id') id: string) {
    return this.reportsService.listComments(id, false);
  }

  /** Mod/admin: returns all comments including internal. */
  @Roles('MODERATOR', 'ADMIN')
  @Get(':id/comments/all')
  listAllComments(@Param('id') id: string) {
    return this.reportsService.listComments(id, true);
  }

  /** Any authenticated user may comment on a report. */
  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reportsService.addComment(id, dto, user);
  }

  /** Public: list media attached to a report. */
  @Public()
  @Get(':id/media')
  listMedia(@Param('id') id: string) {
    return this.reportsService.listMedia(id);
  }

  /** Any authenticated user may attach media to a report. */
  @Post(':id/media')
  addMedia(
    @Param('id') id: string,
    @Body() dto: AddMediaDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.reportsService.addMedia(id, dto, user);
  }
}
