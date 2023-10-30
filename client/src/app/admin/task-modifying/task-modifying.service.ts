import { Injectable } from '@angular/core';
import { ISection } from 'app/models/section.data';
import { SectionType } from 'app/models/book.data';
import { Exercise, IExercise, IMatchTask, IPickTask } from 'app/models/exercise.data';
import { BookSectionsRequestsService } from 'app/services/book-sections-requests.service';
import { ExerciseRequestsService } from 'app/services/exercise-requests.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { StateManagerAdminService } from '../state.manager.admin.service';

@Injectable()
export class TaskModifyingService {
  private _bookSections$ = new BehaviorSubject<ISection[]>([]);
  private _selectedSectionType$ = new BehaviorSubject<SectionType>('JAVASCRIPT');
  private _selectedExercise$ = new BehaviorSubject<IExercise>(null);
  private _exercises$ = new BehaviorSubject<IExercise[]>([]);
  private _isCreateTaskMode = false;

  constructor(
    private _bookSectionsRequestsService: BookSectionsRequestsService,
    private _exerciseRequestsService: ExerciseRequestsService,
    private _stateManagerAdminService: StateManagerAdminService
  ) {}

  init(): void {
    this._isCreateTaskMode = this._stateManagerAdminService.getAdminPageType() === 'TASK_ADDING';
    this.setSelectedSectionType('JAVASCRIPT');
    this.loadBookSections();
    this.setSelectedExercise(new Exercise());
  }

  destroy(): void {
    this.setBookSections([]);
    this.setExercises([]);
    this.setSelectedExercise(null);
  }

  public isCreateTaskMode(): boolean {
    return this._isCreateTaskMode;
  }

  public getBookSections(): ISection[] {
    return this._bookSections$.getValue();
  }

  public setBookSections(value: ISection[]): void {
    this._bookSections$.next(value);
  }

  public getBookSectionsObservable(): Observable<ISection[]> {
    return this._bookSections$.asObservable();
  }

  public getSelectedSectionType(): SectionType {
    return this._selectedSectionType$.getValue();
  }

  public setSelectedSectionType(value: SectionType): void {
    this._selectedSectionType$.next(value);
  }

  public getSelectedExercise(): IExercise {
    return this._selectedExercise$.getValue();
  }

  public setSelectedExercise(value: IExercise): void {
    const exercise = JSON.parse(JSON.stringify(value));
    this._selectedExercise$.next(exercise);
  }

  public getSelectedExerciseObservable(): Observable<IExercise> {
    return this._selectedExercise$.asObservable();
  }

  public resetSelectedExercise(): void {
    if (this.isCreateTaskMode()) {
      this.setSelectedExercise(new Exercise());
      return;
    }

    const selectedExercise = this.getSelectedExercise();
    this.setSelectedExercise(
      this.getExercises().find((exercise) => exercise.id === selectedExercise.id)
    );
  }

  public getExercises(): IExercise[] {
    return this._exercises$.getValue();
  }

  public setExercises(value: IExercise[]): void {
    this._exercises$.next(value);
  }

  public getExercisesObservable(): Observable<IExercise[]> {
    return this._exercises$.asObservable();
  }

  public loadBookSections(): void {
    this._bookSectionsRequestsService
      .requestBookSections(this.getSelectedSectionType())
      .subscribe((sections) => {
        this.setBookSections(sections);
      });
  }

  public loadExercises(sectionId: string): void {
    this._exerciseRequestsService.requestExercisesBySection(sectionId).subscribe((exercises) => {
      this.setExercises(exercises);
    });
  }

  public saveChanges(sectionId: string): void {
    const exercise = this.getSelectedExercise();
    if (this.isCreateTaskMode()) {
      exercise.sectionId = sectionId;
      this._exerciseRequestsService.requestCreateExercise(exercise).subscribe(() => {
        this.resetSelectedExercise();
      });
    } else if (exercise.variants.length === 0) {
      this._exerciseRequestsService.requestRemoveExercise(exercise.id).subscribe();
    } else {
      this._exerciseRequestsService
        .requestUpdateExercise(exercise.id, {
          title: exercise.title,
          variants: exercise.variants
        })
        .subscribe();
    }
  }

  public validateChanges(): boolean {
    const exercise = this.getSelectedExercise();

    if (!exercise.variants.length) {
      return false;
    }

    for (const variant of exercise.variants) {
      if (!variant.tasks.length) {
        return false;
      }

      for (const task of variant.tasks) {
        let typedTask: IMatchTask | IPickTask;

        if (task.type === 'MATCH') {
          typedTask = task as IMatchTask;
          if (!typedTask.answers.length) {
            return false;
          }
        } else {
          typedTask = task as IPickTask;
          if (!typedTask.question || !typedTask.answers.length) {
            return false;
          }
        }
      }
    }

    return true;
  }
}
