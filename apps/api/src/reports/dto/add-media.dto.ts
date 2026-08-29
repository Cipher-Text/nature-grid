import { IsIn, IsInt, IsOptional, IsString, IsUrl, Max, MaxLength, Min } from 'class-validator';
import { ALLOWED_MIME_TYPES, MAX_UPLOAD_SIZE_BYTES } from '../../media/media.constants';

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
  @Max(MAX_UPLOAD_SIZE_BYTES)
  fileSize?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;
}
