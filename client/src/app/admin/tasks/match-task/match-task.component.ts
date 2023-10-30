import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  IMatchAnswer,
  IMatchTask,
  MatchAnswer,
  MatchTask,
  TaskType
} from 'app/models/exercise.data';
import { map, merge, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'match-task',
  templateUrl: './match-taks.component.html',
  styleUrls: ['./match-task.component.scss']
})
export class MatchTaskComponent implements OnInit, OnDestroy {
  @Input() taskType: TaskType;
  @Input() initialData: IMatchTask;

  @Output() taskChanged = new EventEmitter<IMatchTask>();

  public taskFormGroup: FormGroup;
  public pairsFormArray = new FormArray([]);

  private _answersChangesUnsubscribe = new Subject<void>();
  private _matchTask: IMatchTask;

  constructor() {}

  ngOnInit(): void {
    if (this.initialData) {
      for (const pair of this.initialData.answers) {
        this.pairsFormArray.insert(this.pairsFormArray.length, this._createPairControl(pair));
      }
      this._matchTask = new MatchTask(JSON.parse(JSON.stringify(this.initialData)));
    } else {
      this._matchTask = new MatchTask({ type: this.taskType });
    }
    this._watchForAnswersChanges();
  }

  ngOnDestroy(): void {
    this._answersChangesUnsubscribe.next();
    this._answersChangesUnsubscribe.complete();
  }

  public onAddPair(): void {
    this.pairsFormArray.insert(this.pairsFormArray.length, this._createPairControl());
    this._matchTask.answers.push(new MatchAnswer());
    this.taskChanged.emit(this._matchTask);
    this._watchForAnswersChanges();
  }

  public onRemovePair(index: number): void {
    this.pairsFormArray.removeAt(index);
    this._matchTask.answers.splice(index, 1);
    this.taskChanged.emit(this._matchTask);
    this._watchForAnswersChanges();
  }

  public getAsnwersFormArrayControl(index: number): FormGroup {
    return this.pairsFormArray.at(index) as FormGroup;
  }

  public getLeftPartControl(index: number): FormControl {
    return this.getAsnwersFormArrayControl(index).get('leftPart') as FormControl;
  }

  public getRightPartControl(index: number): FormControl {
    return this.getAsnwersFormArrayControl(index).get('rightPart') as FormControl;
  }

  private _watchForAnswersChanges() {
    this._answersChangesUnsubscribe.next();

    merge(
      ...this.pairsFormArray.controls.map((control: AbstractControl, index: number) =>
        control.valueChanges.pipe(
          takeUntil(this._answersChangesUnsubscribe),
          map((value) => ({ rowIndex: index, control: control, data: value }))
        )
      )
    ).subscribe((changes) => {
      this._matchTask.answers.at(changes.rowIndex).leftPart = changes.data.leftPart;
      this._matchTask.answers.at(changes.rowIndex).rightPart = changes.data.rightPart;
      this.taskChanged.emit(this._matchTask);
    });
  }

  private _createPairControl(pair?: IMatchAnswer) {
    return new FormGroup({
      leftPart: new FormControl(pair?.leftPart ?? ''),
      rightPart: new FormControl(pair?.rightPart ?? '')
    });
  }
}
