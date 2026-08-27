import { Module } from '@nestjs/common';
import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';

/**
 * GamificationModule is intentionally lean: it only depends on DatabaseModule
 * (via global PrismaService). Other feature modules import this module to
 * inject GamificationService and fire evaluateBadges() after state changes.
 */
@Module({
  controllers: [GamificationController],
  providers:   [GamificationService],
  exports:     [GamificationService],
})
export class GamificationModule {}
