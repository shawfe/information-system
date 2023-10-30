import { UsersModule } from '@modules/users/users.module';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailConfirmationController } from './email-confirmation.controller';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailService } from './email.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWTKEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION }
    }),
    UsersModule
  ],
  controllers: [EmailConfirmationController],
  providers: [EmailService, EmailConfirmationService],
  exports: [EmailService, EmailConfirmationService]
})
export class EmailModule {}
