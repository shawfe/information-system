import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthBaseComponent } from './auth-base.component';

@NgModule({
  imports: [CommonModule, MatIconModule],
  declarations: [AuthBaseComponent],
  exports: [AuthBaseComponent]
})
export class AuthBaseModule {}
