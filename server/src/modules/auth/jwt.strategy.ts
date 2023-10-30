import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersDatabaseService } from 'src/core/database-services/users-database.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _usersDatabaseService: UsersDatabaseService) {
    super({
      usernameField: 'email',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTKEY
    });
  }

  async validate(payload: any) {
    const user = await this._usersDatabaseService.findOneByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException('You are not authorized to perform the operation');
    }

    return user;
  }
}
