import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { StateManagerUserService } from 'app/state-manger/state.manager.user.service';

import { UsersService } from './users.service';

@NgModule({
  imports: [CommonModule]
})
export class UsersModule {
  static forRoot(): ModuleWithProviders<UsersModule> {
    return {
      ngModule: UsersModule,
      providers: [UsersService, StateManagerUserService]
    };
  }
}
