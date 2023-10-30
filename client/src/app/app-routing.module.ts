import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { MainPageGuard } from './components/main-page/main-page.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('app/components/main-page/main-page.module').then((mod) => mod.MainPageModule),
    canActivate: [MainPageGuard]
  },

  {
    path: 'auth',
    loadChildren: () => import('app/auth/auth.module').then((mod) => mod.AuthModule)
  },
  {
    path: 'administration',
    loadChildren: () => import('app/admin/admin.module').then((mod) => mod.AdminModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'email-confirmation',
    loadChildren: () =>
      import('app/components/email-confirmation/email-confirmation.module').then(
        (mod) => mod.EmailConfirmationModule
      )
  },
  {
    path: '**',
    redirectTo: 'main',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
