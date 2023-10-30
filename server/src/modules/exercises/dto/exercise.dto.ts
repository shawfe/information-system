import { Exercise } from '@schemas/exercise.schema';
import { IsNotEmpty } from 'class-validator';
import { VariantDto } from './variant.dto';

export class ExerciseDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  title: string;

  variants: VariantDto[];

  sectionId: string;

  order: number;

  constructor(exercise: Exercise) {
    this.id = exercise._id.toString();
    this.title = exercise.title;
    this.variants = exercise.variants;
    this.sectionId = exercise.sectionId;
    this.order = exercise.order;
  }
}
