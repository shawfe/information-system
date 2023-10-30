import { Body, Controller, Post } from '@nestjs/common';
import { ValidateTokenService } from './validate-token.service';

@Controller('validate-token')
export class ValidateTokenController {
  constructor(private readonly _validatTokenService: ValidateTokenService) {}

  @Post()
  validateToken(@Body() data: { token: string }) {
    return this._validatTokenService.validate(data.token);
  }
}
