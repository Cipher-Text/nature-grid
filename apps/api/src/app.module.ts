import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AlertsModule } from './alerts/alerts.module';
import { AuthModule } from './auth/auth.module';
import { BiodiversityModule } from './biodiversity/biodiversity.module';
import { DatasetsModule } from './datasets/datasets.module';
import { HealthController } from './health.controller';
import { IngestionModule } from './ingestion/ingestion.module';
import { LocationsModule } from './locations/locations.module';
import { MediaModule } from './media/media.module';
import { ObservationsModule } from './observations/observations.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    OrganizationsModule,
    LocationsModule,
    ObservationsModule,
    ReportsModule,
    AlertsModule,
    DatasetsModule,
    BiodiversityModule,
    MediaModule,
    IngestionModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

