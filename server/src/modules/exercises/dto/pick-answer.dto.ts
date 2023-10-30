import { Optional } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';

export class PickAnswerDto {
  uuid: string;

  @IsNotEmpty()
  text: string;

  @Optional()
  isRight: boolean;
}
