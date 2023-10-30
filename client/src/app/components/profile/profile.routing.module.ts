import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileDataComponent } from './profile-data/profile-data.component';
import { ProfileComponent } from './profile.component';

const profileRoutes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    pathMatch: 'full'
  },
  { path: 'profile-data', component: ProfileDataComponent, outlet: 'profileOutlet' }
];

@NgModule({
  imports: [RouterModule.forChild(profileRoutes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
