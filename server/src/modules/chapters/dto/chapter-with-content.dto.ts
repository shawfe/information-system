import { Chapter } from '@schemas/chapter.schema';
import { IsNotEmpty } from 'class-validator';
import ChapterDto from './chapter.dto';

export class ChapterWithContentDto extends ChapterDto {
  @IsNotEmpty()
  content: string;

  constructor(chapter: Chapter) {
    super(chapter);
    this.content = chapter.content;
  }
}
