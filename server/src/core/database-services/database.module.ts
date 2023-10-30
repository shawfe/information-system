import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Section, SectionSchema } from '@schemas/section.schema';
import { Chapter, ChapterSchema } from '@schemas/chapter.schema';
import { Exercise, ExerciseSchema } from '@schemas/exercise.schema';
import { Group, GroupSchema } from '@schemas/group.schema';
import { Progress, ProgressSchema } from '@schemas/progress.schema';
import { User, UserSchema } from '@schemas/user.schema';
import { SectionsDatabaseService } from './sections-database.service';
import { ChaptersDatabaseService } from './chapters-database.service';
import { ExercisesDatabaseService } from './exercises-database.service';
import { GroupsDatabaseService } from './groups-database.service';
import { ProgressDatabaseService } from './progress-database.service';
import { UsersDatabaseService } from './users-database.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ]),
    MongooseModule.forFeature([
      {
        name: Group.name,
        schema: GroupSchema
      }
    ]),
    MongooseModule.forFeature([
      {
        name: Section.name,
        schema: SectionSchema
      }
    ]),
    MongooseModule.forFeature([
      {
        name: Chapter.name,
        schema: ChapterSchema
      }
    ]),
    MongooseModule.forFeature([
      {
        name: Exercise.name,
        schema: ExerciseSchema
      }
    ]),
    MongooseModule.forFeature([
      {
        name: Progress.name,
        schema: ProgressSchema
      }
    ])
  ],
  providers: [
    UsersDatabaseService,
    GroupsDatabaseService,
    SectionsDatabaseService,
    ChaptersDatabaseService,
    ExercisesDatabaseService,
    ProgressDatabaseService
  ],
  exports: [
    UsersDatabaseService,
    GroupsDatabaseService,
    SectionsDatabaseService,
    ChaptersDatabaseService,
    ExercisesDatabaseService,
    ProgressDatabaseService
  ]
})
export class DatabaseModule {}
