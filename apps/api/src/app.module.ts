import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './common/env.validation';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
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
import { FloodModule } from './flood/flood.module';
import { MetricsModule } from './metrics/metrics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { HealthController } from './health.controller';
import { SeedService } from './seed/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    // Baseline limit for every route. Auth routes tighten this further with
    // their own @Throttle decorators — see auth.controller.ts.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
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
    FloodModule,
    MetricsModule,
    NotificationsModule,
  ],
  controllers: [HealthController],
  // ThrottlerGuard is registered here rather than in main.ts's useGlobalGuards
  // because it needs injected dependencies (storage service + reflector).
  providers: [SeedService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
