import { IsIn, IsInt, IsOptional, IsString, IsUrl, Max, MaxLength, Min } from 'class-validator';

/** 100 MB expressed in bytes — hard upper bound for a claimed file size. */
const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;

/**
 * Permitted MIME types for report media.
 * Reject executables, scripts, and any type not in this list at the DTO layer.
 */
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'application/pdf',
] as const;

export class AddMediaDto {
  @IsUrl()
  @MaxLength(2000)
  url!: string;

  @IsOptional()
  @IsIn(ALLOWED_MIME_TYPES)
  mimeType?: string;

  /** File size in bytes. Must be between 1 byte and 100 MB. */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_FILE_SIZE_BYTES)
  fileSize?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;
}
