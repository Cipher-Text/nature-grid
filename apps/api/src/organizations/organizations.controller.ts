import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { OrganizationType } from '@prisma/client';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Public } from '../common/decorators/roles.decorator';

@Controller('organizations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  /** Public: only the total count, optionally filtered by type. */
  @Public()
  @Get('count')
  count(@Query('type') type?: string) {
    return this.organizationsService.count(type as OrganizationType | undefined);
  }

  /** Authenticated: full paginated list. */
  @Get()
  list(@Query('type') type?: string, @Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.organizationsService.list(
      type as OrganizationType | undefined,
      Number(page ?? 1),
      Number(pageSize ?? 20),
    );
  }

  /** Public: single org detail. */
  @Public()
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.organizationsService.getById(id);
  }
}
