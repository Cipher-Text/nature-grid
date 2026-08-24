import { Module } from '@nestjs/common';
import { IngestionModule } from '../ingestion/ingestion.module';
import { BiodiversityController } from './biodiversity.controller';
import { BiodiversityService } from './biodiversity.service';
import { BiodiversityScheduler } from './biodiversity.scheduler';
import { GbifClient } from './gbif.client';

@Module({
  imports: [IngestionModule],
  controllers: [BiodiversityController],
  providers: [BiodiversityService, BiodiversityScheduler, GbifClient],
})
export class BiodiversityModule {}
