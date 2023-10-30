import { ExerciseListDto } from '@modules/exercises/dto/exercise-list.dto';
import { Section } from '@schemas/section.schema';
import { SectionWithChaptersDto } from './section-with-chapters.dto';

export class SectionWithChaptersExercisesDto extends SectionWithChaptersDto {
  exercises: ExerciseListDto[] = [];

  constructor(section: Section) {
    super(section);
  }
}
