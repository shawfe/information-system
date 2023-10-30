import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EMAIL_PATTERN, MIN_LENGTH_PASSWORD } from 'app/models/auth.data';
import { CustomValidators } from 'app/utilities/validator.utilits';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public signUpForm: FormGroup;
  public hidePasswordStates = {
    password: true,
    confirmPassword: true
  };
  public minLengthPassword = MIN_LENGTH_PASSWORD;

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _translateService: TranslateService,
    private _toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.signUpForm = new FormGroup(
      {
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_PATTERN)]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(this.minLengthPassword)
        ]),
        confirmPassword: new FormControl('', [Validators.required])
      },
      CustomValidators.mustMatch('password', 'confirmPassword')
    );
  }

  public submit() {
    if (!this.signUpForm.valid) {
      return;
    }

    this._authService
      .register({
        firstName: this.signUpForm.value.firstName,
        lastName: this.signUpForm.value.lastName,
        email: this.signUpForm.value.email,
        password: this.signUpForm.value.password
      })
      .subscribe({
        next: (success: boolean) => {
          if (!success) {
            this._translateService.get('BASIC_ERROR_MESSAGE').subscribe((res) => {
              this._toastrService.error(res);
            });
            return;
          }

          this._router.navigate(['/auth/sign-up-finished']);
          this._translateService.get('CONFIRM_EMAIL_MESSAGE').subscribe((res) => {
            this._toastrService.success(res);
          });
        },
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            this._translateService.get('BASIC_ERROR_MESSAGE').subscribe((res) => {
              this._toastrService.error(res);
            });
          }
        }
      });
  }

  public passwordShowHide(key: 'password' | 'confirmPassword'): void {
    this.hidePasswordStates[key] = !this.hidePasswordStates[key];
  }

  public navigateToSignIn(): void {
    this._router.navigate(['/auth/sign-in']);
  }

  private _checkPasswords(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      let pass = group.get('password').value;
      let confirmPass = group.get('confirmPassword').value;

      return pass === confirmPass ? null : { notSame: true };
    };
  }
}
