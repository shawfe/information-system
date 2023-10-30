import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { RenameDialogService } from './rename-dialog.service';
import { RenameDialogComponent } from './rename-dialog.component';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    TranslateModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  exports: [RenameDialogComponent],
  declarations: [RenameDialogComponent],
  entryComponents: [RenameDialogComponent]
})
export class RenameDialogModule {
  static forRoot(): ModuleWithProviders<RenameDialogModule> {
    return {
      ngModule: RenameDialogModule,
      providers: [RenameDialogService]
    };
  }
}
