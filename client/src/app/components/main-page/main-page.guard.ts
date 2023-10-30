import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthGuard } from 'app/auth/auth.guard';
import { AuthService } from 'app/auth/auth.service';
import { StateManagerAppService } from 'app/state-manger/state.manager.app.service';
import { StateManagerUserService } from 'app/state-manger/state.manager.user.service';
import { Observable } from 'rxjs';

@Injectable()
export class MainPageGuard extends AuthGuard {
  constructor(
    private _stateManagerAppService: StateManagerAppService,
    private _stateManagerUserService: StateManagerUserService,
    _authService: AuthService,
    _router: Router
  ) {
    super(_authService, _router);
  }

  /**
   * Checks whether the user is authenticated
   * @param next ActivatedRouteSnapshot information about routeassociated with a component loaded
   * @param state RouterStateSnapshot tree snapshot of route
   */
  override canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable((observer) => {
      (<Observable<boolean>>super.canActivate(next, state)).subscribe((subs: boolean) => {
        let result = subs;

        if (result) {
          const userData = this._stateManagerUserService.getCurrentUser();

          if (userData.accountType === 'ADMIN') {
            this._router.navigate(['/administration']);
          } else if (userData.confirmationStatus === 'REGISTERED') {
            this._router.navigate(['../auth/sign-up-finished']);
          }
        }

        observer.next(result);
        observer.complete();
      });
    });
  }
}
