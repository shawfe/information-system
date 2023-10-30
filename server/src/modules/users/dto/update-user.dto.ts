import { Optional } from '@nestjs/common';
import { IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto {
  @Optional()
  firstName: string;

  @Optional()
  lastName: string;

  @Optional()
  @IsEmail()
  email: string;

  @Optional()
  @MinLength(8)
  password: string;
}

export default UpdateUserDto;
