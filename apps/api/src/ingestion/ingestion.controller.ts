import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { IngestionStatus } from '@prisma/client';
import { IngestionService } from './ingestion.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('ingestion')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Roles('MODERATOR', 'ADMIN')
  @Get('jobs')
  list(
    @Query('status') status?: string,
    @Query('providerId') providerId?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.ingestionService.list(
      status as IngestionStatus | undefined,
      providerId,
      Number(page ?? 1),
      Number(pageSize ?? 20),
    );
  }

  @Roles('MODERATOR', 'ADMIN')
  @Get('jobs/:id')
  getById(@Param('id') id: string) {
    return this.ingestionService.getById(id);
  }
}
