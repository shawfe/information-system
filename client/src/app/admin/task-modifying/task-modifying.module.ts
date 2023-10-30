import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

import { TaskModifyingComponent } from './task-modifying.component';
import { TaskModifyingService } from './task-modifying.service';
import { MatCardModule } from '@angular/material/card';
import { PickTaskModule } from '../tasks/pick-task/pick-task.module';
import { MatchTaskModule } from '../tasks/match-task/match-task.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSelectModule,
    MatCardModule,
    PickTaskModule,
    MatchTaskModule
  ],
  declarations: [TaskModifyingComponent],
  providers: [TaskModifyingService]
})
export class TaskModifyingModule {}
