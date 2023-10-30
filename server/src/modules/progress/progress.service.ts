import { ExerciseDto } from '@modules/exercises/dto/exercise.dto';
import { MatchTaskDto } from '@modules/exercises/dto/match-task.dto';
import { PickTaskDto } from '@modules/exercises/dto/pick-task.dto';
import { VariantDto } from '@modules/exercises/dto/variant.dto';
import { SectionType } from '@modules/users/dto/types.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Progress } from '@schemas/progress.schema';
import { SectionsDatabaseService } from 'src/core/database-services/sections-database.service';
import { ChaptersDatabaseService } from 'src/core/database-services/chapters-database.service';
import { ExercisesDatabaseService } from 'src/core/database-services/exercises-database.service';
import { ProgressDatabaseService } from 'src/core/database-services/progress-database.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { ProgressBarDto } from './dto/progress-bar.dto';
import { ProgressChapterDto } from './dto/progress-chapter.dto';
import { ProgressExerciseDto } from './dto/progress-exercise.dto';
import { ProgressItemDto } from './dto/progress-item.dto';
import { ProgressDto } from './dto/progress.dto';
import { FinishedItemsDto } from './dto/finished-items.dto';

@Injectable()
export class ProgressService {
  constructor(
    private _progressDatabaseSerivce: ProgressDatabaseService,
    private _chaptersDatabaseService: ChaptersDatabaseService,
    private _exercisesDatabaseService: ExercisesDatabaseService,
    private _sectionsDatabaseService: SectionsDatabaseService
  ) {}

  public toProgressDto(progress: Progress): ProgressDto {
    return new ProgressDto(progress);
  }

  public async getProgressByUserId(userId: string): Promise<ProgressDto> {
    const progressDb = await this._progressDatabaseSerivce.findOneByUserId(userId);
    return new Promise((resolve) => {
      resolve(this.toProgressDto(progressDb));
    });
  }

  public async getFinishedItemsIds(userId: string): Promise<FinishedItemsDto> {
    const progressDb = await this._progressDatabaseSerivce.findOneByUserId(userId);
    if (!progressDb) {
      throw new NotFoundException();
    }

    const finishedItems = progressDb.progressItems.map((item) => {
      if (item.type === 'CHAPTER') {
        return (item.itemData as ProgressChapterDto).chapterId;
      } else if (item.type === 'EXERCISE') {
        return (item.itemData as ProgressExerciseDto).exerciseId;
      }
    });

    return new Promise((resolve) => {
      resolve({ finishedItems });
    });
  }

  public async createProgress(userId: string): Promise<ProgressDto> {
    const { totalJavaScriptItems, totalTypeScriptItems } =
      await this._calculateTotalSectionTypeItems();

    const progressBars: ProgressBarDto[] = [
      new ProgressBarDto({
        sectionType: 'JAVASCRIPT',
        finishedProgressItems: 0,
        totalProgressItems: totalJavaScriptItems
      }),
      new ProgressBarDto({
        sectionType: 'TYPESCRIPT',
        finishedProgressItems: 0,
        totalProgressItems: totalTypeScriptItems
      })
    ];

    const newProgress = new CreateProgressDto();
    newProgress.userId = userId;
    newProgress.progressBars = progressBars;

    const createProgressDb = await this._progressDatabaseSerivce.create(newProgress);

    return new Promise((resolve) => {
      resolve(this.toProgressDto(createProgressDb));
    });
  }

  public async updateProgressChapter(userId: string, chapterId: string): Promise<void> {
    const userProgressDb = await this._progressDatabaseSerivce.findOneByUserId(userId);
    const chapterDb = await this._chaptersDatabaseService.findOneByID(chapterId);
    const sectionDb = await this._sectionsDatabaseService.findOneByID(chapterDb.sectionId);
    const lastModifiedDate = this._getFormatedDate();

    const newProgressChapter = new ProgressChapterDto({
      chapterId: chapterId,
      title: chapterDb.title
    });

    const newProgressItem = new ProgressItemDto({
      sectionType: sectionDb.sectionType,
      type: 'CHAPTER',
      finishedDate: lastModifiedDate,
      itemData: newProgressChapter
    });

    const progressBars = userProgressDb.progressBars;
    const progressBar = progressBars.find((bar) => bar.sectionType === sectionDb.sectionType);

    progressBar.totalProgressItems = await this._getTotalItemsBySectionType(sectionDb.sectionType);
    progressBar.finishedProgressItems =
      userProgressDb.progressItems.filter((item) => item.sectionType === sectionDb.sectionType)
        .length + 1;

    await this._progressDatabaseSerivce.updateProgress(userId, {
      lastModifiedDate: lastModifiedDate,
      progressItem: newProgressItem,
      progressBars: progressBars
    });

    return new Promise((resolve) => {
      resolve();
    });
  }

  public async updateProgressExercise(userId: string, exerciseDto: ExerciseDto): Promise<void> {
    const userProgressDb = await this._progressDatabaseSerivce.findOneByUserId(userId);
    const exerciseDb = await this._exercisesDatabaseService.findOneByID(exerciseDto.id);
    const sectionDb = await this._sectionsDatabaseService.findOneByID(exerciseDb.sectionId);
    const lastModifiedDate = this._getFormatedDate();

    const result = this._checkVariantUserAnswers(
      exerciseDto.variants.at(0),
      exerciseDb.variants.find((variant) => variant.uuid === exerciseDto.variants.at(0).uuid)
    );

    const newProgressExercise = new ProgressExerciseDto({
      exerciseId: exerciseDto.id,
      title: exerciseDto.title,
      earnedPoints: result.earnedPoints,
      maxPoints: result.totalPoints,
      mark: this._calculateMark(result.earnedPoints, result.totalPoints)
    });

    const newProgressItem = new ProgressItemDto({
      sectionType: sectionDb.sectionType,
      type: 'EXERCISE',
      finishedDate: lastModifiedDate,
      itemData: newProgressExercise
    });

    const progressBars = userProgressDb.progressBars;
    const progressBar = progressBars.find((bar) => bar.sectionType === sectionDb.sectionType);

    progressBar.totalProgressItems = await this._getTotalItemsBySectionType(sectionDb.sectionType);
    progressBar.finishedProgressItems =
      userProgressDb.progressItems.filter((item) => item.sectionType === sectionDb.sectionType)
        .length + 1;

    await this._progressDatabaseSerivce.updateProgress(userId, {
      lastModifiedDate: lastModifiedDate,
      progressItem: newProgressItem,
      progressBars: progressBars
    });

    return new Promise((resolve) => {
      resolve();
    });
  }

  public removeUserProgress(userId: string): Promise<Progress> {
    return this._progressDatabaseSerivce.removeByUserId(userId);
  }

  private async _getTotalItemsBySectionType(sectionType: SectionType): Promise<number> {
    const totalItems = await this._calculateTotalSectionTypeItems();

    return new Promise((resolve) => {
      if (sectionType === 'JAVASCRIPT') {
        resolve(totalItems.totalJavaScriptItems);
      } else if (sectionType === 'TYPESCRIPT') {
        resolve(totalItems.totalTypeScriptItems);
      }
    });
  }

  private async _calculateTotalSectionTypeItems(): Promise<{
    totalJavaScriptItems: number;
    totalTypeScriptItems: number;
  }> {
    const chaptersDb = await this._chaptersDatabaseService.findAllWithoutContent();
    const exercisesDb = await this._exercisesDatabaseService.findAllWithoutVariants();
    const sectionsDb = await this._sectionsDatabaseService.findAll();

    const sectionIdsByJavaScript: string[] = [];
    const sectionIdsByTypeScript: string[] = [];
    let totalJavaScriptItems = 0;
    let totalTypeScriptItems = 0;

    for (const section of sectionsDb) {
      switch (section.sectionType) {
        case 'JAVASCRIPT': {
          sectionIdsByJavaScript.push(section._id.toString());
          break;
        }
        case 'TYPESCRIPT': {
          sectionIdsByTypeScript.push(section._id.toString());
          break;
        }
      }
    }

    const sectionsJavaScritpSet = new Set(sectionIdsByJavaScript);
    const sectionsTypeScriptSet = new Set(sectionIdsByTypeScript);

    for (const chapter of chaptersDb) {
      if (sectionsJavaScritpSet.has(chapter.sectionId)) {
        totalJavaScriptItems++;
      } else if (sectionsTypeScriptSet.has(chapter.sectionId)) {
        totalTypeScriptItems++;
      }
    }

    for (const exercise of exercisesDb) {
      if (sectionsJavaScritpSet.has(exercise.sectionId)) {
        totalJavaScriptItems++;
      } else if (sectionsTypeScriptSet.has(exercise.sectionId)) {
        totalTypeScriptItems++;
      }
    }

    return new Promise((resolve) => {
      resolve({ totalJavaScriptItems, totalTypeScriptItems });
    });
  }

  private _getFormatedDate(): string {
    const date = new Date();
    let day = '' + date.getDate();
    let month = '' + (date.getMonth() + 1);
    const year = date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('.');
  }

  private _calculateMark(earndPoints: number, totalPoints: number): number {
    const persentOfSolved = Math.ceil((earndPoints / totalPoints) * 100);
    let result: number;

    switch (true) {
      case persentOfSolved > 85: {
        result = 5;
        break;
      }
      case persentOfSolved > 65: {
        result = 4;
        break;
      }
      case persentOfSolved > 40: {
        result = 3;
        break;
      }
      default: {
        result = 2;
      }
    }

    return result;
  }

  private _checkVariantUserAnswers(
    variantUser: VariantDto,
    variantDb: VariantDto
  ): { earnedPoints: number; totalPoints: number } {
    let totalPoints = 0;
    let earnedPoints = 0;

    for (const taskUser of variantUser.tasks) {
      const taskDb = variantDb.tasks.find((task) => task.uuid === taskUser.uuid);
      totalPoints += 1;

      switch (taskUser.type) {
        case 'PICK_ONE': {
          const userAnswerId = (taskUser as PickTaskDto).answers.find(
            (answer) => answer.isRight
          ).uuid;
          const dbAnswerId = (taskDb as PickTaskDto).answers.find((answer) => answer.isRight).uuid;

          if (userAnswerId === dbAnswerId) {
            earnedPoints += 1;
          }
          break;
        }
        case 'PICK_SOME': {
          const userAnswerIds = (taskUser as PickTaskDto).answers
            .filter((answer) => answer.isRight)
            .map((answer) => answer.uuid);
          const dbAnswerIds = (taskDb as PickTaskDto).answers
            .filter((answer) => answer.isRight)
            .map((answer) => answer.uuid);
          let rightAnswers = 0;

          for (const userAnswerId of userAnswerIds) {
            if (dbAnswerIds.indexOf(userAnswerId) !== -1) {
              rightAnswers += 1;
            }
          }

          if (rightAnswers === dbAnswerIds.length) {
            earnedPoints += 1;
          }
          break;
        }
        case 'MATCH': {
          const userAnswers = (taskUser as MatchTaskDto).answers;
          const dbAnswers = (taskDb as MatchTaskDto).answers;
          let rightAnswers = 0;
          for (const userAnswer of userAnswers) {
            const dbAnswer = dbAnswers.find((asnwer) => asnwer.uuid === userAnswer.uuid);
            if (userAnswer.rightPart === dbAnswer.rightPart) {
              rightAnswers += 1;
            }
          }

          if (rightAnswers === dbAnswers.length) {
            earnedPoints += 1;
          }

          break;
        }

        default: {
        }
      }
    }

    return { earnedPoints, totalPoints };
  }

  private getNestedObject(obj, key) {
    return key.split('.').reduce(function (o, x) {
      return typeof o == 'undefined' || o === null ? o : o[x];
    }, obj);
  }
}
