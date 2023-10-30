import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpFinishedComponent } from './sign-up-finished.component';

const signUpFinishedRoutes: Routes = [
  {
    path: '',
    component: SignUpFinishedComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(signUpFinishedRoutes)],
  exports: [RouterModule]
})
export class SignUpFinishedRoutingModule {}
