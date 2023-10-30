import { RequestResetPasswordDto } from '@modules/users/dto/request-reset-password.dto';
import RequestWithUser from '@modules/users/interfaces/request-with-user.interface';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EmailConfirmationService } from 'src/core/email/email-confirmation.service';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _emailConfirmationService: EmailConfirmationService
  ) {}

  @Post('signup')
  async signUp(@Body() signUpData: UpdateUserDto) {
    const user = await this._authService.create(signUpData);
    if (!user) {
      throw new HttpException('User exists', HttpStatus.CONFLICT);
    }
    await this._emailConfirmationService.sendVerificationLink(signUpData.email);
    return user;
  }

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  async login(@Request() req) {
    return await this._authService.login(req.user);
  }

  @Post('restore')
  async restore(@Body() data: { email: string }) {
    const isUserExist = await this._authService.checkUserExists(data.email);
    if (!isUserExist) {
      throw new BadRequestException();
    }
    await this._authService.restorePassword(data.email);
    return Promise.resolve();
  }

  @Post('reset')
  async resetPassword(@Body() data: RequestResetPasswordDto) {
    return this._authService.updateUserPasswordByToken(data.token, data.password);
  }

  // @UseGuards(AuthGuard('local'))
  // @Post('logout')
  // async logout(@Req() request: RequestWithUser, @Res() response: Response) {
  //   response.headers.set('Set-Cookie', this._authService)
  // }

  // @UseGuards(AuthGuard('jwt'))
  // @UseGuards(UserExists)

  @Get('create-admin')
  async createAdmin() {
    try {
      return await this._authService.create({
        email: 'naronEmail@gmail.com',
        firstName: 'admin',
        lastName: 'admin',
        password: '12345678'
      });
    } catch {
      return { message: 'Admin already exists' };
    }
  }
}
