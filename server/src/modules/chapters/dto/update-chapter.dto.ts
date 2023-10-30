import { Optional } from '@nestjs/common';

export class UpdateChapterDto {
  @Optional()
  title: string;

  @Optional()
  content: string;
}

export default UpdateChapterDto;
