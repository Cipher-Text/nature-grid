import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProviderType } from '@prisma/client';
import { ProvidersService } from './providers.service';
import { Public } from '../common/decorators/roles.decorator';

@Controller('providers')
@Public()
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  list(
    @Query('type') type?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.providersService.list(
      type as ProviderType | undefined,
      Number(page ?? 1),
      Number(pageSize ?? 20),
    );
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.providersService.getById(id);
  }
}
