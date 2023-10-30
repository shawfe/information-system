import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ConfirmDialogService } from './confirm-dialog.service';
import { ConfirmDialogComponent } from './confirm-dialog.component';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    TranslateModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  exports: [ConfirmDialogComponent],
  declarations: [ConfirmDialogComponent],
  entryComponents: [ConfirmDialogComponent]
})
export class ConfirmDialogModule {
  static forRoot(): ModuleWithProviders<ConfirmDialogModule> {
    return {
      ngModule: ConfirmDialogModule,
      providers: [ConfirmDialogService]
    };
  }
}
