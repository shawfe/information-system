import { SectionType } from '@modules/users/dto/types.dto';
import { IsNotEmpty } from 'class-validator';

export class ProgressBarDto {
  @IsNotEmpty()
  sectionType: SectionType;

  @IsNotEmpty()
  finishedProgressItems: number;

  @IsNotEmpty()
  totalProgressItems: number;

  constructor(data: ProgressBarDto) {
    this.sectionType = data.sectionType;
    this.finishedProgressItems = data.finishedProgressItems;
    this.totalProgressItems = data.totalProgressItems;
  }
}
