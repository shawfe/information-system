import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EditorComponent } from './editor.component';
import { EditorService } from './editor.service';

@NgModule({
  imports: [CommonModule],
  exports: [EditorComponent],
  declarations: [EditorComponent],
  providers: [EditorService]
})
export class EditorModule {}
