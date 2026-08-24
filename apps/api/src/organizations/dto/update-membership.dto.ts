import { IsIn } from 'class-validator';
import type { OrganizationMemberRole } from '@nature-grid/shared';

export class UpdateMembershipDto {
  @IsIn(['ADMIN', 'MEMBER'])
  role!: OrganizationMemberRole;
}
