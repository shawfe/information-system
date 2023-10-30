import { Body, Controller, Post } from '@nestjs/common';
import { GenerateLinkRequestDto } from './dto/generate-link-request.dto';
import { GenerateLinkService } from './generate-link.service';

@Controller('generate-link')
export class GenerateLinkController {
  constructor(private readonly _generateLinkService: GenerateLinkService) {}

  @Post()
  async generateLink(@Body() data: GenerateLinkRequestDto) {
    return this._generateLinkService.generateLink(data);
  }
}
