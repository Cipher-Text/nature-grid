import { IsString } from 'class-validator';

export class CastVoteDto {
  @IsString()
  optionId!: string;
}
