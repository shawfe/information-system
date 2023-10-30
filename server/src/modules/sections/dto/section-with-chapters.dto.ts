import ChapterDto from '@modules/chapters/dto/chapter.dto';
import { Section } from '@schemas/section.schema';
import { SectionDto } from './section.dto';

export class SectionWithChaptersDto extends SectionDto {
  chapters: ChapterDto[] = [];

  constructor(section: Section) {
    super(section);
  }
}
