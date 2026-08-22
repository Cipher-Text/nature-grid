import { IsInt, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';

export class AddMediaDto {
  @IsUrl()
  @MaxLength(2000)
  url!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  mimeType?: string;

  /** File size in bytes. */
  @IsOptional()
  @IsInt()
  @Min(1)
  fileSize?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;
}
