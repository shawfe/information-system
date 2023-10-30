import { SectionType } from '@modules/users/dto/types.dto';
import { Section } from '@schemas/section.schema';
import { IsNotEmpty } from 'class-validator';

export class SectionDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  sectionType: SectionType;

  @IsNotEmpty()
  order: number;

  constructor(section: Section) {
    this.id = section._id.toString();
    this.title = section.title;
    this.sectionType = section.sectionType;
    this.order = section.order;
  }
}
