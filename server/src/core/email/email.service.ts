import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  private _nodemailerTransport: Mail;

  constructor(private readonly _configService: ConfigService) {
    this._nodemailerTransport = createTransport({
      service: this._configService.get('EMAIL_SERVICE'),
      auth: {
        user: this._configService.get('EMAIL_USER'),
        pass: this._configService.get('EMAIL_PASSWORD')
      }
    });
  }

  sendMail(options: Mail.Options) {
    return this._nodemailerTransport.sendMail(options);
  }
}
