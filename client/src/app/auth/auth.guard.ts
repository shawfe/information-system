import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthService, protected _router: Router) {}

  /**
   * Checks whether the user is authenticated
   * @param next ActivatedRouteSnapshot information about routeassociated with a component loaded
   * @param state RouterStateSnapshot tree snapshot of route
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable((observer) => {
      // Check whether the user is authorized
      this._authService.isTokenFromLocalStorage().subscribe((token: string) => {
        if (!token) {
          // Redirect to authentication page if user is not authorized
          this._router.navigate(['/auth']);
          observer.next(false);
          observer.complete();
          return;
        }
        this._authorize(observer);
      });
    });
  }

  private _authorize(observer: any) {
    // Authorize the logged-in user in the application
    this._authService.authorize().subscribe((subs: boolean) => {
      if (!subs) {
        this._router.navigate(['/auth']);
      }
      observer.next(subs);
      observer.complete();
    });
  }
}
