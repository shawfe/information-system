import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { AuthBaseModule } from '../auth-base/auth-base.module';
import { SignInComponent } from './sign-in.component';
import { SignInRoutingModule } from './sign-in.routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    SignInRoutingModule,
    TranslateModule,
    AuthBaseModule
  ],
  declarations: [SignInComponent]
})
export class SignInModule {}
