import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrganizationMemberRole } from '@prisma/client';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpsertMembershipDto } from './dto/upsert-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';

@Controller('admin/organizations')
@UseGuards(JwtAuthGuard, PermissionsGuard)
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
