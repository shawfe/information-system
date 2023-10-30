import { AutofillMonitor } from '@angular/cdk/text-field';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EMAIL_PATTERN, MIN_LENGTH_PASSWORD } from 'app/models/auth.data';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Subject, takeUntil } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('emailInput', { static: false }) emailInput: ElementRef<HTMLElement>;
  @ViewChild('passwordInput', { static: false }) passwordInput: ElementRef<HTMLElement>;

  public error: string | null;
  public signInForm: FormGroup;

  public isAutofilled = false;
  public isHidePassword = true;
  public minLengthPassword = MIN_LENGTH_PASSWORD;

  private _unsubscribe = new Subject<void>();

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _toastrService: ToastrService,
    private _autofill: AutofillMonitor,
    private _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.signInForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_PATTERN)]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(this.minLengthPassword)
      ])
    });
  }

  ngAfterViewInit(): void {
    combineLatest([
      this._autofill.monitor(this.emailInput),
      this._autofill.monitor(this.passwordInput)
    ])
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(([login, pass]) => {
        this.isAutofilled = login.isAutofilled && pass.isAutofilled;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  public submit() {
    if (!this.signInForm.valid) {
      return;
    }

    this._authService
      .authenticate({
        email: this.signInForm.value.email,
        password: this.signInForm.value.password
      })
      .subscribe({
        next: (isAuth: boolean) => {
          if (!isAuth) {
            return;
          }
          this._translateService.get('SUCCEFSSFUL_LOGIN').subscribe((message) => {
            this._router.navigate(['../../']);
            this._toastrService.success(message);
          });
        },
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            this.error = err.error?.message || err.message;
          }
        }
      });
  }

  public isFormValid(): boolean {
    return this.isAutofilled || (this.signInForm.valid && this.signInForm.dirty);
  }

  public passwordShowHide(): void {
    this.isHidePassword = !this.isHidePassword;
  }

  public navigateToRestore(): void {
    this._router.navigate(['/auth/restore']);
  }
}
