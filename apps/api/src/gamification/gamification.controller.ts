import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { GamificationService } from './gamification.service';

@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(private readonly gamification: GamificationService) {}

  /**
   * Returns the authenticated user's full gamification snapshot:
   * profile completeness score, missing-field prompts, badge progress, and level.
   */
  @Get('me')
  getMyGameData(@CurrentUser() user: JwtPayload) {
    return this.gamification.getMyGameData(user.sub);
  }
}
