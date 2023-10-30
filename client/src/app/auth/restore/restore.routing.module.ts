import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestoreComponent } from './restore.component';

const restoreRoutes: Routes = [
  {
    path: '',
    component: RestoreComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(restoreRoutes)],
  exports: [RouterModule]
})
export class RestoreRoutingModule {}
