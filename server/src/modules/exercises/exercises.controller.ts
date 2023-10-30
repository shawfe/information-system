import RequestWithUser from '@modules/users/interfaces/request-with-user.interface';
import {
  Body,
  Controller,
  Delete,
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
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { ExerciseListDto } from './dto/exercise-list.dto';
import { ExerciseDto } from './dto/exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExercisesService } from './exercises.service';

@UseGuards(AuthGuard('jwt'))
@Controller('exercise')
export class ExercisesController {
  constructor(private _exercisesService: ExercisesService) {}

  @Get()
  getAll(
    @Query('sectionId') sectionId: string,
    @Req() request: RequestWithUser
  ): Promise<ExerciseDto[]> {
    if (request.user.accountType !== 'ADMIN') {
      throw new UnauthorizedException();
    }

    return this._exercisesService.getExercisesBySection(sectionId);
  }

  @Get('/list')
  getList(): Promise<ExerciseListDto[]> {
    return this._exercisesService.getExerciseList();
  }

  @Get(':id')
  getContent(@Param('id') id: string, @Req() request: RequestWithUser): Promise<ExerciseDto> {
    if (request.user.accountType !== 'ADMIN') {
      return this._exercisesService.getExerciseForUser(id);
    }
    return this._exercisesService.getExercise(id);
  }

  @Post()
  create(
    @Body() createExerciseDto: CreateExerciseDto,
    @Req() request: RequestWithUser
  ): Promise<ExerciseDto> {
    if (request.user.accountType !== 'ADMIN') {
      throw new UnauthorizedException();
    }

    return this._exercisesService.createExercise(createExerciseDto);
  }

  @Put(':id')
  update(
    @Body() updateExerciseDto: UpdateExerciseDto,
    @Param('id') id: string,
    @Req() request: RequestWithUser
  ): Promise<void> {
    if (request.user.accountType !== 'ADMIN') {
      throw new UnauthorizedException();
    }

    return this._exercisesService.updateExercise(id, updateExerciseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request: RequestWithUser): Promise<void> {
    if (request.user.accountType !== 'ADMIN') {
      throw new UnauthorizedException();
    }

    return this._exercisesService.removeExercise(id);
  }
}
