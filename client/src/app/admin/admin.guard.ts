import { Injectable } from '@angular/core';
import { Router, Route, CanLoad } from '@angular/router';
import { map, Observable } from 'rxjs';

import { AuthService } from 'app/auth/auth.service';
import { IUserData } from 'app/models/user.data';
import { StateManagerUserService } from 'app/state-manger/state.manager.user.service';

@Injectable()
export class AdminGuard implements CanLoad {
  constructor(
    private _stateManagerUserService: StateManagerUserService,
    private _authService: AuthService,
    private _router: Router
  ) {}

  /**
   * Checks whether the user has role Admin
   * @param route Route which try to open
   */
  canLoad(route: Route): Observable<boolean> | boolean {
    let user = this._stateManagerUserService.getCurrentUser();

    if (user) {
      return this._isAdmin(route, user);
    }

    return this._authService.authorize().pipe(
      map((isLoggedIn) => {
        if (isLoggedIn) {
          return this._isAdmin(route, this._stateManagerUserService.getCurrentUser());
        }

        this._navigate(route);
        return false;
      })
    );
  }

  private _isAdmin(route: Route, user: IUserData): boolean {
    const isAdmin: boolean = user?.accountType === 'ADMIN';

    if (!isAdmin) {
      this._navigate(route);
    }

    return isAdmin;
  }

  private _navigate(route: Route) {
    const navigatePath =
      route.path === 'administration' ? '/administration/users-registration' : '/';
    this._router.navigate([navigatePath]);
  }
}
