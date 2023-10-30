import UserForGroupDto from '@modules/users/dto/user-for-group.dto';
import { Group } from '@schemas/group.schema';
import { IsNotEmpty } from 'class-validator';

export class GroupWithUsersDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  users: UserForGroupDto[];

  constructor(group: Group) {
    this.id = group._id.toString();
    this.name = group.name;
    this.users = [];
  }
}

export default GroupWithUsersDto;
