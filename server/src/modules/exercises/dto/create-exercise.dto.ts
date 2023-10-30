import { IsNotEmpty } from 'class-validator';
import { VariantDto } from './variant.dto';

export class CreateExerciseDto {
  @IsNotEmpty()
  title: string;

  variants: VariantDto[];

  @IsNotEmpty()
  sectionId: string;
}
