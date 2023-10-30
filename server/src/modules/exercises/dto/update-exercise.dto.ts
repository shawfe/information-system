import { IsNotEmpty } from 'class-validator';
import { VariantDto } from './variant.dto';

export class UpdateExerciseDto {
  @IsNotEmpty()
  title: string;

  variants: VariantDto[];
}
