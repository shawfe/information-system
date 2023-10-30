import { IsNotEmpty } from 'class-validator';

export class UpdateUserByAdminDto {
  @IsNotEmpty()
  groupId: string;
}

export default UpdateUserByAdminDto;
