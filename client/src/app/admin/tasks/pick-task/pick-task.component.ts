import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { IPickTask, PickAnswer, PickTask, TaskType } from 'app/models/exercise.data';
import { map, merge, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'pick-task',
  templateUrl: './pick-taks.component.html',
  styleUrls: ['./pick-task.component.scss']
})
export class PickTaskComponent implements OnInit, OnDestroy {
  @Input() taskType: TaskType;
  @Input() initialData: IPickTask;

  @Output() taskChanged = new EventEmitter<IPickTask>();

  public taskFormGroup: FormGroup;
  public questionControl = new FormControl('');
  public answersFormArray = new FormArray([]);

  private _answersChangesUnsubscribe = new Subject<void>();
  private _pickTask: IPickTask;

  ngOnInit(): void {
    if (this.initialData) {
      this.questionControl.setValue(this.initialData.question);

      for (const answer of this.initialData.answers) {
        this.answersFormArray.insert(this.answersFormArray.length, new FormControl(answer.text));
      }
      this._pickTask = new PickTask(JSON.parse(JSON.stringify(this.initialData)));
    } else {
      this._pickTask = new PickTask({ type: this.taskType });
    }

    this.questionControl.valueChanges.subscribe((value) => {
      this._pickTask.question = value;
      this.taskChanged.emit(this._pickTask);
    });
    this._watchForAnswersChanges();
  }

  ngOnDestroy(): void {
    this._answersChangesUnsubscribe.next();
    this._answersChangesUnsubscribe.complete();
  }

  public onAddAnswer(): void {
    this.answersFormArray.insert(this.answersFormArray.length, new FormControl(''));
    this._pickTask.answers.push(new PickAnswer());
    this.taskChanged.emit(this._pickTask);
    this._watchForAnswersChanges();
  }

  public onMarkRightAnswer(index: number, event: MouseEvent): void {
    event.stopPropagation();
    if (this._pickTask.type === 'PICK_ONE') {
      for (const [answerIndex, answer] of this._pickTask.answers.entries()) {
        if (answerIndex !== index) {
          answer.isRight = false;
          continue;
        }
        answer.isRight = !answer.isRight;
      }
    } else {
      this._pickTask.answers.at(index).isRight = !this._pickTask.answers.at(index).isRight;
    }
    this.taskChanged.emit(this._pickTask);
  }

  public getMarkState(index: number): boolean {
    return this._pickTask.answers.at(index).isRight;
  }

  public onRemoveAnswer(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.answersFormArray.removeAt(index);
    this._pickTask.answers.splice(index, 1);
    this.taskChanged.emit(this._pickTask);
    this._watchForAnswersChanges();
  }

  public getAsnwersFormArrayControl(index: number): FormControl {
    return this.answersFormArray.at(index) as FormControl;
  }

  private _watchForAnswersChanges() {
    this._answersChangesUnsubscribe.next();

    merge(
      ...this.answersFormArray.controls.map((control: AbstractControl, index: number) =>
        control.valueChanges.pipe(
          takeUntil(this._answersChangesUnsubscribe),
          map((value) => ({ rowIndex: index, control: control, data: value }))
        )
      )
    ).subscribe((changes) => {
      this._pickTask.answers.at(changes.rowIndex).text = changes.data;
      this.taskChanged.emit(this._pickTask);
    });
  }
}
