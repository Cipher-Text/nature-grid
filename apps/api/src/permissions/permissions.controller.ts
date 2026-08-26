import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@Controller('admin/permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  /** Returns all permissions with which roles currently hold each one. */
  @Get()
  getAll() {
    return this.permissionsService.getAllWithAssignments();
  }

  /** Grants a permission to a role. Idempotent — safe to call if already granted. */
  @Post('roles')
  @HttpCode(HttpStatus.NO_CONTENT)
  grant(@Body() dto: UpdateRolePermissionDto, @CurrentUser() user: JwtPayload) {
    return this.permissionsService.grant(dto.role, dto.permissionId, user.sub);
  }

  /** Revokes a permission from a role. */
  @Delete('roles')
  @HttpCode(HttpStatus.NO_CONTENT)
  revoke(@Body() dto: UpdateRolePermissionDto, @CurrentUser() user: JwtPayload) {
    return this.permissionsService.revoke(dto.role, dto.permissionId, user.sub);
  }
}
