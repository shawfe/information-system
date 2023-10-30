import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AUTH_QUERY_PARAMS } from 'app/models/auth.data';
import { URLS } from 'app/models/url.data';
import { UrlUtilities } from 'app/utilities/url.utilities';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';

@Injectable()
export class EmailConfirmationService {
  private readonly _url = URLS.EMAIL_CONFIRMATION;

  constructor(
    private _http: HttpClient,
    private _toastrService: ToastrService,
    private _translateSerivce: TranslateService,
    private _router: Router
  ) {}

  public confirmEmail(): void {
    const urlSearchParams = UrlUtilities.getUrlSearchParams();

    if (!urlSearchParams.has(AUTH_QUERY_PARAMS.TOKEN)) {
      this._translateSerivce.get('EMAIL_CONFIRMATION_INVALID_LINK').subscribe((message) => {
        this._toastrService.error(message, '', {
          disableTimeOut: true
        });
      });
      return;
    }

    this._requestConfirmEmail(urlSearchParams.get(AUTH_QUERY_PARAMS.TOKEN)).subscribe({
      next: () => {
        this._translateSerivce.get('EMAIL_CONFIRMATION_SUCCESS').subscribe((message) => {
          this._toastrService.success(message, '', {
            disableTimeOut: true
          });
        });
      },
      error: () => {
        this._translateSerivce.get('EMAIL_CONFIRMATION_ERROR').subscribe((message) => {
          this._toastrService.error(message, '', {
            disableTimeOut: true
          });
        });
      }
    });
  }

  public navigateToSignIn(): void {
    this._toastrService.clear();
    this._router.navigate(['../auth/']);
  }

  private _requestConfirmEmail(token: string): Observable<{ confirmed: boolean }> {
    return this._http
      .post(`${this._url}/confirm`, { token })
      .pipe(map((res: { confirmed: boolean }) => res));
  }
}
