import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';
import { IPickAnswer, IPickTask, PickTask } from 'app/models/exercise.data';
import { map, merge, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'solve-pick-task',
  templateUrl: './solve-pick-task.component.html',
  styleUrls: ['./solve-pick-task.component.scss']
})
export class SolvePickTaskComponent implements OnInit, OnDestroy {
  @Input() initialData: IPickTask;
  @Input() isLastTask: boolean;

  @Output() taskFinished = new EventEmitter<IPickTask>();

  public pickSomeFormArray = new FormArray([]);
  public pickOneControl = new FormControl('');
  public pickTask: IPickTask;
  public disableCompleteButton = true;

  private _answersChangesUnsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.pickTask = new PickTask(JSON.parse(JSON.stringify(this.initialData)));

    if (this.pickTask.type === 'PICK_ONE') {
      this.pickOneControl.valueChanges.subscribe((value: IPickAnswer) => {
        for (const answer of this.pickTask.answers) {
          if (answer.text === value.text) {
            answer.isRight = true;
            continue;
          }
          answer.isRight = false;
        }
      });
    } else {
      for (const index of this.pickTask.answers.keys()) {
        this.pickSomeFormArray.setControl(index, new FormControl(false));
      }
      this._watchForAnswersChanges();
    }
  }

  ngOnDestroy(): void {
    this._answersChangesUnsubscribe.next();
    this._answersChangesUnsubscribe.complete();
  }

  public onTaskComplete(): void {
    this.taskFinished.emit(this.pickTask);
  }

  public getPickSomeFormArrayControl(index: number): FormControl {
    return this.pickSomeFormArray.at(index) as FormControl;
  }

  private _watchForAnswersChanges(): void {
    this._answersChangesUnsubscribe.next();

    merge(
      ...this.pickSomeFormArray.controls.map((control: AbstractControl, index: number) =>
        control.valueChanges.pipe(
          takeUntil(this._answersChangesUnsubscribe),
          map((value) => ({ rowIndex: index, control: control, data: value }))
        )
      )
    ).subscribe((changes) => {
      this.pickTask.answers.at(changes.rowIndex).isRight = changes.data;
      this.disableCompleteButton = !this.pickTask.answers.some((answer) => answer.isRight);
    });
  }
}
