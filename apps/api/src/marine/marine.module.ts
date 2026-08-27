import { Module } from '@nestjs/common';
import { IngestionModule } from '../ingestion/ingestion.module';
import { MarineController } from './marine.controller';
import { MarineOpenMeteoClient } from './marine-openmeteo.client';
import { MarineScheduler } from './marine.scheduler';
import { MarineService } from './marine.service';

@Module({
  imports: [IngestionModule],
  controllers: [MarineController],
  providers: [MarineService, MarineScheduler, MarineOpenMeteoClient],
})
export class MarineModule {}
