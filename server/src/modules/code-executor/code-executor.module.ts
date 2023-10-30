import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CodeExecutorController } from './code-executor.controller';
import { CodeExecutorService } from './code-executor.service';

@Module({
  imports: [HttpModule],
  providers: [CodeExecutorService],
  controllers: [CodeExecutorController]
})
export class CodeExecutorModule {}
