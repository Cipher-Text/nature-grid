import { Module } from '@nestjs/common';
import { BiodiversityController } from './biodiversity.controller';
import { BiodiversityService } from './biodiversity.service';
import { BiodiversityScheduler } from './biodiversity.scheduler';
import { GbifClient } from './gbif.client';

@Module({
  controllers: [BiodiversityController],
  providers: [BiodiversityService, BiodiversityScheduler, GbifClient],
})
export class BiodiversityModule {}
