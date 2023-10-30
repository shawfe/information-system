import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { AuthBaseModule } from '../auth-base/auth-base.module';
import { RestoreComponent } from './restore.component';
import { RestoreRoutingModule } from './restore.routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    TranslateModule,
    ToastrModule,

    AuthBaseModule,
    RestoreRoutingModule
  ],
  declarations: [RestoreComponent]
})
export class RestoreModule {}
