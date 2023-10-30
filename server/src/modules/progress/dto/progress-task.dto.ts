import { IsNotEmpty } from 'class-validator';
import { ProgressTaskAnswerDto } from './progress-task-answer.dto';

export class ProgressTaskDto {
  @IsNotEmpty()
  title: string;

  question?: string;

  isSuccess: boolean;

  asnswers: ProgressTaskAnswerDto[];
}
