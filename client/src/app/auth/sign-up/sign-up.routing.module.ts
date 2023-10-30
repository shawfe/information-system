import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up.component';

const signUpRoutes: Routes = [
  {
    path: '',
    component: SignUpComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(signUpRoutes)],
  exports: [RouterModule]
})
export class SignUpRoutingModule {}
