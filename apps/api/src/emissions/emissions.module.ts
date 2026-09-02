import { Module } from '@nestjs/common';
import { EmissionsController } from './emissions.controller';
import { EmissionsService } from './emissions.service';
import { EmissionsScheduler } from './emissions.scheduler';
import { WorldBankClient } from './world-bank.client';
import { IngestionModule } from '../ingestion/ingestion.module';

@Module({
  imports: [IngestionModule],
  controllers: [EmissionsController],
  providers: [EmissionsService, EmissionsScheduler, WorldBankClient],
})
export class EmissionsModule {}
