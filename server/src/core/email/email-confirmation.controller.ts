import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from '@modules/users/interfaces/request-with-user.interface';
import { ConfirmEmailDto } from './dto/confirm-email.dto';

@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(private readonly _emailConfirmationService: EmailConfirmationService) {}

  @Post('confirm')
  async confirm(@Body() confirmationData: ConfirmEmailDto) {
    const email = await this._emailConfirmationService.decodeConfirmationToken(
      confirmationData.token
    );
    await this._emailConfirmationService.confirmEmail(email);
    return { confirmed: true };
  }

  @Post('resend-confirmation-link')
  @UseGuards(AuthGuard('jwt'))
  async resendConfirmationLink(@Req() request: RequestWithUser) {
    await this._emailConfirmationService.resendConfirmationLink(request.user._id.toString());
  }
}
