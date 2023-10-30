import { Injectable } from '@nestjs/common';
import { Exercise } from '@schemas/exercise.schema';
import { ExercisesDatabaseService } from 'src/core/database-services/exercises-database.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { ExerciseListDto } from './dto/exercise-list.dto';
import { ExerciseDto } from './dto/exercise.dto';
import { MatchTaskDto } from './dto/match-task.dto';
import { PickAnswerDto } from './dto/pick-answer.dto';
import { PickTaskDto } from './dto/pick-task.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ExercisesService {
  constructor(private _exercisesDatabaseService: ExercisesDatabaseService) {}

  public toExerciseDto(exercise: Exercise): ExerciseDto {
    return new ExerciseDto(exercise);
  }

  public toExerciseListDto(exercise: Exercise): ExerciseListDto {
    return new ExerciseListDto(exercise);
  }

  public async getAllExercises(): Promise<ExerciseDto[]> {
    const exercisesDb = await this._exercisesDatabaseService.findAll();

    return new Promise((resolve) => {
      resolve(exercisesDb.map((exercise) => this.toExerciseDto(exercise)));
    });
  }

  public async getExerciseList(): Promise<ExerciseListDto[]> {
    const exercisesDb = await this._exercisesDatabaseService.findAll();

    return new Promise((resolve) => {
      resolve(exercisesDb.map((exercise) => this.toExerciseListDto(exercise)));
    });
  }

  public async getExercisesBySection(sectionId: string): Promise<ExerciseDto[]> {
    const exercisesDb = await this._exercisesDatabaseService.findBySectionId(sectionId);

    return new Promise((resolve) => {
      resolve(exercisesDb.map((exercise) => this.toExerciseDto(exercise)));
    });
  }

  public async getExercisesBySectionForUser(sectionId: string): Promise<ExerciseDto[]> {
    const exercisesDb = await this._exercisesDatabaseService.findBySectionId(sectionId);
    const exercises = exercisesDb.map(this.toExerciseDto);
    const resultExercises: ExerciseDto[] = [];
    for (const exercise of exercises) {
      resultExercises.push(this._prepareExerciseForUser(exercise));
    }

    return new Promise((resolve) => {
      resolve(resultExercises);
    });
  }

  public async getExercisesBySections(): Promise<Map<string, ExerciseListDto[]>> {
    const exercisesBySection = new Map<string, ExerciseListDto[]>();
    const exercisesDb = await this._exercisesDatabaseService.findAll();
    exercisesDb.sort((a, b) => a.order - b.order);

    for (const exercise of exercisesDb) {
      if (exercisesBySection.has(exercise.sectionId)) {
        exercisesBySection.get(exercise.sectionId).push(this.toExerciseListDto(exercise));
      } else {
        exercisesBySection.set(exercise.sectionId, [this.toExerciseListDto(exercise)]);
      }
    }

    return new Promise((resolve) => {
      resolve(exercisesBySection);
    });
  }

  public async getExercise(id: string): Promise<ExerciseDto> {
    const exerciseDb = await this._exercisesDatabaseService.findOneByID(id);

    return new Promise((resolve) => {
      resolve(this.toExerciseDto(exerciseDb));
    });
  }

  public async getExerciseForUser(id: string): Promise<ExerciseDto> {
    const exerciseDb = await this._exercisesDatabaseService.findOneByID(id);

    return new Promise((resolve) => {
      resolve(this._prepareExerciseForUser(this.toExerciseDto(exerciseDb)));
    });
  }

  public async createExercise(createExerciseDto: CreateExerciseDto): Promise<ExerciseDto> {
    const exerciseWithUuid = this._setUuidToExerciseEntities(createExerciseDto);
    const createdExercise = await this._exercisesDatabaseService.create(exerciseWithUuid);
    return new Promise((resolve) => resolve(this.toExerciseDto(createdExercise)));
  }

  public async updateExercise(id: string, updateExerciseDto: UpdateExerciseDto): Promise<void> {
    const exerciseWithUuid = this._setUuidToExerciseEntities(updateExerciseDto);
    await this._exercisesDatabaseService.update(id, exerciseWithUuid);
    return new Promise((resolve) => resolve());
  }

  public async removeExercise(id: string): Promise<void> {
    await this._exercisesDatabaseService.remove(id);
    return new Promise((resolve) => resolve());
  }

  private _prepareExerciseForUser(exercise: ExerciseDto): ExerciseDto {
    const random = Math.floor(Math.random() * exercise.variants.length);
    const randomVariant = exercise.variants[random];

    for (const [taskIndex, task] of randomVariant.tasks.entries()) {
      let typedTask: PickTaskDto | MatchTaskDto;
      switch (task.type) {
        case 'PICK_ONE':
        case 'PICK_SOME': {
          typedTask = task as PickTaskDto;
          const filtredAnswers: PickAnswerDto[] = [];
          for (const answer of task.answers) {
            const { isRight, ...data } = answer as PickAnswerDto;
            filtredAnswers.push(data as PickAnswerDto);
          }
          typedTask.answers = filtredAnswers;
          randomVariant.tasks[taskIndex] = typedTask;
          break;
        }
        case 'MATCH': {
          typedTask = task as MatchTaskDto;
          const leftParts: string[] = [];
          const rightParts: string[] = [];
          for (const answer of typedTask.answers) {
            leftParts.push(answer.leftPart);
            rightParts.push(answer.rightPart);
          }
          const shuffledLeftParts: string[] = this._shuffle(leftParts);
          const shuffledRightParts = this._shuffle(rightParts);
          for (const [index, answer] of typedTask.answers.entries()) {
            answer.leftPart = shuffledLeftParts.at(index);
            answer.rightPart = shuffledRightParts.at(index);
          }
          randomVariant.tasks[taskIndex] = typedTask;
          break;
        }
        default: {
        }
      }
    }
    exercise.variants = [randomVariant];

    return exercise;
  }

  private _shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  private _setUuidToExerciseEntities<T extends CreateExerciseDto | UpdateExerciseDto>(
    exercise: T
  ): T {
    for (const variant of exercise.variants) {
      if (!variant.uuid) {
        variant.uuid = uuid();
      }

      for (const task of variant.tasks) {
        if (!task.uuid) {
          task.uuid = uuid();
        }

        for (const answer of task.answers) {
          if (!answer.uuid) {
            answer.uuid = uuid();
          }
        }
      }
    }
    return exercise;
  }
}
