import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class DecideDatasetAccessDto {
  @IsEnum(['APPROVED', 'REJECTED'])
  decision!: 'APPROVED' | 'REJECTED';

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}
