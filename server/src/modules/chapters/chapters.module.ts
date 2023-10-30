import { Module } from '@nestjs/common';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';

@Module({
  imports: [],
  providers: [ChaptersService],
  controllers: [ChaptersController],
  exports: [ChaptersService]
})
export class ChaptersModule {}
