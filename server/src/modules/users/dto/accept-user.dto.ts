import { IsNotEmpty } from 'class-validator';

export class AcceptUserDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  groupId: string;
}

export default AcceptUserDto;
