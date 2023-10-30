import { IsNotEmpty } from 'class-validator';
import { CreateExerciseDto } from './create-exercise.dto';

export class CreateExerciseWithOrder extends CreateExerciseDto {
  @IsNotEmpty()
  order: number;
}
