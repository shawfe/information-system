import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { RenameDialogModule } from 'app/components/rename-dialog/rename-dialog.module';
import { QuillModule } from 'ngx-quill';

import { BookEditingComponent } from './book-editing.component';
import { BookEditingService } from './book-editing.service';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    TranslateModule,
    QuillModule,
    MatSelectModule,
    RenameDialogModule,
    DragDropModule
  ],
  declarations: [BookEditingComponent],
  providers: [BookEditingService]
})
export class BookEditingModule {}
