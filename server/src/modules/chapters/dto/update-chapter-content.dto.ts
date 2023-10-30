import { IsNotEmpty } from 'class-validator';

export class UpdateChapterContentDto {
  @IsNotEmpty()
  content: string;
}

export default UpdateChapterContentDto;
