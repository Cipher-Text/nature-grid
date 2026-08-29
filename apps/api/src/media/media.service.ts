import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { StorageService } from './storage.service';
import {
  ALLOWED_MIME_TYPES,
  MAX_UPLOAD_SIZE_BYTES,
  UPLOAD_FOLDERS,
  type AllowedMimeType,
  type UploadFolder,
} from './media.constants';
import type { UploadResponseDto, PresignResponseDto } from './dto/upload-response.dto';

/** TTL for presigned PUT URLs (15 minutes). */
const PRESIGN_EXPIRES_IN = 900;

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(private readonly storage: StorageService) {}

  /**
   * Validates and uploads a multipart file to object storage.
   * Called by the server-proxied upload endpoint.
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string | undefined,
    userId: string,
  ): Promise<UploadResponseDto> {
    this.validateMimeType(file.mimetype);
    this.validateSize(file.size);

    const key = this.buildKey(folder ?? 'general', userId, file.originalname);
    const url = await this.storage.upload(key, file.buffer, file.mimetype);

    this.logger.log(`Uploaded ${key} (${file.size} bytes) for user ${userId}`);

    return {
      url,
      key,
      mimeType: file.mimetype,
      fileSize: file.size,
      originalName: file.originalname,
    };
  }

  /**
   * Issues a presigned PUT URL for direct browser-to-bucket upload.
   * The client should PUT the file bytes to `presignedUrl` and then
   * use `publicUrl` when referencing the file in reports / observations.
   */
  async createPresignedUpload(
    fileName: string,
    mimeType: string,
    folder: string | undefined,
    userId: string,
  ): Promise<PresignResponseDto> {
    this.validateMimeType(mimeType);

    const key = this.buildKey(folder ?? 'general', userId, fileName);
    const presignedUrl = await this.storage.presignPut(key, mimeType, PRESIGN_EXPIRES_IN);
    const publicUrl = this.storage.publicUrl(key);

    return { presignedUrl, key, publicUrl, expiresIn: PRESIGN_EXPIRES_IN };
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  private validateMimeType(mimeType: string): void {
    if (!ALLOWED_MIME_TYPES.includes(mimeType as AllowedMimeType)) {
      throw new BadRequestException(
        `File type "${mimeType}" is not allowed. ` +
        `Permitted types: ${ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }
  }

  private validateSize(sizeBytes: number): void {
    if (sizeBytes > MAX_UPLOAD_SIZE_BYTES) {
      throw new BadRequestException(
        `File is too large (${Math.round(sizeBytes / 1024 / 1024)} MB). ` +
        `Maximum allowed size is 100 MB.`,
      );
    }
  }

  /**
   * Builds a deterministic, collision-resistant object key.
   * Pattern: {folder}/{userId}/{uuid}{ext}
   * Example: reports/cm123.../a1b2c3d4-....jpg
   */
  private buildKey(folder: string, userId: string, originalName: string): string {
    const safeFolder = (UPLOAD_FOLDERS as readonly string[]).includes(folder) ? folder : 'general';
    const ext = extname(originalName).toLowerCase().replace(/[^.a-z0-9]/g, '') || '';
    return `${safeFolder}/${userId}/${randomUUID()}${ext}`;
  }
}
