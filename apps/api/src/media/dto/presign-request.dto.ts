import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { ALLOWED_MIME_TYPES, UPLOAD_FOLDERS } from '../media.constants';

export class PresignRequestDto {
  /** Original file name — used only to derive the extension for the object key. */
  @IsString()
  @MaxLength(255)
  fileName!: string;

  /** MIME type the client will PUT in the Content-Type header. */
  @IsIn(ALLOWED_MIME_TYPES)
  mimeType!: string;

  /** Logical folder (bucket path prefix). Defaults to "general". */
  @IsOptional()
  @IsIn(UPLOAD_FOLDERS)
  folder?: string;
}
