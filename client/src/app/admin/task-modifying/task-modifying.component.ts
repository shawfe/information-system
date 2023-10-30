import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogService } from 'app/components/confirm-dialog/confirm-dialog.service';
import { ISection } from 'app/models/section.data';
import { SectionType, SectionTypes } from 'app/models/book.data';
import {
  IExercise,
  IMatchTask,
  IPickTask,
  IVariant,
  MatchTask,
  PickTask,
  TaskType,
  TaskTypes,
  Variant
} from 'app/models/exercise.data';
import { BehaviorSubject, debounceTime, Observable, Subject, takeUntil } from 'rxjs';
import { AdminService } from '../admin.service';
import { TaskModifyingService } from './task-modifying.service';

@Component({
  selector: 'users-registration',
  templateUrl: './task-modifying.component.html',
  styleUrls: ['./task-modifying.component.scss']
})
export class TaskModifyingComponent implements OnInit, OnDestroy {
  @ViewChild('variantPaginator') set variantPaginatorElement(paginator: MatPaginator) {
    this._variantPaginator = paginator;
    this.variantsDataSource.paginator = paginator;
  }
  @ViewChild('taskPaginator') set taskPaginatorElement(paginator: MatPaginator) {
    this._taskPaginator = paginator;
    this.tasksDataSource.paginator = paginator;
  }

  public variantsDataSource = new MatTableDataSource<IVariant>();
  public variants$: Observable<IVariant[]>;
  public tasksDataSource = new MatTableDataSource<IPickTask | IMatchTask>();
  public tasks$: Observable<(IPickTask | IMatchTask)[]>;
  public taskTypeFormArray = new FormArray([]);

  public selectedExercise$: Observable<IExercise>;
  public exercises$: Observable<IExercise[]>;
  public exerciseOptionsFormGroup: FormGroup;
  public variantsFormArray: FormArray;
  public sectionTypes = SectionTypes;
  public taskTypes = TaskTypes;
  public bookSections$: Observable<ISection[]>;
  public isCreateTaskMode = false;
  public isShowApplyRename$ = new BehaviorSubject<boolean>(false);
  public isUnsavedChanges$ = new BehaviorSubject<boolean>(false);

  private _variantPaginator: MatPaginator;
  private _taskPaginator: MatPaginator;
  private _unsubscribe = new Subject<void>();

  get sectionControl(): FormControl {
    return this.exerciseOptionsFormGroup.get('section') as FormControl;
  }

  get exerciseControl(): FormControl {
    return this.exerciseOptionsFormGroup.get('exercise') as FormControl;
  }

  get renameExerciseControl(): FormControl {
    return this.exerciseOptionsFormGroup.get('renameExercise') as FormControl;
  }

  get variantIndex(): number {
    return this._variantPaginator?.pageIndex ?? 0;
  }

  get taskIndex(): number {
    return this._taskPaginator?.pageIndex ?? 0;
  }

  constructor(
    private _taskModifyingService: TaskModifyingService,
    private _adminService: AdminService,
    private _confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this._taskModifyingService.init();
    this.isCreateTaskMode = this._taskModifyingService.isCreateTaskMode();
    this.selectedExercise$ = this._taskModifyingService.getSelectedExerciseObservable();
    this.bookSections$ = this._taskModifyingService.getBookSectionsObservable();
    this.exercises$ = this._taskModifyingService.getExercisesObservable();
    this.variants$ = this.variantsDataSource.connect();
    this.tasks$ = this.tasksDataSource.connect();

    this.exerciseOptionsFormGroup = new FormGroup({
      sectionType: new FormControl(this._taskModifyingService.getSelectedSectionType()),
      section: new FormControl(''),
      exercise: this.isCreateTaskMode
        ? new FormControl('', [Validators.required])
        : new FormControl(''),
      renameExercise: new FormControl('', [Validators.required])
    });

    this.variantsFormArray = new FormArray([]);

    this._taskModifyingService
      .getSelectedExerciseObservable()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((exercise) => {
        this.variantsDataSource.data = exercise.variants;

        if (this.isCreateTaskMode) {
          this._adminService.resetControl(this.exerciseControl, exercise.title);
        } else {
          this._adminService.resetControl(this.renameExerciseControl, exercise.title);

          if (exercise?.id) {
            this.renameExerciseControl.enable();
          } else {
            this.renameExerciseControl.disable();
          }

          if (exercise.variants.length) {
            this.tasksDataSource.data = exercise.variants.at(this.variantIndex).tasks;
            this.taskTypeFormArray.clear();
            for (const [index, task] of exercise.variants.at(this.variantIndex).tasks.entries()) {
              this.taskTypeFormArray.setControl(index, new FormControl(task.type));
            }
          }
        }
      });

    if (!this.isCreateTaskMode) {
      this.renameExerciseControl.valueChanges.pipe(debounceTime(20)).subscribe((value) => {
        const selectedExercise = this._taskModifyingService.getSelectedExercise();
        this.isShowApplyRename$.next(
          value && selectedExercise.id && value !== selectedExercise.title
        );
      });
    }
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
    this._taskModifyingService.destroy();
  }

  public onChangeSectionType(sectionType: SectionType) {
    this._taskModifyingService.setSelectedSectionType(sectionType);
    this._taskModifyingService.loadBookSections();
  }

  public onChangeSection(section: ISection) {
    if (this.isCreateTaskMode) {
      return;
    }
    this._taskModifyingService.loadExercises(section.id);
  }

  public onChangeExercise(exercise: IExercise) {
    this._taskModifyingService.setSelectedExercise(exercise);
  }

  public onAddVariant(): void {
    const variants = this._taskModifyingService.getSelectedExercise().variants;
    variants.push(new Variant());
    this.variantsDataSource.data = variants;
    this._checkForUnsavedChanges();
  }

  public onRemoveVariant(): void {
    const variants = this._taskModifyingService.getSelectedExercise().variants;
    variants.splice(this.variantIndex, 1);
    this.variantsDataSource.data = variants;
    this._checkForUnsavedChanges();
  }

  public onVariantPaginatorChange(): void {
    const exercise = this._taskModifyingService.getSelectedExercise();
    this.tasksDataSource.data = exercise.variants.at(this.variantIndex).tasks;
    this.taskTypeFormArray.clear();
    for (const [index, task] of exercise.variants.at(this.variantIndex).tasks.entries()) {
      this.taskTypeFormArray.setControl(index, new FormControl(task.type));
    }
  }

  public onAddTask() {
    const tasks = this._taskModifyingService
      .getSelectedExercise()
      .variants.at(this.variantIndex).tasks;
    tasks.push(new PickTask({ type: 'PICK_ONE' }));
    this.taskTypeFormArray.setControl(tasks.length, new FormControl('PICK_ONE'));
    this.tasksDataSource.data = tasks;
    this._checkForUnsavedChanges();
  }

  public onRemoveTask(): void {
    const variants = this._taskModifyingService.getSelectedExercise().variants;
    const currentVariant = variants.at(this.variantIndex);

    if (currentVariant.tasks.length === 1) {
      variants.splice(this.variantIndex, 1);
      this.variantsDataSource.data = variants;
      return;
    }

    currentVariant.tasks.splice(this.taskIndex, 1);
    this.tasksDataSource.data = currentVariant.tasks;
    this._checkForUnsavedChanges();
  }

  public getTaskTypeControl(): FormControl {
    return this.taskTypeFormArray.at(this.taskIndex) as FormControl;
  }

  public getPickTaskData(): IPickTask {
    return this._getTaskData() as IPickTask;
  }

  public getMatchTaskData(): IMatchTask {
    return this._getTaskData() as IMatchTask;
  }

  public onRenameExerciseClick(): void {
    this._taskModifyingService.getSelectedExercise().title = this.renameExerciseControl.value;
    this.isShowApplyRename$.next(false);
    this._checkForUnsavedChanges();
  }

  public onSaveChanges(): void {
    const isValidChanges = this._taskModifyingService.validateChanges();
    this.isUnsavedChanges$.next(false);

    if (!isValidChanges) {
      this._confirmDialogService
        .confirm('INVALID_CHANGES_TITLE', 'INVALID_CHANGES_MESSAGE', 'CLOSE', 'HIDE')
        .subscribe();
      return;
    }

    if (this.isCreateTaskMode) {
      this._taskModifyingService.getSelectedExercise().title = this.exerciseControl.value;
    }

    this._taskModifyingService.saveChanges((this.sectionControl.value as ISection).id);
  }

  public onOptionSelectClick(select: MatSelect): void {
    if (select.panelOpen && this.isUnsavedChanges$.getValue()) {
      select.close();
      this._confirmDialogService
        .confirm(
          'BOOK_UNSAVED_CHANGES_TITLE',
          'BOOK_UNSAVED_CHANGES_MESSAGE',
          'CANCEL_CHANGES',
          'SAVE_CHANGES'
        )
        .subscribe((result) => {
          if (result) {
            this.onSaveChanges();
          } else {
            this._taskModifyingService.resetSelectedExercise();
            this.isUnsavedChanges$.next(false);
          }
          select.open();
        });
    }
  }

  public isPickTask(task: IPickTask | IMatchTask): boolean {
    return task.type === 'PICK_ONE' || task.type === 'PICK_SOME';
  }

  public isMatchTask(task: IPickTask | IMatchTask): boolean {
    return task.type === 'MATCH';
  }

  public onChangeTaskType(taskType: TaskType) {
    const variant = this._taskModifyingService.getSelectedExercise().variants.at(this.variantIndex);
    let newTask: IPickTask | IMatchTask;
    switch (taskType) {
      case 'PICK_ONE':
      case 'PICK_SOME': {
        newTask = new PickTask({ type: taskType });
        break;
      }
      case 'MATCH': {
        newTask = new MatchTask();
        break;
      }
      default: {
      }
    }
    variant.tasks.splice(this.taskIndex, 1, newTask);
    this.tasksDataSource.data = variant.tasks;
  }

  public onPickTaskChanged(value: IPickTask): void {
    this.isUnsavedChanges$.next(true);
    const variant = this._taskModifyingService.getSelectedExercise().variants.at(this.variantIndex);
    const taskToUpdate = variant.tasks.at(this.taskIndex) as IPickTask;
    taskToUpdate.question = value.question;
    taskToUpdate.answers = [...value.answers];
    this.tasksDataSource.data = variant.tasks;
  }

  public onMatchTaskChanged(value: IMatchTask): void {
    this.isUnsavedChanges$.next(true);
    const variant = this._taskModifyingService.getSelectedExercise().variants.at(this.variantIndex);
    const taskToUpdate = variant.tasks.at(this.taskIndex) as IMatchTask;
    taskToUpdate.answers = [...value.answers];
    this.tasksDataSource.data = variant.tasks;
  }

  private _getTaskData(): IPickTask | IMatchTask {
    return this._taskModifyingService
      .getSelectedExercise()
      .variants.at(this.variantIndex)
      .tasks.at(this.taskIndex);
  }

  private _checkForUnsavedChanges(): void {
    const exercise = this._taskModifyingService.getSelectedExercise();

    if (this.isCreateTaskMode) {
      this.isUnsavedChanges$.next(!!exercise.variants.length);
      return;
    }

    this.isUnsavedChanges$.next(true);
  }
}
