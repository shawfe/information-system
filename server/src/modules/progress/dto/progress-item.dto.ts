import { SectionType } from '@modules/users/dto/types.dto';
import { IsNotEmpty } from 'class-validator';
import { ProgressChapterDto } from './progress-chapter.dto';
import { ProgressExerciseDto } from './progress-exercise.dto';
import { ProgressItemType } from './progress.types';

export class ProgressItemDto {
  @IsNotEmpty()
  sectionType: SectionType;

  @IsNotEmpty()
  type: ProgressItemType;

  @IsNotEmpty()
  finishedDate: string;

  @IsNotEmpty()
  itemData: ProgressExerciseDto | ProgressChapterDto;

  constructor(data: ProgressItemDto) {
    this.sectionType = data.sectionType;
    this.type = data.type;
    this.finishedDate = data.finishedDate;
    this.itemData = data.itemData;
  }
}
