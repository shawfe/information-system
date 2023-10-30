import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { AuthBaseModule } from '../auth-base/auth-base.module';
import { NewPasswordComponent } from './new-password.component';
import { NewPasswordRoutingModule } from './new-password.routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TranslateModule,
    ToastrModule,
    MatButtonModule,

    AuthBaseModule,
    NewPasswordRoutingModule
  ],
  declarations: [NewPasswordComponent]
})
export class NewPasswordModule {}
