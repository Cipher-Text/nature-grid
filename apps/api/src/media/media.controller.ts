import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { MediaService } from './media.service';
import { PresignRequestDto } from './dto/presign-request.dto';
import { ALLOWED_MIME_TYPES, MAX_UPLOAD_SIZE_BYTES, UPLOAD_FOLDERS } from './media.constants';

@Controller('media')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * POST /api/v1/media/upload
   *
   * Server-proxied multipart upload. The file bytes travel through the API
   * server, which then forwards them to the object store (MinIO / S3).
   *
   * Use this for small files (< 10 MB). For larger files prefer the
   * presigned-URL flow at POST /media/presign so the bytes bypass the API.
   *
   * Request:  multipart/form-data  — field name: "file"
   * Query:    ?folder=reports|observations|profile|general  (default: general)
   * Response: { url, key, mimeType, fileSize, originalName }
   */
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_UPLOAD_SIZE_BYTES },
      fileFilter(_req, file, cb) {
        if ((ALLOWED_MIME_TYPES as readonly string[]).includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              `File type "${file.mimetype}" is not allowed. ` +
              `Permitted types: ${ALLOWED_MIME_TYPES.join(', ')}`,
            ),
            false,
          );
        }
      },
    }),
  )
  upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @CurrentUser() user: JwtPayload,
    @Query('folder') folder?: string,
  ) {
    if (!file) throw new BadRequestException('No file attached. Use field name "file".');
    const safeFolder = (UPLOAD_FOLDERS as readonly string[]).includes(folder ?? '')
      ? folder
      : undefined;
    return this.mediaService.uploadFile(file, safeFolder, user.sub);
  }

  /**
   * POST /api/v1/media/presign
   *
   * Returns a short-lived presigned PUT URL so the browser can upload a file
   * directly to the object store — no bytes pass through the API server.
   *
   * Flow:
   *   1. Client calls this endpoint with { fileName, mimeType, folder }.
   *   2. Client PUTs the file to `presignedUrl` with Content-Type = mimeType.
   *   3. Client uses `publicUrl` when referencing the file in DTOs
   *      (e.g. AddMediaDto.url, CreateObservationDto.mediaUrl).
   *
   * The presigned URL expires in 15 minutes.
   */
  @Post('presign')
  @HttpCode(HttpStatus.OK)
  presign(@Body() dto: PresignRequestDto, @CurrentUser() user: JwtPayload) {
    return this.mediaService.createPresignedUpload(
      dto.fileName,
      dto.mimeType,
      dto.folder,
      user.sub,
    );
  }
}
