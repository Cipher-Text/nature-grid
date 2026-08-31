import { IsOptional, IsString, MaxLength, Matches } from 'class-validator';

export class PublishDatasetVersionDto {
  @IsString()
  @Matches(/^\d+\.\d+(\.\d+)?$/, { message: 'version must be a semver string, e.g. "1.2.0"' })
  @MaxLength(50)
  version!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
