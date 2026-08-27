import { Module } from '@nestjs/common';
import { RestorationController } from './restoration.controller';
import { RestorationService } from './restoration.service';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [GamificationModule],
  controllers: [RestorationController],
  providers: [RestorationService],
})
export class RestorationModule {}
