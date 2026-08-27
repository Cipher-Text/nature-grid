import { Module } from '@nestjs/common';
import { ObservationsController } from './observations.controller';
import { ObservationsService } from './observations.service';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [GamificationModule],
  controllers: [ObservationsController],
  providers: [ObservationsService],
})
export class ObservationsModule {}
