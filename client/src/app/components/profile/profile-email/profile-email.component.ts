import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { EMAIL_PATTERN } from 'app/models/auth.data';
import { IUserData, UserUpdateSelf } from 'app/models/user.data';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'profile-email',
  templateUrl: './profile-email.component.html',
  styleUrls: ['./profile-email.component.scss']
})
export class ProfileEmailComponent implements OnInit, OnDestroy {
  public oldEmailControl: FormControl;
  public newEmailControl: FormControl;

  private _currentUser: IUserData;
  private _unsubscribe = new Subject<void>();

  constructor(private _profileService: ProfileService) {}

  ngOnInit(): void {
    this.oldEmailControl = new FormControl({ value: '', disabled: true });
    this.newEmailControl = new FormControl('', [
      Validators.required,
      this._sameEmailValidator(),
      Validators.pattern(EMAIL_PATTERN)
    ]);

    this._profileService
      .getCurrentUserObservale()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((user) => {
        this._currentUser = user;
        this.oldEmailControl.setValue(user.email);
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  private _sameEmailValidator(): ValidatorFn {
    return (control: FormControl): ValidationErrors | null => {
      return this._currentUser?.email === control.value ? { notChanged: true } : null;
    };
  }

  public onSave(): void {
    const data: Partial<UserUpdateSelf> = {
      email: this.newEmailControl.value
    };

    this._profileService.resetControl(this.newEmailControl, '');
    this._profileService.updateCurrnetUser(data);
  }
}
