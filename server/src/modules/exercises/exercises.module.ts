import { Module } from '@nestjs/common';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';

@Module({
  imports: [],
  providers: [ExercisesService],
  controllers: [ExercisesController],
  exports: [ExercisesService]
})
export class ExercisesModule {}
