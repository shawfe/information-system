import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this._authService.getTokenFromLocalStorage();

    if (!token) {
      request = this._addToken(request, token);
    }

    return next.handle(request).pipe(
      tap({
        error: (error: any) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            this._authService.setRedirectUrl(<string>error.url);
            this._authService.logout();
          }
          return throwError(() => error);
        }
      })
    );
  }

  private _addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
