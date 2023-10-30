import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailConfirmationComponent } from './email-confirmation.component';

const emailConfirmationRoutes: Routes = [
  {
    path: '',
    component: EmailConfirmationComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(emailConfirmationRoutes)],
  exports: [RouterModule]
})
export class EmailConfirmationRoutingModule {}
