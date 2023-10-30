import { IsNotEmpty } from 'class-validator';

export class CreateChapterDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  sectionId: string;

  @IsNotEmpty()
  order: number;
}

export default CreateChapterDto;
