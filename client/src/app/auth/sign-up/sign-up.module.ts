import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

import { AuthBaseModule } from '../auth-base/auth-base.module';
import { SignUpComponent } from './sign-up.component';
import { SignUpRoutingModule } from './sign-up.routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    SignUpRoutingModule,
    AuthBaseModule
  ],
  declarations: [SignUpComponent]
})
export class SignUpModule {}
