import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePollDto {
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  question!: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(4)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(200, { each: true })
  options!: string[];
}

export class CreatePostDto {
  @IsString()
  @MinLength(3)
  @MaxLength(300)
  title!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(10000)
  body!: string;

  @IsOptional()
  @IsString()
  districtId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePollDto)
  poll?: CreatePollDto;
}
