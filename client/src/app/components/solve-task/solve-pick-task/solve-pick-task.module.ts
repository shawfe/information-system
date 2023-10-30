import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { SolvePickTaskComponent } from './solve-pick-task.component';

@NgModule({
  imports: [
    CommonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [SolvePickTaskComponent],
  exports: [SolvePickTaskComponent]
})
export class SolvePickTaksModule {}
