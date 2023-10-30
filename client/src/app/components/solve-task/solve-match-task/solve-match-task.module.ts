import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { SolveMatchTaskComponent } from './solve-match-task.component';

@NgModule({
  imports: [CommonModule, MatButtonModule, TranslateModule, DragDropModule, MatIconModule],
  declarations: [SolveMatchTaskComponent],
  exports: [SolveMatchTaskComponent]
})
export class SolveMatchTaksModule {}
