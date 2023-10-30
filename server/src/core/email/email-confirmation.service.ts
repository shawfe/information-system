import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.service';
import { VerificationTokenPayload } from '../interfaces/verification-token-payload.interface';
import { UsersDatabaseService } from '../database-services/users-database.service';
import { ResetPasswordPayload } from '../interfaces/reset-password-payload.interface';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
    private readonly _emailService: EmailService,
    private readonly _usersDatabaseService: UsersDatabaseService
  ) {}

  public sendVerificationLink(email: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this._jwtService.sign(payload, {
      secret: this._configService.get('JWTKEY'),
      expiresIn: this._configService.get('TOKEN_EXPIRATION')
    });
    const emailUrl = this._configService.get('EMAIL_CONFIRMATION_URL');
    const emailPort = this._configService.get('EMAIL_CONFIRMATION_PORT');
    const senderEmail = this._configService.get('EMAIL_USER');
    const url = `${emailUrl}${emailPort ? ':' : ''}${emailPort}/email-confirmation
    ?token=${token}`;
    const text = `Спасибо за регистрацию! Для подтверждения почты пройдите по ссылке: ${url}`;

    return this._emailService.sendMail({
      from: senderEmail,
      to: email,
      subject: 'Подтверждение почты Web Info System',
      text
    });
  }

  public sendResetPaswordLink(email: string) {
    const payload: ResetPasswordPayload = { email, restorePassword: true };
    const token = this._jwtService.sign(payload, {
      secret: this._configService.get('JWTKEY'),
      expiresIn: this._configService.get('TOKEN_EXPIRATION')
    });
    const emailUrl = this._configService.get('EMAIL_CONFIRMATION_URL');
    const emailPort = this._configService.get('EMAIL_CONFIRMATION_PORT');
    const senderEmail = this._configService.get('EMAIL_USER');
    const url = `${emailUrl}${emailPort ? ':' : ''}${emailPort}/auth/new-password
    ?token=${token}`;
    const text = `Ваша ссылка для сброса пароля: ${url}`;

    return this._emailService.sendMail({
      from: senderEmail,
      to: email,
      subject: 'Восстановление доступа Web Info System',
      text
    });
  }

  public sendAfterResetPasswordMessage(email: string) {
    const senderEmail = this._configService.get('EMAIL_USER');

    const text = `Уважаемый пользователь, хотим вас уведомить, что ваш пароль для входа в систему был изменен.`;

    return this._emailService.sendMail({
      from: senderEmail,
      to: email,
      subject: 'Изменение пароля Web Info System',
      text
    });
  }

  public sendMessage(email: string, subject: string, message: string) {
    const senderEmail = this._configService.get('EMAIL_USER');

    return this._emailService.sendMail({
      from: senderEmail,
      to: email,
      subject: subject,
      text: message
    });
  }

  public async confirmEmail(email: string) {
    const userDb = await this._usersDatabaseService.findOneByEmail(email);

    if (userDb.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this._usersDatabaseService.markEmailAsConfirmed(email);
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this._jwtService.verify(token, {
        secret: this._configService.get('JWTKEY')
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  public async resendConfirmationLink(userID: string) {
    const user = await this._usersDatabaseService.findOneByID(userID);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.sendVerificationLink(user.email);
  }
}
