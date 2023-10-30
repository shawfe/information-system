import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page.component';
import { MainPageGuard } from './main-page.guard';

const mainPageRoutes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    pathMatch: 'full'
  },
  {
    path: 'js-book',
    loadChildren: () => import('app/components/book/book.module').then((mod) => mod.BookModule),
    canActivate: [MainPageGuard]
  },
  {
    path: 'ts-book',
    loadChildren: () => import('app/components/book/book.module').then((mod) => mod.BookModule),
    canActivate: [MainPageGuard]
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('app/components/profile/profile.module').then((mod) => mod.ProfileModule),
    canActivate: [MainPageGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(mainPageRoutes)],
  exports: [RouterModule]
})
export class MainPageRoutingModule {}
