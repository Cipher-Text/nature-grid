import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { LocationsModule } from './locations/locations.module';
import { ProvidersModule } from './providers/providers.module';
import { DatasetsModule } from './datasets/datasets.module';
import { ReportsModule } from './reports/reports.module';
import { AlertsModule } from './alerts/alerts.module';
import { BiodiversityModule } from './biodiversity/biodiversity.module';
import { ObservationsModule } from './observations/observations.module';
import { MediaModule } from './media/media.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    LocationsModule,
    ProvidersModule,
    DatasetsModule,
    ReportsModule,
    AlertsModule,
    BiodiversityModule,
    ObservationsModule,
    MediaModule,
    IngestionModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
