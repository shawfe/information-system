import { IsNotEmpty } from 'class-validator';
import { TimeUnits } from 'src/core/interfaces/time-units.interface';

export class GenerateLinkRequestDto {
  @IsNotEmpty()
  duration: string;

  @IsNotEmpty()
  timeUnits: TimeUnits;

  @IsNotEmpty()
  link: string;
}
