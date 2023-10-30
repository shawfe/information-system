import { IsNotEmpty } from 'class-validator';

export class ProgressExerciseDto {
  @IsNotEmpty()
  exerciseId: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  earnedPoints: number;

  @IsNotEmpty()
  maxPoints: number;

  @IsNotEmpty()
  mark: number;

  constructor(data: ProgressExerciseDto) {
    this.exerciseId = data.exerciseId;
    this.title = data.title;
    this.earnedPoints = data.earnedPoints;
    this.maxPoints = data.maxPoints;
    this.mark = data.mark;
  }
}
