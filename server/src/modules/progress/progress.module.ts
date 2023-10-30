import { Module } from '@nestjs/common';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';

@Module({
  providers: [ProgressService],
  controllers: [ProgressController],
  exports: [ProgressService]
})
export class ProgressModule {}
