import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './common/env.validation';
import { ScheduleModule } from '@nestjs/schedule';
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
import { RestorationModule } from './restoration/restoration.module';
import { MediaModule } from './media/media.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { WeatherModule } from './weather/weather.module';
import { MetricsModule } from './metrics/metrics.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ScheduleModule.forRoot(),
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
    RestorationModule,
    MediaModule,
    IngestionModule,
    WeatherModule,
    MetricsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
