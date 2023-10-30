import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ValidateTokenController } from './validate-token.contorller';
import { ValidateTokenService } from './validate-token.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWTKEY
    })
  ],
  providers: [ValidateTokenService],
  controllers: [ValidateTokenController]
})
export class ValidateTokenModule {}
