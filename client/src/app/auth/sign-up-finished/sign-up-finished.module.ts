import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

import { AuthBaseModule } from '../auth-base/auth-base.module';
import { SignUpFinishedComponent } from './sign-up-finished.component';
import { SignUpFinishedRoutingModule } from './sign-up-finished.routing.module';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    TranslateModule,

    AuthBaseModule,
    SignUpFinishedRoutingModule
  ],
  declarations: [SignUpFinishedComponent]
})
export class SignUpFinishedModule {}
