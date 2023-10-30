import { SectionsModule } from '@modules/sections/sections.module';
import { ChaptersModule } from '@modules/chapters/chapters.module';
import { CodeExecutorModule } from '@modules/code-executor/code-executor.module';
import { ExercisesModule } from '@modules/exercises/exercises.module';
import { GenerateLinkModule } from '@modules/generate-link/generate-link.module';
import { GroupsModule } from '@modules/groups/groups.module';
import { ProgressModule } from '@modules/progress/progress.module';
import { ValidateTokenModule } from '@modules/validate-token/validate-token.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database-services/database.module';
import { EmailModule } from './core/email/email.module';
import { EmailConfirmationGuard } from './core/guards/email-confirmation.guard';
import { UserExistsGuard } from './core/guards/user-exists.guard';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(`mongodb://localhost:27017/paper-server`),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    GroupsModule,
    SectionsModule,
    ChaptersModule,
    ExercisesModule,
    ProgressModule,
    EmailModule,
    CodeExecutorModule,
    GenerateLinkModule,
    ValidateTokenModule,
    DatabaseModule
  ],
  controllers: [AppController],
  providers: [AppService, EmailConfirmationGuard, UserExistsGuard]
})
export class AppModule {}
