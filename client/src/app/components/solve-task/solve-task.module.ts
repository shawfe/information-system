import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { CustomPaginatorIntl } from '@shared/services/custom-paginator.service';

import { SolvePickTaksModule } from './solve-pick-task/solve-pick-task.module';
import { SolveMatchTaksModule } from './solve-match-task/solve-match-task.module';
import { SolveTaskComponent } from './solve-task.component';
import { SolveTaskService } from './solve-task.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    DragDropModule,
    MatRadioModule,
    MatCheckboxModule,
    TranslateModule,
    MatPaginatorModule,
    SolvePickTaksModule,
    SolveMatchTaksModule
  ],
  declarations: [SolveTaskComponent],
  providers: [SolveTaskService, { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
  exports: [SolveTaskComponent]
})
export class SolveTaskModule {}
