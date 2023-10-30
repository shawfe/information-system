import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class SignUpGuard implements CanActivate {
  constructor(protected _router: Router, private _authService: AuthService) {}

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
      const token = next.queryParamMap.get('token');

      if (!token) {
        this._notAllow(observer);
        return;
      }

      this._authService.validateToken(token).subscribe({
        next: (result: { valid: boolean }) => {
          if (result.valid) {
            observer.next(true);
            observer.complete();
            return;
          }
          this._notAllow(observer);
        },
        error: () => {
          this._notAllow(observer);
        }
      });
    });
  }

  private _notAllow(observer: any) {
    this._router.navigate(['']);
    observer.next(false);
    observer.complete();
  }
}
