import { Optional } from '@nestjs/common';
import { IsEmail, MinLength } from 'class-validator';

export class RequestUpdateUserDto {
  @Optional()
  firstName: string;

  @Optional()
  lastName: string;

  @Optional()
  @IsEmail()
  email: string;

  @Optional()
  @MinLength(8)
  oldPassword: string;

  @Optional()
  @MinLength(8)
  newPassword: string;
}

export default RequestUpdateUserDto;
