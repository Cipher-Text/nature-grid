import { IsIn } from 'class-validator';
import type { UserRole } from '@nature-grid/shared';

const ASSIGNABLE_ROLES: UserRole[] = [
  'citizen',
  'researcher',
  'organization_admin',
  'government',
  'moderator',
];

export class UpdateRoleDto {
  @IsIn(ASSIGNABLE_ROLES, { message: 'Invalid or non-assignable role' })
  role!: UserRole;
}
