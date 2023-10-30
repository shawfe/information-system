import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { SolveTaskModule } from '../solve-task/solve-task.module';
import { ToolbarModule } from '../toolbar/toolbar.module';

import { BookComponent } from './book.component';
import { BookRoutingModule } from './book.routing.module';
import { BookService } from './book.service';

@NgModule({
  imports: [
    CommonModule,
    BookRoutingModule,
    ToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    TranslateModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    SolveTaskModule
  ],
  exports: [],
  declarations: [BookComponent],
  providers: [BookService]
})
export class BookModule {}
