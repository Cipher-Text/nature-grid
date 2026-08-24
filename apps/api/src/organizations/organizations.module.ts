import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { OrganizationManagementController } from './organization-management.controller';

@Module({
  controllers: [OrganizationsController, OrganizationManagementController],
  providers: [OrganizationsService],
})
export class OrganizationsModule {}
