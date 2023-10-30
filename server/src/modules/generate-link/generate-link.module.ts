import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GenerateLinkController } from './generate-link.controller';
import { GenerateLinkService } from './generate-link.service';

@Module({
  imports: [
    HttpModule,
    JwtModule.register({
      secret: process.env.JWTKEY
    })
  ],
  providers: [GenerateLinkService],
  controllers: [GenerateLinkController]
})
export class GenerateLinkModule {}
