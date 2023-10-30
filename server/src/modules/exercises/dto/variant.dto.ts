import { MatchTaskDto } from './match-task.dto';
import { PickTaskDto } from './pick-task.dto';

export class VariantDto {
  uuid: string;
  tasks: (PickTaskDto | MatchTaskDto)[];
}
