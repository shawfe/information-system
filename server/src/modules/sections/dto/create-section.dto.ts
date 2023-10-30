import { SectionType } from '@modules/users/dto/types.dto';
import { IsNotEmpty } from 'class-validator';

export class CreateSectionDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  sectionType: SectionType;

  @IsNotEmpty()
  order: number;
}
