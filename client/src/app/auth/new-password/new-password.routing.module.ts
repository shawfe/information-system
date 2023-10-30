import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPasswordComponent } from './new-password.component';

const newPasswordRoutes: Routes = [
  {
    path: '',
    component: NewPasswordComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(newPasswordRoutes)],
  exports: [RouterModule]
})
export class NewPasswordRoutingModule {}
