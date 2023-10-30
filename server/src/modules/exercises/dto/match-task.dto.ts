import { TaskType } from './exercise.type';
import { MatchAnswerDto } from './match-answer.dto';

export class MatchTaskDto {
  uuid: string;
  type: TaskType;
  answers: MatchAnswerDto[];
  matchOrder: string[];
}
