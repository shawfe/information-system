import { Progress } from '@schemas/progress.schema';
import { IsNotEmpty } from 'class-validator';
import { ProgressBarDto } from './progress-bar.dto';
import { ProgressItemDto } from './progress-item.dto';

export class ProgressDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  lastModifiedDate: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  progressItems: ProgressItemDto[];

  @IsNotEmpty()
  progressBars: ProgressBarDto[];

  constructor(progress: Progress) {
    this.id = progress._id.toString();
    this.lastModifiedDate = progress.lastModifiedDate;
    this.userId = progress.userId;
    this.progressItems = progress.progressItems;
    this.progressBars = progress.progressBars;
  }
}
