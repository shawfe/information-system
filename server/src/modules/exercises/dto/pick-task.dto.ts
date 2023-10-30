import { TaskType } from './exercise.type';
import { PickAnswerDto } from './pick-answer.dto';

export class PickTaskDto {
  uuid: string;
  question: string;
  type: TaskType;
  answers: PickAnswerDto[];
}
