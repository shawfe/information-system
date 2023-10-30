import { ChaptersModule } from '@modules/chapters/chapters.module';
import { ExercisesModule } from '@modules/exercises/exercises.module';
import { Module } from '@nestjs/common';
import { SectionController } from './sections.controller';
import { SectionsService } from './sections.service';

@Module({
  imports: [ChaptersModule, ExercisesModule],
  providers: [SectionsService],
  controllers: [SectionController],
  exports: [SectionsService]
})
export class SectionsModule {}
