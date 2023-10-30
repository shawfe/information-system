import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IExercise, IMatchTask, IPickTask } from 'app/models/exercise.data';
import { Observable } from 'rxjs';

@Component({
  selector: 'solve-task',
  templateUrl: './solve-task.component.html',
  styleUrls: ['./solve-task.component.scss']
})
export class SolveTaskComponent implements OnInit {
  @ViewChild('taskPaginator') set taskPaginatorElement(paginator: MatPaginator) {
    this._taskPaginator = paginator;
    this.tasksDataSource.paginator = paginator;
  }

  @Input() exercise: IExercise;

  @Output() exerciseFinished = new EventEmitter<IExercise>();
  @Output() taskIndexChanged = new EventEmitter<number>();

  public tasksDataSource = new MatTableDataSource<IPickTask | IMatchTask>();
  public tasks$: Observable<(IPickTask | IMatchTask)[]>;

  private _taskPaginator: MatPaginator;

  get taskIndex(): number {
    return this._taskPaginator?.pageIndex ?? 0;
  }

  constructor() {}

  ngOnInit(): void {
    this.tasks$ = this.tasksDataSource.connect();
    if (!this.exercise.variants.length) {
      return;
    }
    this.tasksDataSource.data = this.exercise.variants.at(0).tasks;
  }

  public isPickTask(task: IPickTask | IMatchTask): boolean {
    return task.type === 'PICK_ONE' || task.type === 'PICK_SOME';
  }

  public isMatchTask(task: IPickTask | IMatchTask): boolean {
    return task.type === 'MATCH';
  }

  public getPickTaskData(): IPickTask {
    return this._getTaskData() as IPickTask;
  }

  public getMatchTaskData(): IMatchTask {
    return this._getTaskData() as IMatchTask;
  }

  public isLastTask(): boolean {
    return this.taskIndex === this.tasksDataSource.data.length - 1;
  }

  public onTaskFinished(data: IPickTask | IMatchTask): void {
    if (this._taskPaginator.length - 1 > this.taskIndex) {
      this.exercise.variants.at(0).tasks.splice(this.taskIndex, 1, data);
      this._taskPaginator.nextPage();
      this.taskIndexChanged.emit(this.taskIndex);
      return;
    }

    this.exerciseFinished.emit(this.exercise);
  }

  private _getTaskData(): IPickTask | IMatchTask {
    return this.exercise.variants.at(0).tasks.at(this.taskIndex);
  }
}
