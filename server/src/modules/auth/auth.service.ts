import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '@modules/users/users.service';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import SignInUserDto from '@modules/users/dto/sign-in-user.dto';
import { UsersDatabaseService } from 'src/core/database-services/users-database.service';
import { EmailConfirmationService } from 'src/core/email/email-confirmation.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
    private readonly _usersDatabaseService: UsersDatabaseService,
    private readonly _emailConfirmationService: EmailConfirmationService
  ) {
    // this._createAdmin();
  }

  public async validateUser(email: string, pass: string) {
    const user = await this._usersDatabaseService.findOneByEmail(email);

    if (!user) {
      return null;
    }

    const match = await this._comparePassword(pass, user.password);

    if (!match) {
      return null;
    }

    return { email: user.email, password: pass };
  }

  public async login(signInData: SignInUserDto) {
    const token = await this._generateToken(signInData);
    return { user: signInData, token };
  }

  public async create(createUserData: CreateUserDto) {
    const existUser = await this._usersService.getUserByEmail(createUserData.email);

    if (existUser) {
      return null;
    }
    const pass = await this._hashPassword(createUserData.password);
    const newUser = await this._usersService.createUser({
      ...createUserData,
      password: pass
    });

    return newUser;
  }

  public async restorePassword(email: string): Promise<any> {
    await this._emailConfirmationService.sendResetPaswordLink(email);
  }

  public async updateUserPasswordByToken(token: string, password: string): Promise<void> {
    const email = await this._emailConfirmationService.decodeConfirmationToken(token);
    const existUser = await this._usersService.getUserByEmail(email);

    if (!existUser) {
      throw new BadRequestException();
    }

    const pass = await this._hashPassword(password);
    await this._usersDatabaseService.update(existUser.id.toString(), { password: pass });
    await this._emailConfirmationService.sendAfterResetPasswordMessage(email);

    Promise.resolve();
  }

  public async checkUserExists(email: string): Promise<boolean> {
    const user = this._usersDatabaseService.findOneByEmail(email);
    return Promise.resolve(!!user);
  }

  private async _generateToken(user) {
    return await this._jwtService.signAsync(user, {
      secret: this._configService.get('JWTKEY'),
      expiresIn: this._configService.get('TOKEN_EXPIRATION')
    });
  }

  private async _hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  private async _comparePassword(enteredPassword, dbPassword) {
    return await bcrypt.compare(enteredPassword, dbPassword);
  }

  private async _createAdmin() {
    try {
      return await this.create({
        email: 'admin@admin.zet',
        firstName: 'admin',
        lastName: 'admin',
        password: '12345678',
        accountType: 'ADMIN',
        confirmationStatus: 'CONFIRMED'
      });
    } catch {
      return { message: 'Admin already exists' };
    }
  }
}
