import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpGuard } from './sign-up/sign-up.guard';

const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full'
  },
  {
    path: 'sign-in',
    loadChildren: () => import('app/auth/sign-in/sign-in.module').then((mod) => mod.SignInModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('app/auth/sign-up/sign-up.module').then((mod) => mod.SignUpModule),
    canActivate: [SignUpGuard]
  },
  {
    path: 'new-password',
    loadChildren: () =>
      import('app/auth/new-password/new-password.module').then((mod) => mod.NewPasswordModule)
  },
  {
    path: 'restore',
    loadChildren: () => import('app/auth/restore/restore.module').then((mod) => mod.RestoreModule)
  },
  {
    path: 'sign-up-finished',
    loadChildren: () =>
      import('app/auth/sign-up-finished/sign-up-finished.module').then(
        (mod) => mod.SignUpFinishedModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
