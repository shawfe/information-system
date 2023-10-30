import { IsNotEmpty } from 'class-validator';

export class ProgressChapterDto {
  @IsNotEmpty()
  chapterId: string;

  @IsNotEmpty()
  title: string;

  constructor(data: ProgressChapterDto) {
    this.chapterId = data.chapterId;
    this.title = data.title;
  }
}
