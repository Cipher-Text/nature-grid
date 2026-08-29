import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

@Module({
  controllers: [MediaController],
  providers: [StorageService, MediaService],
  // StorageService exported so other modules (e.g. a future profile-picture
  // endpoint in AuthModule) can upload without going through the HTTP layer.
  exports: [StorageService, MediaService],
})
export class MediaModule {}
