import { IsNotEmpty } from 'class-validator';
import { ProgressBarDto } from './progress-bar.dto';

export class CreateProgressDto {
  @IsNotEmpty()
  userId: string;

  progressBars: ProgressBarDto[];
}
