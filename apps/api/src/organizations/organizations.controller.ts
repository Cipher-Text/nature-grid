import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProviderType } from '@prisma/client';
import { OrganizationsService } from './organizations.service';
import { Public } from '../common/decorators/roles.decorator';

@Controller('organizations')
@Public()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  list(@Query('type') type?: string, @Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.organizationsService.list(
      type as ProviderType | undefined,
      Number(page ?? 1),
      Number(pageSize ?? 20),
    );
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.organizationsService.getById(id);
  }
}
