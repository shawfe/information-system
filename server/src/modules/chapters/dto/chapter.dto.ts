import { Chapter } from '@schemas/chapter.schema';
import { IsNotEmpty } from 'class-validator';

export class ChapterDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  sectionId: string;

  @IsNotEmpty()
  order: number;

  constructor(chapter: Chapter) {
    this.id = chapter._id.toString();
    this.title = chapter.title;
    this.sectionId = chapter.sectionId;
    this.order = chapter.order;
  }
}

export default ChapterDto;
