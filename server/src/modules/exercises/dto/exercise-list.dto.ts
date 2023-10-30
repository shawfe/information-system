import { Exercise } from '@schemas/exercise.schema';
import { IsNotEmpty } from 'class-validator';

export class ExerciseListDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  sectionId: string;

  @IsNotEmpty()
  order: number;

  constructor(exercise: Exercise) {
    this.id = exercise._id.toString();
    this.title = exercise.title;
    this.sectionId = exercise.sectionId;
    this.order = exercise.order;
  }
}
