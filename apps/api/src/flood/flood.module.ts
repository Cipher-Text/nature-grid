import { Module } from '@nestjs/common';
import { IngestionModule } from '../ingestion/ingestion.module';
import { FloodController } from './flood.controller';
import { FloodOpenMeteoClient } from './flood-openmeteo.client';
import { FloodScheduler } from './flood.scheduler';
import { FloodService } from './flood.service';

@Module({
  imports: [IngestionModule],
  controllers: [FloodController],
  providers: [FloodService, FloodScheduler, FloodOpenMeteoClient],
})
export class FloodModule {}
