import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { CustomPaginatorIntl } from '@shared/services/custom-paginator.service';

import { SignUpLinkModule } from '../sign-up-link/sign-up-link.module';
import { UserRegistrationComponent } from './user-registration.component';
import { UserRegistrationService } from './user-registration.service';

@NgModule({
  imports: [
    CommonModule,
    SignUpLinkModule,
    MatFormFieldModule,
    TranslateModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule
  ],
  declarations: [UserRegistrationComponent],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }, UserRegistrationService]
})
export class UserRegistrationModule {}
