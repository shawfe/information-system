import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CodeExecutorService } from './code-executor.service';

@Controller('execute')
export class CodeExecutorController {
  constructor(private _codeExecutorService: CodeExecutorService) {}

  @Post('')
  async executeCode(@Body() executeData: { code: string }) {
    this._codeExecutorService.executeCode(executeData.code);
  }
}
