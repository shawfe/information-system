import { IsNotEmpty } from 'class-validator';

export class RequestUpdateGroupDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;
}

export default RequestUpdateGroupDto;
