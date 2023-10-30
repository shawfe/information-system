import { User } from '@schemas/user.schema';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ConfirmationStatus } from './types.dto';

export class UserDataDto {
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
  confirmationStatus: ConfirmationStatus;

  @IsNotEmpty()
  lastActiveDate: string;

  constructor(user: User) {
    this.id = user._id.toString();
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.groupId = user.groupId;
    this.confirmationStatus = user.confirmationStatus;
    this.lastActiveDate = user.lastActiveDate;
  }
}

export default UserDataDto;
