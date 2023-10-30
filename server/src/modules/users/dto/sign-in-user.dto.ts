import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignInUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export default SignInUserDto;
