import { Chapter } from '@schemas/chapter.schema';
import { IsNotEmpty } from 'class-validator';

export class ChapterContentDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  content: string;

  constructor(chapter: Chapter) {
    this.id = chapter._id.toString();
    this.content = chapter.content;
  }
}
