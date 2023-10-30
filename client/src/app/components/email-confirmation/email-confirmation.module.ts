import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthBaseModule } from 'app/auth/auth-base/auth-base.module';
import { EmailConfirmationComponent } from './email-confirmation.component';
import { EmailConfirmationRoutingModule } from './email-confirmation.routing.module';
import { EmailConfirmationService } from './email-confirmation.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    EmailConfirmationRoutingModule,
    AuthBaseModule,
    TranslateModule,
    MatButtonModule
  ],
  declarations: [EmailConfirmationComponent],
  providers: [EmailConfirmationService]
})
export class EmailConfirmationModule {}
