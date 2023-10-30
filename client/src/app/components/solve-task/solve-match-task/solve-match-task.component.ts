import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IMatchTask, MatchTask } from 'app/models/exercise.data';

@Component({
  selector: 'solve-match-task',
  templateUrl: './solve-match-task.component.html',
  styleUrls: ['./solve-match-task.component.scss']
})
export class SolveMatchTaskComponent implements OnInit {
  @Input() initialData: IMatchTask;
  @Input() isLastTask: boolean;

  @Output() taskFinished = new EventEmitter<IMatchTask>();

  public matchTask: IMatchTask;
  public disableCompleteButton = true;
  public leftParts: string[] = [];
  public rightParts: string[] = [];

  ngOnInit(): void {
    this.matchTask = new MatchTask(JSON.parse(JSON.stringify(this.initialData)));
    for (const answer of this.matchTask.answers) {
      this.leftParts.push(answer.leftPart);
      this.rightParts.push(answer.rightPart);
    }
  }

  public onTaskComplete(): void {
    this.taskFinished.emit(this.matchTask);
  }

  public onDropRightPart(event: CdkDragDrop<string[]>): void {
    if (event.currentIndex === event.previousIndex) {
      return;
    }

    const rightPart = event.container.data.at(event.previousIndex);

    this.rightParts.splice(event.previousIndex, 1);
    this.rightParts.splice(event.currentIndex, 0, rightPart);

    for (const [index, answer] of this.matchTask.answers.entries()) {
      answer.rightPart = this.rightParts.at(index);
    }

    this.disableCompleteButton = false;
  }
}
