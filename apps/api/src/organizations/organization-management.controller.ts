import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { OrganizationMemberRole } from '@prisma/client';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { UpsertMembershipDto } from './dto/upsert-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('admin/organizations')
@Permissions('organizations.manage')
export class OrganizationManagementController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('users')
  users() {
    return this.organizationsService.manageUsers();
  }

  @Get()
  list() {
    return this.organizationsService.manageList();
  }

  @Post()
  create(@Body() dto: CreateOrganizationDto) {
    return this.organizationsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
    return this.organizationsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.organizationsService.delete(id);
  }

  @Post(':id/members')
  addMember(@Param('id') id: string, @Body() dto: UpsertMembershipDto) {
    return this.organizationsService.upsertMembership(id, dto);
  }

  @Patch(':id/members/:userId')
  updateMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateMembershipDto,
  ) {
    return this.organizationsService.upsertMembership(id, {
      userId,
      role: dto.role as OrganizationMemberRole,
    });
  }

  @Delete(':id/members/:userId')
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.organizationsService.removeMembership(id, userId);
  }
}
