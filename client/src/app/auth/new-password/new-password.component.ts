import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AUTH_QUERY_PARAMS, MIN_LENGTH_PASSWORD } from 'app/models/auth.data';
import { UrlUtilities } from 'app/utilities/url.utilities';
import { CustomValidators } from 'app/utilities/validator.utilits';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

@Component({
  selector: 'new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  public passwordFormGroup: FormGroup;

  public hidePasswordStates = {
    newPassword: true,
    confirmNewPassword: true
  };
  public minLengthPassword = MIN_LENGTH_PASSWORD;

  get newPasswordControl(): FormControl {
    return this.passwordFormGroup.get('newPassword') as FormControl;
  }

  get repeatNewPasswordControl(): FormControl {
    return this.passwordFormGroup.get('repeatNewPassword') as FormControl;
  }

  private _token: string;

  constructor(
    private _authService: AuthService,
    private _translateService: TranslateService,
    private _toastrService: ToastrService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.passwordFormGroup = new FormGroup(
      {
        newPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(this.minLengthPassword)
        ]),
        repeatNewPassword: new FormControl('', [Validators.required])
      },
      CustomValidators.mustMatch('newPassword', 'repeatNewPassword')
    );

    this._token = UrlUtilities.getUrlSearchParams().get(AUTH_QUERY_PARAMS.TOKEN);
  }

  public onSave(): void {
    this._authService
      .resetPassword({
        token: this._token,
        password: this.newPasswordControl.value
      })
      .subscribe({
        next: () => {
          this._translateService.get('RESET_PASSWORD_SUCCESS').subscribe((message) => {
            this._toastrService.success(message);
            this._router.navigate(['/auth/sign-in']);
          });
        },
        error: () => {
          this._translateService.get('RESET_PASSOWRD_ERROR').subscribe((message) => {
            this._toastrService.error(message);
          });
        }
      });
  }

  public passwordShowHide(key: 'newPassword' | 'confirmNewPassword'): void {
    this.hidePasswordStates[key] = !this.hidePasswordStates[key];
  }
}
