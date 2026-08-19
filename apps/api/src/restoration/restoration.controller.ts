import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProjectStatus, RestorationCategory } from '@prisma/client';
import { RestorationService } from './restoration.service';
import { CreateRestorationProjectDto } from './dto/create-restoration-project.dto';
import { UpdateRestorationProjectDto } from './dto/update-restoration-project.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Public, Roles } from '../common/decorators/roles.decorator';

@Controller('restoration/projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestorationController {
  constructor(private readonly restorationService: RestorationService) {}

  @Public()
  @Get()
  list(
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('districtId') districtId?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.restorationService.list(
      category as RestorationCategory | undefined,
      status as ProjectStatus | undefined,
      districtId,
      Number(page ?? 1),
      Number(pageSize ?? 20),
    );
  }

  @Public()
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.restorationService.getById(id);
  }

  @Roles('ORGANIZATION_ADMIN', 'ADMIN')
  @Post()
  create(@Body() dto: CreateRestorationProjectDto, @CurrentUser() user: JwtPayload) {
    return this.restorationService.create(dto, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRestorationProjectDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.restorationService.update(id, dto, user);
  }

  @Post(':id/join')
  join(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.restorationService.join(id, user);
  }
}
