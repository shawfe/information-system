import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ValidateTokenService {
  constructor(private readonly _jwtService: JwtService) {}

  public validate(token: string) {
    let tokenData: any;

    try {
      tokenData = this._jwtService.decode(token);
    } catch (e) {
      return { valid: true };
    }

    if (!tokenData || tokenData?.exp < Date.now() / 1000) {
      return { valid: false };
    }

    return { valid: true };
  }
}
