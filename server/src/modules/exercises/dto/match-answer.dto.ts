import { IsNotEmpty } from 'class-validator';

export class MatchAnswerDto {
  uuid: string;

  @IsNotEmpty()
  leftPart: string;

  @IsNotEmpty()
  rightPart: string;

  @IsNotEmpty()
  order: number;
}
