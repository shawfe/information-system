import { Group } from '@schemas/group.schema';
import { IsNotEmpty } from 'class-validator';

export class GroupRefDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  constructor(group: Group) {
    this.id = group._id.toString();
    this.name = group.name;
  }
}

export default GroupRefDto;
