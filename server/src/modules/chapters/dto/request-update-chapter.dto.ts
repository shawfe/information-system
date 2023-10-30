import { IsNotEmpty } from 'class-validator';

export class RequestUpdateChapterDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  order: number;
}

export default RequestUpdateChapterDto;
