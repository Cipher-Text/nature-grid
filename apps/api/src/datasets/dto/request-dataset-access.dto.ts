import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RequestDatasetAccessDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reason?: string;
}
