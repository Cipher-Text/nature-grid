import { Module } from '@nestjs/common';
import { IngestionModule } from '../ingestion/ingestion.module';
import { RadiationController } from './radiation.controller';
import { RadiationOpenMeteoClient } from './radiation-openmeteo.client';
import { RadiationScheduler } from './radiation.scheduler';
import { RadiationService } from './radiation.service';

@Module({
  imports: [IngestionModule],
  controllers: [RadiationController],
  providers: [RadiationService, RadiationScheduler, RadiationOpenMeteoClient],
})
export class RadiationModule {}
