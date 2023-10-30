import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { AccountType, ConfirmationStatus } from './types.dto';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsOptional()
  accountType?: AccountType;

  @IsOptional()
  confirmationStatus?: ConfirmationStatus;
}

export default CreateUserDto;
