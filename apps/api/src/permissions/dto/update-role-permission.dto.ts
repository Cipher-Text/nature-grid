import { IsIn, IsString } from 'class-validator';

// ADMIN permissions are not editable via the API — ADMIN bypasses all permission
// checks in the guard, so the DB state for ADMIN is irrelevant to enforcement.
const ASSIGNABLE_ROLES = [
  'CITIZEN',
  'RESEARCHER',
  'ORGANIZATION_ADMIN',
  'GOVERNMENT',
  'MODERATOR',
] as const;

export class UpdateRolePermissionDto {
  @IsString()
  @IsIn(ASSIGNABLE_ROLES)
  role: string;

  @IsString()
  permissionId: string;
}
