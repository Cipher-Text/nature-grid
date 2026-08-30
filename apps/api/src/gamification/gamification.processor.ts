import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { GamificationService } from './gamification.service';
import { GAMIFICATION_QUEUE, EvaluateBadgesJobData } from './gamification.constants';
export { GAMIFICATION_QUEUE, EvaluateBadgesJobData } from './gamification.constants';

/**
 * Processes badge-evaluation jobs that are enqueued after any contribution
 * event (report submission, observation, restoration join, etc.).
 * Runs asynchronously so it never delays an HTTP response.
 */
@Processor(GAMIFICATION_QUEUE)
export class GamificationProcessor extends WorkerHost {
  private readonly logger = new Logger(GamificationProcessor.name);

  constructor(private readonly gamification: GamificationService) {
    super();
  }

  async process(job: Job): Promise<void> {
    if (job.name !== 'evaluate-badges') {
      this.logger.warn(`Unknown gamification job: ${job.name}`);
      return;
    }

    const { userId } = job.data as EvaluateBadgesJobData;
    try {
      await this.gamification.performEvaluation(userId);
    } catch (err) {
      this.logger.error(`Badge evaluation failed for user ${userId}: ${String(err)}`);
      throw err; // Re-throw so BullMQ retries with exponential backoff.
    }
  }
}
