import { IsNotEmpty } from 'class-validator';

export class RequestUpdateUsersDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  groupId: string;
}

export default RequestUpdateUsersDto;
