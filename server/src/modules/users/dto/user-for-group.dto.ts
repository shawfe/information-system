import { User } from '@schemas/user.schema';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserForGroupDto {
  @IsNotEmpty()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  groupId: string;

  @IsNotEmpty()
  lastActiveDate: string;

  constructor(user: User) {
    this.id = user._id.toString();
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.groupId = user.groupId;
    this.lastActiveDate = user.lastActiveDate;
  }
}

export default UserForGroupDto;
