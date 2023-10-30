import { IsNotEmpty } from 'class-validator';

export class UpdateChapterOrderDto {
  @IsNotEmpty()
  order: number;
}

export default UpdateChapterOrderDto;
