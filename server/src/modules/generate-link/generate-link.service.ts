import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GenerateLinkRequestDto } from './dto/generate-link-request.dto';

@Injectable()
export class GenerateLinkService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService
  ) {}

  public async generateLink(data: GenerateLinkRequestDto) {
    let expiresIn = String(data.duration);
    switch (data.timeUnits) {
      case 'MINUTES': {
        expiresIn += 'm';
        break;
      }
      case 'HOURS': {
        expiresIn += 'h';
        break;
      }
      case 'DAYS': {
        expiresIn += 'd';
        break;
      }
    }
    const token = await this._jwtService.signAsync(data, {
      secret: this._configService.get('JWTKEY'),
      expiresIn: expiresIn
    });

    return `${data.link}?token=${token}`;
  }
}
