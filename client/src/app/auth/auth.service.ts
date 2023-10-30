import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';

import { GetUrlService } from '@shared';
import { AuthResponse } from './auth-response.model';
import { UsersService } from 'app/users/users.service';
import { ToastrService } from 'ngx-toastr';
import { URLS } from 'app/models/url.data';
import { IUserSignIn, IUserSignUp, UserResetPassword } from 'app/models/user.data';

export const AUTH_TOKEN = 'AUTH_TOKEN';

@Injectable()
export class AuthService {
  public get isUserAuth(): boolean {
    return !!this.getTokenFromLocalStorage();
  }

  private readonly _url = URLS.AUTH;
  private _redirectUrl: string = '/';

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _getUrlService: GetUrlService,
    private _usersService: UsersService,
    private _toastService: ToastrService
  ) {}

  public authenticate(userData: IUserSignIn): Observable<boolean> {
    return this._http.post<AuthResponse>(`${this._url}/signin`, userData).pipe(
      map((response) => {
        if (!response.token) {
          return false;
        }

        this._setTokenToLocalStorege(response.token);
        return true;
      })
    );
  }

  public register(userData: IUserSignUp): Observable<boolean> {
    return this._http.post<boolean>(`${this._url}/signup`, userData);
  }

  public resore(email: string): Observable<any> {
    return this._http.post(`${this._url}/restore`, { email });
  }

  public resetPassword(data: UserResetPassword): Observable<any> {
    return this._http.post(`${this._url}/reset`, data);
  }

  public logout(): void {
    localStorage.removeItem(AUTH_TOKEN);
    this._usersService.clearCurrentUserData();
    this._router.navigate(['auth']);
  }

  public getTokenFromLocalStorage(): string | null {
    return localStorage.getItem(AUTH_TOKEN);
  }

  public isTokenFromLocalStorage(): Observable<string> {
    return of(localStorage.getItem(AUTH_TOKEN));
  }

  public setRedirectUrl(url: string): void {
    this._redirectUrl = url;
  }

  public getRedirectUrl(): string {
    return this._redirectUrl;
  }

  public authorize(): Observable<boolean> {
    return this._usersService.activate();
  }

  public validateToken(token: string) {
    return this._http.post('api/validate-token', { token });
  }

  private _setTokenToLocalStorege(token: string) {
    if (!token) {
      return;
    }

    localStorage.setItem(AUTH_TOKEN, token);
  }
}
