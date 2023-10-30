import { ProgressBarDto } from './progress-bar.dto';
import { ProgressItemDto } from './progress-item.dto';

export class UpdateProgressDto {
  lastModifiedDate: string;
  progressBars: ProgressBarDto[];
  progressItem: ProgressItemDto;
}
