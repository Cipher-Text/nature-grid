import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';
import { GamificationProcessor, GAMIFICATION_QUEUE } from './gamification.processor';

/**
 * GamificationModule registers the `gamification` BullMQ queue and the worker
 * that processes badge-evaluation jobs. Other feature modules import this module
 * to inject GamificationService and call evaluateBadges() after contributions.
 */
@Module({
  imports:     [BullModule.registerQueue({ name: GAMIFICATION_QUEUE })],
  controllers: [GamificationController],
  providers:   [GamificationService, GamificationProcessor],
  exports:     [GamificationService],
})
export class GamificationModule {}
