import { ExerciseDto } from '@modules/exercises/dto/exercise.dto';
import RequestWithUser from '@modules/users/interfaces/request-with-user.interface';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FinishedItemsDto } from './dto/finished-items.dto';
import { ProgressDto } from './dto/progress.dto';
import { ProgressService } from './progress.service';

@UseGuards(AuthGuard('jwt'))
@Controller('progress')
export class ProgressController {
  constructor(private _progressSerivce: ProgressService) {}

  @Post('/chapter')
  updateProgressChapter(
    @Body() data: { chapterId: string },
    @Req() request: RequestWithUser
  ): Promise<void> {
    return this._progressSerivce.updateProgressChapter(request.user._id.toString(), data.chapterId);
  }

  @Post('/exercise')
  updateProgressExercise(
    @Body() data: { exercise: ExerciseDto },
    @Req() request: RequestWithUser
  ): Promise<void> {
    return this._progressSerivce.updateProgressExercise(request.user._id.toString(), data.exercise);
  }

  @Get('/one')
  getProgressList(
    @Query('userId') userId: string,
    @Req() request: RequestWithUser
  ): Promise<ProgressDto> {
    if (request.user.accountType !== 'ADMIN') {
      throw new UnauthorizedException();
    }

    return this._progressSerivce.getProgressByUserId(userId);
  }

  @Get('/me')
  getProgress(@Req() request: RequestWithUser): Promise<ProgressDto> {
    return this._progressSerivce.getProgressByUserId(request.user._id.toString());
  }

  @Get('/finished-items')
  getFinishedItems(@Req() request: RequestWithUser): Promise<FinishedItemsDto> {
    return this._progressSerivce.getFinishedItemsIds(request.user._id.toString());
  }
}
