import { Module } from '@nestjs/common';
import { WaterBodiesController } from './water-bodies.controller';
import { WaterBodiesService } from './water-bodies.service';

@Module({ controllers: [WaterBodiesController], providers: [WaterBodiesService] })
export class WaterBodiesModule {}
