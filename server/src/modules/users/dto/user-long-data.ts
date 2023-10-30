import GroupRefDto from '@modules/groups/dto/group-ref.dto';
import { User } from '@schemas/user.schema';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ConfirmationStatus, AccountType } from './types.dto';

export class UserLongDataDto {
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
  groupRef: GroupRefDto;

  @IsNotEmpty()
  confirmationStatus: ConfirmationStatus;

  @IsNotEmpty()
  accountType: AccountType;

  groupName: string;

  constructor(user: User, groupName?: string) {
    this.id = user._id.toString();
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.groupRef = { id: user.groupId, name: groupName };
    this.confirmationStatus = user.confirmationStatus;
    this.accountType = user.accountType;
  }
}

export default UserLongDataDto;
